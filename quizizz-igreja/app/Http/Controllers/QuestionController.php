<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\User;
use App\Models\Church;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Response;

class QuestionController extends Controller
{
    // 1. Lista todas as perguntas (Geral)
   // 1. Lista todas as perguntas DA IGREJA do admin logado
public function index(Request $request)
{
    // Pegamos o usuário autenticado pelo Bearer Token
    $user = $request->user();

    // Filtramos a model Question para trazer apenas o que pertence ao church_id do admin
    $questions = Question::where('church_id', $user->church_id)
        ->orderBy('created_at', 'desc') // Opcional: traz as mais recentes primeiro
        ->get();

    return response()->json($questions);
}

    // 2. Processa a Resposta do Acólito (Cenário 8)
    public function answer(Request $request)
    {
        $request->validate([
            'question_id' => 'required|exists:questions,id',
            'selected_option' => 'required|string|max:1',
            'use_hint' => 'boolean'
        ]);

        $user = $request->user();
        $question = Question::find($request->question_id);

        // Trava Multi-tenant: Não responde pergunta de outra igreja
        if ($question->church_id !== $user->church_id) {
            return response()->json(['error' => 'Pergunta não pertence à sua paróquia.'], 403);
        }

        // Verifica se já respondeu
        $alreadyAnswered = DB::table('user_answers')
            ->where('user_id', $user->id)
            ->where('question_id', $question->id)
            ->exists();

        if ($alreadyAnswered) {
            return response()->json([
                'error' => 'Você já respondeu esta pergunta!',
                'explanation' => $question->explanation
            ], 403);
        }

        $isCorrect = strtolower($request->selected_option) === strtolower($question->correct_option);

        $pointsToEarn = 0;
        if ($isCorrect) {
            $pointsToEarn = $request->use_hint ? 5 : 10;
            $user->increment('points', $pointsToEarn);
        }

        DB::table('user_answers')->insert([
            'user_id' => $user->id,
            'question_id' => $question->id,
            'is_correct' => $isCorrect,
            'used_hint' => $request->use_hint ?? false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'correct' => $isCorrect,
            'correct_option' => $question->correct_option,
            'explanation' => $question->explanation,
            'points_earned' => $pointsToEarn,
            'current_points' => $user->points
        ]);
    }

    // 3. Ranking por Igreja (Cenário 9)
    public function ranking(Request $request)
    {
        $user = $request->user();
        $ranking = User::where('church_id', $user->church_id)
            ->where('role', 'acolyte')
            ->orderBy('points', 'desc')
            ->select('name', 'points')
            ->get();

        $church = Church::find($user->church_id);

        return response()->json([
            'church' => $church ? $church->name : 'Geral',
            'ranking' => $ranking
        ]);
    }

    // 4. Busca Perguntas com Trava de Nível (Cenário 8)
    public function getQuestionsByLevel(Request $request, $level)
    {
        $user = $request->user();

        // Regra: Nível 2 exige 50 pontos
        if ($level == 2 && $user->points < 50) {
            return response()->json([
                'error' => 'Nível Bloqueado!',
                'message' => 'Você precisa de 50 pontos para o Nível 2. Você tem: ' . $user->points
            ], 403);
        }

        $questions = Question::where('church_id', $user->church_id)
            ->where('level', $level)
            ->get();

        if ($questions->isEmpty()) {
            return response()->json(['message' => 'Nenhum conteúdo neste nível.'], 404);
        }

        return response()->json($questions);
    }

    // 5. Progresso do Usuário
    public function getProgress(Request $request)
    {
        $user = $request->user();
        $progress = DB::table('user_answers')
            ->join('questions', 'user_answers.question_id', '=', 'questions.id')
            ->where('user_answers.user_id', $user->id)
            ->select('questions.level', DB::raw('count(*) as completed_questions'))
            ->groupBy('questions.level')
            ->get();

        return response()->json([
            'user_name' => $user->name,
            'total_points' => $user->points,
            'levels_progress' => $progress
        ]);
    }

    // 6. Geração de Certificado (Cenário 10)
    public function generateCertificate(Request $request)
    {
        $user = $request->user();
        $completedCount = DB::table('user_answers')->where('user_id', $user->id)->count();

        if ($completedCount < 20) {
            return response()->json([
                'error' => 'Conclua 20 perguntas para liberar o certificado!',
                'progress' => $completedCount . '/20'
            ], 403);
        }

        $church = Church::find($user->church_id);
        $data = [
            'name' => $user->name,
            'date' => now()->format('d/m/Y'),
            'points' => $user->points,
            'church' => $church ? $church->name : 'Paróquia'
        ];

        $pdf = Pdf::loadView('emails.certificate', $data)->setPaper('a4', 'landscape');
        return $pdf->download('Certificado_' . $user->id . '.pdf');
    }

    // 7. Cadastro de Pergunta pelo ADM (Setup Inicial)
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Acesso negado.'], 403);
        }

        $data = $request->validate([
            'level' => 'required|integer',
            'title' => 'required|string',
            'option_a' => 'required|string',
            'option_b' => 'required|string',
            'option_c' => 'required|string',
            'option_d' => 'required|string',
            'correct_option' => 'required|string|max:1',
            'hint' => 'nullable|string',
            'explanation' => 'required|string',
        ]);

        $data['church_id'] = $user->church_id;
        $question = Question::create($data);

        return response()->json(['message' => 'Pergunta cadastrada!', 'question' => $question], 201);
    }

    public function downloadMyManual(Request $request)
{
    $user = $request->user();
    $church = Church::find($user->church_id);

    if (!$church || !$church->manual_path) {
        return response()->json(['error' => 'Sua paróquia ainda não subiu um manual.'], 404);
    }

    $path = public_path($church->manual_path);

    if (!file_exists($path)) {
        return response()->json(['error' => 'Arquivo físico não encontrado.'], 404);
    }

    return response()->download($path);
}

public function getAcolyteProgressForAdmin(Request $request, $id)
{
    $admin = $request->user();
    // Garante que o admin só veja acólitos da mesma igreja
    $acolyte = User::where('id', $id)->where('church_id', $admin->church_id)->firstOrFail();

    $progress = DB::table('user_answers')
        ->join('questions', 'user_answers.question_id', '=', 'questions.id')
        ->where('user_answers.user_id', $acolyte->id)
        ->select('questions.level', DB::raw('count(*) as completed_questions'))
        ->groupBy('questions.level')
        ->get();

    return response()->json([
        'user_name' => $acolyte->name,
        'total_points' => $acolyte->points,
        'levels_progress' => $progress
    ]);
}
}
