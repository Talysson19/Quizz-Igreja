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
        $table->integer('level')->default(1)->after('id');
        $table->text('hint')->nullable()->after('explanation');
    });

    Schema::table('user_answers', function (Blueprint $table) {
        $table->boolean('used_hint')->default(false)->after('is_correct');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quiz_system', function (Blueprint $table) {
            //
        });
    }
};
