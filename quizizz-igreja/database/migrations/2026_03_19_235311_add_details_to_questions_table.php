<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::table('questions', function (Blueprint $table) {
        $table->integer('level')->default(1)->after('id'); // Adiciona os níveis [cite: 10]
        $table->text('hint')->nullable()->after('explanation'); // Adiciona as dicas [cite: 13, 14]
        $table->integer('base_points')->default(10)->after('hint'); // Adiciona a pontuação base [cite: 24]
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            //
        });
    }
};
