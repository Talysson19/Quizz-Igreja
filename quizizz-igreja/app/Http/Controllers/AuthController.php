<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Church;


class AuthController extends Controller
{
    // Método para Criar Conta (Register)
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'points' => 0
        ]);

        // Gera o token para o novo usuário
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuário criado com sucesso!',
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    // Método para Login
    public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Credenciais inválidas'], 401);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'access_token' => $token,
        'token_type' => 'Bearer',
        'role' => $user->role,
        'must_change_password' => (bool) $user->must_change_password, // O front vai ler isso aqui
        'message' => $user->must_change_password ? 'Troca de senha obrigatória!' : 'Bem-vindo!'
    ]);
}

    // Método para Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso.'
        ]);
    }
    public function registerChurch(Request $request)
{
    $request->validate([
        'church_name' => 'required|string|max:255',
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|unique:users',
        'password' => 'required|string|min:6',
    ]);

    // 1. Cria a Igreja primeiro
    $church = Church::create([
        'name' => $request->church_name,
        'responsible_name' => $request->name,
    ]);

    // 2. Cria o Usuário vinculado a essa igreja como ADMIN [cite: 44, 47, 50]
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'church_id' => $church->id,
        'role' => 'admin', // Define o poder de ADM [cite: 49, 56]
        'must_change_password' => false // ADM cria a própria senha, não precisa trocar [cite: 54]
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Igreja e Administrador cadastrados com sucesso!',
        'access_token' => $token,
        'church' => $church->name
    ], 201);
}

public function uploadManual(Request $request)
{
    $request->validate([
        'manual' => 'required|mimes:pdf|max:10000',
    ]);

    $user = $request->user();
    $churchId = $user->church_id;

    if ($request->hasFile('manual')) {
        $path = public_path('manuals');

        // Garante que a pasta existe (boa prática de CC)
        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }

        $fileName = 'manual_church_' . $churchId . '.pdf';
        $request->file('manual')->move($path, $fileName);

        // Atualiza o caminho no banco da Igreja
        \App\Models\Church::where('id', $churchId)->update([
            'manual_path' => 'manuals/' . $fileName
        ]);

        return response()->json(['message' => 'Manual atualizado!']);
    }
}

public function registerAcolyte(Request $request)
{
    $admin = $request->user();

    // Segurança: Apenas ADM pode cadastrar acólitos [cite: 14]
    if ($admin->role !== 'admin') {
        return response()->json(['error' => 'Acesso negado.'], 403);
    }

    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|unique:users',
        'password' => 'required|string|min:6', // Senha inicial criada pelo ADM [cite: 28]
    ]);

    $acolyte = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'church_id' => $admin->church_id, // Vincula automaticamente à igreja do ADM [cite: 27]
        'role' => 'acolyte',
        'must_change_password' => true, // Obriga a trocar no 1º acesso [cite: 31]
    ]);

    return response()->json([
        'message' => 'Acólito cadastrado com sucesso!',
        'acolyte' => $acolyte->name
    ], 201);
}

public function changePassword(Request $request)
{
    $request->validate([
        'password' => 'required|string|min:6|confirmed', // 'password_confirmation' no payload
    ]);

    $user = $request->user();

    $user->update([
        'password' => Hash::make($request->password),
        'must_change_password' => false // Trava liberada!
    ]);

    return response()->json(['message' => 'Senha atualizada com sucesso! Agora você pode acessar o sistema.']);
}

public function adminDashboard(Request $request)
{
    $admin = $request->user();

    // Segurança: Garante que apenas usuários com perfil 'admin' acessem [cite: 14]
    if ($admin->role !== 'admin') {
        return response()->json(['error' => 'Acesso negado. Perfil de administrador necessário.'], 403);
    }

    // Busca os acólitos vinculados à mesma igreja do ADM [cite: 23, 38]
    $acolytes = User::where('church_id', $admin->church_id)
        ->where('role', 'acolyte')
        ->select('id', 'name', 'email', 'points', 'must_change_password')
        ->get();

    return response()->json([
        'church_name' => Church::find($admin->church_id)->name, // Nome da igreja do ADM
        'total_acolytes' => $acolytes->count(),
        'data' => $acolytes // Lista de acólitos com progresso e pontuação [cite: 39, 42]
    ]);
}

public function resetAcolytePassword(Request $request)
{
    $admin = $request->user();

    // 1. Bloqueio de segurança
    if ($admin->role !== 'admin') {
        return response()->json(['error' => 'Acesso negado.'], 403);
    }

    $request->validate([
        'acolyte_id' => 'required|exists:users,id',
    ]);

    // 2. Busca o acólito garantindo que ele seja da MESMA igreja
    $acolyte = User::where('id', $request->acolyte_id)
                   ->where('church_id', $admin->church_id)
                   ->where('role', 'acolyte')
                   ->first();

    if (!$acolyte) {
        return response()->json(['error' => 'Acólito não encontrado na sua paróquia.'], 404);
    }

    // 3. Reset de senha
    $acolyte->update([
        'password' => Hash::make('mudar123'), // Senha padrão de reset
        'must_change_password' => true        // Obriga a trocar no próximo login
    ]);

    return response()->json([
        'message' => "Senha de {$acolyte->name} resetada para: mudar123",
        'status' => 'O usuário deverá trocar a senha no próximo acesso.'
    ]);
}
public function listAcolytes() {
    // Retorna todos os usuários que são acólitos daquela igreja
    return response()->json(User::where('role', 'acolyte')->get());
}

// 1. Editar Acólito
public function updateAcolyte(Request $request, $id)
{
    $admin = $request->user();

    // Busca o acólito garantindo que ele seja da MESMA igreja do admin
    $acolyte = User::where('id', $id)
                   ->where('church_id', $admin->church_id)
                   ->where('role', 'acolyte')
                   ->firstOrFail();

    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|unique:users,email,' . $id,
    ]);

    $acolyte->update([
        'name' => $request->name,
        'email' => $request->email,
    ]);

    return response()->json(['message' => 'Acólito atualizado com sucesso!', 'acolyte' => $acolyte]);
}

// 2. Excluir Acólito
public function deleteAcolyte(Request $request, $id)
{
    $admin = $request->user();

    $acolyte = User::where('id', $id)
                   ->where('church_id', $admin->church_id)
                   ->where('role', 'acolyte')
                   ->firstOrFail();

    $acolyte->delete();

    return response()->json(['message' => 'Acólito removido da paróquia.']);
}
}
