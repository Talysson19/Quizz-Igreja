<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\QuestionController;
use Illuminate\Support\Facades\Response;
use App\Models\Church;
use Illuminate\Support\Facades\Hash;



// 1. Rotas Públicas (Cadastro e Login)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register-church', [AuthController::class, 'registerChurch']);
Route::post('/admin/reset-acolyte-password', [AuthController::class, 'resetAcolytePassword']);

// 2. Rotas Protegidas (Requer Token Sanctum) [cite: 3]
// 2. Rotas Protegidas (Requer Token Sanctum)
Route::middleware('auth:sanctum')->group(function () {

    // Autenticação e Perfil
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // 📖 Manual do Acólito
    Route::get('/user/manual', [QuestionController::class, 'downloadMyManual']);

    // 📝 Sistema de Quiz e Respostas
    Route::get('/questions', [QuestionController::class, 'index']);
    Route::post('/questions/answer', [QuestionController::class, 'answer']);

    // 🎚️ Quiz por Níveis
    Route::get('/questions/level/{level}', [QuestionController::class, 'getQuestionsByLevel']);

    // 🏆 Ranking e Dashboard de Progresso (LIMPO E ÚNICO)
    Route::get('/ranking', [QuestionController::class, 'ranking']);
    Route::get('/user/progress', [QuestionController::class, 'getProgress']);
    Route::get('/user/certificate', [QuestionController::class, 'generateCertificate']);

    // 🛡️ Rotas Administrativas
    Route::get('/admin/dashboard', [AuthController::class, 'adminDashboard']);
    Route::get('/admin/acolytes', [AuthController::class, 'listAcolytes']);
    Route::post('/admin/manual/upload', [AuthController::class, 'uploadManual']);
    Route::post('/admin/questions', [QuestionController::class, 'store']);
    Route::post('/admin/acolytes', [AuthController::class, 'registerAcolyte']);

    // Configurações de Usuário
    Route::post('/user/change-password', [AuthController::class, 'changePassword']);

});
