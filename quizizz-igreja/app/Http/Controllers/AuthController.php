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

        // Ofensiva Diária (Streak Logic)
        if ($user->role === 'acolyte') {
            $now = now();
            if ($user->last_login_at) {
                $lastLogin = \Carbon\Carbon::parse($user->last_login_at);
                if ($lastLogin->isYesterday()) {
                    $user->increment('streak_count');
                } elseif (!$lastLogin->isToday()) {
                    $user->streak_count = 1;
                }
            } else {
                $user->streak_count = 1;
            }
            $user->last_login_at = $now;
            $user->save();
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'name' => $user->name,
            'role' => $user->role,
            'streak_count' => $user->streak_count,
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
                'church' => $church->name,
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'must_change_password' => (bool) $user->must_change_password
                ]
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
            'certificate_enabled' => (bool) ($church?->certificate_enabled ?? false),
            'total_acolytes' => $acolytes->count(),
            'data' => $acolytes
        ]);
    }

    public function toggleCertificate(Request $request)
    {
        $admin = $request->user();

        if ($admin->role !== 'admin') {
            return response()->json(['error' => 'Acesso negado.'], 403);
        }

        $church = Church::findOrFail($admin->church_id);

        if ($request->has('certificate_enabled')) {
            $church->certificate_enabled = filter_var($request->input('certificate_enabled'), FILTER_VALIDATE_BOOLEAN);
        } else {
            $church->certificate_enabled = !$church->certificate_enabled;
        }

        $church->save();

        return response()->json([
            'message' => $church->certificate_enabled
                ? 'Certificados liberados para esta igreja.'
                : 'Certificados bloqueados para esta igreja.',
            'certificate_enabled' => (bool) $church->certificate_enabled,
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
            'password' => Hash::make('Senha123'),
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

    // --- MÉTODOS DO SUPER ADMIN (ADMINISTRADOR GERAL) ---

    public function listChurchesForSuper(Request $request)
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json(['error' => 'Acesso negado.'], 403);
        }

        $churches = Church::all()->map(function ($church) {
            // Pegamos o coordenador admin associado a essa igreja
            $coordinator = User::where('church_id', $church->id)
                               ->where('role', 'admin')
                               ->first();

            $totalAcolytes = User::where('church_id', $church->id)
                                 ->where('role', 'acolyte')
                                 ->count();

            return [
                'id' => $church->id,
                'name' => $church->name,
                'coordinator_name' => $coordinator ? $coordinator->name : 'Nenhum',
                'coordinator_email' => $coordinator ? $coordinator->email : 'Nenhum',
                'coordinator_id' => $coordinator ? $coordinator->id : null,
                'total_acolytes' => $totalAcolytes
            ];
        });

        return response()->json($churches);
    }

    public function registerChurchBySuper(Request $request)
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json(['error' => 'Acesso negado.'], 403);
        }

        $request->validate([
            'church_name' => 'required|string|max:255',
            'coordinator_name' => 'required|string|max:255',
            'coordinator_email' => 'required|string|email|unique:users,email',
        ]);

        return DB::transaction(function () use ($request) {
            $church = Church::create([
                'name' => $request->church_name,
                'responsible_name' => $request->coordinator_name,
                'certificate_enabled' => true
            ]);

            $user = User::create([
                'name' => $request->coordinator_name,
                'email' => $request->coordinator_email,
                'password' => Hash::make('Senha123'), // Senha padrão
                'church_id' => $church->id,
                'role' => 'admin',
                'must_change_password' => true // Obrigatório trocar de senha
            ]);

            return response()->json([
                'message' => 'Igreja e Coordenador cadastrados com sucesso!',
                'church' => $church,
                'coordinator' => $user
            ], 201);
        });
    }

    public function listChurchAcolytesForSuper(Request $request, $id)
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json(['error' => 'Acesso negado.'], 403);
        }

        $acolytes = User::where('church_id', $id)
                        ->where('role', 'acolyte')
                        ->select('id', 'name', 'email', 'points')
                        ->get();

        return response()->json($acolytes);
    }

    public function deleteUserBySuper(Request $request, $id)
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json(['error' => 'Acesso negado.'], 403);
        }

        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json(['error' => 'Você não pode excluir a si mesmo.'], 400);
        }

        $user->delete();
        return response()->json(['message' => 'Usuário excluído com sucesso!']);
    }

    public function deleteChurchBySuper(Request $request, $id)
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json(['error' => 'Acesso negado.'], 403);
        }

        $church = Church::findOrFail($id);
        $church->delete();

        return response()->json(['message' => 'Igreja e todos os seus vínculos excluídos com sucesso!']);
    }

    public function resetCoordinatorPasswordBySuper(Request $request)
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json(['error' => 'Acesso negado.'], 403);
        }

        $request->validate(['coordinator_id' => 'required|exists:users,id']);

        $coordinator = User::where('id', $request->coordinator_id)
                           ->where('role', 'admin')
                           ->firstOrFail();

        $coordinator->update([
            'password' => Hash::make('Senha123'),
            'must_change_password' => true
        ]);

        return response()->json(['message' => "Senha de {$coordinator->name} resetada para: Senha123"]);
    }
}
