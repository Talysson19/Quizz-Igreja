<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up(): void
{
    Schema::create('churches', function (Blueprint $table) {
        $table->id();
        $table->string('name'); // Nome da Paróquia
        $table->string('responsible_name')->nullable(); // Nome do Padre/Coordenador
        $table->string('manual_path')->nullable(); // Caminho do PDF do manual
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('churches');
    }
};
