<?php

use Illuminate\Http\Request;
use App\Http\Controllers\ManualController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\QuestionController;

// 1. Rotas Públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register-church', [AuthController::class, 'registerChurch']);
Route::post('/admin/reset-acolyte-password', [AuthController::class, 'resetAcolytePassword']);

// 2. Rotas Protegidas
Route::middleware('auth:sanctum')->group(function () {

    // Perfil e Logout
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Quiz e Ranking (Lógica de Acólito)
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

    // --- BLOCO ADMINISTRATIVO (Tudo junto agora) ---
    Route::get('/admin/dashboard', [AuthController::class, 'adminDashboard']);

    // Gestão de Acólitos
    Route::get('/admin/acolytes', [AuthController::class, 'listAcolytes']);
    Route::post('/admin/acolytes', [AuthController::class, 'registerAcolyte']);
    Route::put('/admin/acolytes/{id}', [AuthController::class, 'updateAcolyte']);
    Route::delete('/admin/acolytes/{id}', [AuthController::class, 'deleteAcolyte']);

    // CRUD de Perguntas (Deixei juntas para facilitar)
    Route::post('/admin/questions', [QuestionController::class, 'store']);
    Route::put('/admin/questions/{id}', [QuestionController::class, 'update']);
    Route::delete('/admin/questions/{id}', [QuestionController::class, 'destroy']);

    // Configurações
    Route::post('/user/change-password', [AuthController::class, 'changePassword']);
});
