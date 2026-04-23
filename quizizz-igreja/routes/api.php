<?php

use Illuminate\Http\Request;
use App\Http\Controllers\ManualController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\QuestionController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

// ---------------------------------------------------------
// 1. Rotas de Manutenção (Públicas temporariamente para conserto)
// ---------------------------------------------------------

Route::get('/teste-db', function() {
    try {
        DB::connection()->getPdo();
        return response()->json(['status' => 'Conectado ao banco com sucesso!']);
    } catch (\Exception $e) {
        return response()->json(['erro' => $e->getMessage()], 500);
    }
});

Route::get('/force-migrate', function () {
    try {
        Artisan::call('migrate:fresh', ['--force' => true]);
        return response()->json([
            'status' => 'sucesso',
            'output' => Artisan::output()
        ]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'erro', 'mensagem' => $e->getMessage()], 500);
    }
});

Route::get('/debug-db', function () {
    try {
        $tables = DB::select('SHOW TABLES');
        // Pega o nome da base de dados para mapear a chave do objeto
        $dbNameKey = "Tables_in_" . env('DB_DATABASE', 'defaultdb');

        $result = [];
        foreach ($tables as $table) {
            $tableName = $table->$dbNameKey;
            $columns = DB::select("DESCRIBE $tableName");
            $result[$tableName] = $columns;
        }

        return response()->json([
            'database' => env('DB_DATABASE'),
            'tables_count' => count($tables),
            'structure' => $result
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// ---------------------------------------------------------
// 2. Rotas Públicas do App
// ---------------------------------------------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register-church', [AuthController::class, 'registerChurch']);
Route::post('/admin/reset-acolyte-password', [AuthController::class, 'resetAcolytePassword']);

// ---------------------------------------------------------
// 3. Rotas Protegidas (Requerem Token)
// ---------------------------------------------------------
Route::middleware('auth:sanctum')->group(function () {

    // Perfil e Logout
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Quiz e Ranking
    Route::get('/questions', [QuestionController::class, 'index']);
    Route::post('/questions/answer', [QuestionController::class, 'answer']);
    Route::get('/questions/level/{level}', [QuestionController::class, 'getQuestionsByLevel']);
    Route::get('/ranking', [QuestionController::class, 'ranking']);
    Route::get('/user/progress', [QuestionController::class, 'getProgress']);
    Route::get('/user/certificate', [QuestionController::class, 'generateCertificate']);

    // Manuais
    Route::get('/manuals', [ManualController::class, 'index']);
    Route::post('/manuals', [ManualController::class, 'store']);
    Route::delete('/manuals/{id}', [ManualController::class, 'destroy']);
    Route::get('/manuals/{id}/download', [ManualController::class, 'download']);

    // Administrativo
    Route::get('/admin/dashboard', [AuthController::class, 'adminDashboard']);
    Route::get('/admin/acolytes', [AuthController::class, 'listAcolytes']);
    Route::post('/admin/acolytes', [AuthController::class, 'registerAcolyte']);
    Route::put('/admin/acolytes/{id}', [AuthController::class, 'updateAcolyte']);
    Route::delete('/admin/acolytes/{id}', [AuthController::class, 'deleteAcolyte']);

    // CRUD de Perguntas
    Route::post('/admin/questions', [QuestionController::class, 'store']);
    Route::put('/admin/questions/{id}', [QuestionController::class, 'update']);
    Route::delete('/admin/questions/{id}', [QuestionController::class, 'destroy']);

    // Configurações
    Route::post('/user/change-password', [AuthController::class, 'changePassword']);
});
