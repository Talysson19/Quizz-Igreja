<?php

namespace App\Http\Controllers;

use App\Models\Manual;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\PersonalAccessToken;

class ManualController extends Controller
{
    // Lista manuais da igreja do usuário logado
    public function index(Request $request)
    {
        $user = $request->user();

        // Se o usuário não tiver igreja vinculada, evita erro 500
        if (!$user->church_id) {
            return response()->json([], 200);
        }

        $manuals = Manual::where('church_id', $user->church_id)->get();
        return response()->json($manuals);
    }

    // Admin faz o upload
    public function store(Request $request)
    {
        $user = $request->user();

        // Trava de segurança manual (Substitui o middleware checkRole)
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Acesso negado. Apenas administradores.'], 403);
        }

        $request->validate([
            'manual' => 'required|mimes:pdf|max:10000',
            'display_name' => 'required|string|max:255'
        ]);

        if ($request->hasFile('manual')) {
            // Salva o arquivo
            $path = $request->file('manual')->store('manuals', 'public');

            $manual = Manual::create([
                'church_id' => $user->church_id,
                'display_name' => $request->display_name,
                'file_path' => $path
            ]);

            return response()->json($manual, 201);
        }

        return response()->json(['error' => 'Arquivo não enviado'], 400);
    }

    // Admin deleta um manual
    public function destroy($id)
    {
        $user = auth()->user();

        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Acesso negado.'], 403);
        }

        $manual = Manual::where('id', $id)
                        ->where('church_id', $user->church_id)
                        ->firstOrFail();

        Storage::disk('public')->delete($manual->file_path);
        $manual->delete();

        return response()->json(['message' => 'Manual removido com sucesso']);
    }

   public function download($id)
{
    // O Sanctum vai identificar o usuário pelo Token que enviamos no Header
    $user = auth()->user();

    if (!$user) {
        return response()->json(['error' => 'Usuário não autenticado'], 401);
    }

    $manual = Manual::where('id', $id)
                    ->where('church_id', $user->church_id)
                    ->firstOrFail();

    $path = storage_path('app/public/' . $manual->file_path);

    if (!file_exists($path)) {
        return response()->json(['error' => 'Arquivo não encontrado'], 404);
    }

    return response()->download($path);
}
}
