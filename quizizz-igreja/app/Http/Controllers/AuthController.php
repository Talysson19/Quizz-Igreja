<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Church;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    // --- AUTENTICAÇÃO BÁSICA ---

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
            'must_change_password' => (bool) $user->must_change_password,
            'message' => $user->must_change_password ? 'Troca de senha obrigatória!' : 'Bem-vindo!'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout realizado com sucesso.']);
    }

    // --- GESTÃO DA IGREJA (ADMIN) ---

    public function registerChurch(Request $request)
    {
        $request->validate([
            'church_name' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        return DB::transaction(function () use ($request) {
            $church = Church::create([
                'name' => $request->church_name,
                'responsible_name' => $request->name,
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'church_id' => $church->id,
                'role' => 'admin',
                'must_change_password' => false
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Igreja e Administrador cadastrados com sucesso!',
                'access_token' => $token,
                'church' => $church->name
            ], 201);
        });
    }

    public function adminDashboard(Request $request)
    {
        $admin = $request->user();

        if ($admin->role !== 'admin') {
            return response()->json(['error' => 'Acesso negado.'], 403);
        }

        $acolytes = User::where('church_id', $admin->church_id)
            ->where('role', 'acolyte')
            ->select('id', 'name', 'email', 'points', 'must_change_password')
            ->get();

        $church = Church::find($admin->church_id);

        return response()->json([
            'church_name' => $church ? $church->name : 'Não encontrada',
            'total_acolytes' => $acolytes->count(),
            'data' => $acolytes
        ]);
    }

    // --- GESTÃO DE ACÓLITOS ---

    public function registerAcolyte(Request $request)
    {
        $admin = $request->user();

        if ($admin->role !== 'admin') {
            return response()->json(['error' => 'Acesso negado.'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            // Removido password required para usar a padrão 'mudar123'
        ]);

        $acolyte = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make('Senha123'),
            'church_id' => $admin->church_id,
            'role' => 'acolyte',
            'must_change_password' => true,
        ]);

        return response()->json([
            'message' => 'Acólito cadastrado com sucesso!',
            'acolyte' => $acolyte->name
        ], 201);
    }

    public function listAcolytes(Request $request)
    {
        $admin = $request->user();
        return response()->json(
            User::where('role', 'acolyte')
                ->where('church_id', $admin->church_id)
                ->get()
        );
    }

    public function updateAcolyte(Request $request, $id)
    {
        $admin = $request->user();
        $acolyte = User::where('id', $id)
                       ->where('church_id', $admin->church_id)
                       ->where('role', 'acolyte')
                       ->firstOrFail();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email,' . $id,
        ]);

        $acolyte->update($request->only(['name', 'email']));

        return response()->json(['message' => 'Acólito atualizado!', 'acolyte' => $acolyte]);
    }

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

    public function resetAcolytePassword(Request $request)
    {
        $admin = $request->user();

        if ($admin->role !== 'admin') {
            return response()->json(['error' => 'Acesso negado.'], 403);
        }

        $request->validate(['acolyte_id' => 'required|exists:users,id']);

        $acolyte = User::where('id', $request->acolyte_id)
                       ->where('church_id', $admin->church_id)
                       ->where('role', 'acolyte')
                       ->firstOrFail();

        $acolyte->update([
            'password' => Hash::make('mudar123'),
            'must_change_password' => true
        ]);

        return response()->json(['message' => "Senha de {$acolyte->name} resetada para: Senha123"]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:6|confirmed',
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
            'must_change_password' => false
        ]);

        return response()->json(['message' => 'Senha atualizada com sucesso!']);
    }
}
