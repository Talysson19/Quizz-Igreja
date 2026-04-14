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
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('church_id')->index('church_id');
            $table->string('name');
            $table->string('email')->unique('email');
            $table->string('password');
            $table->integer('points')->nullable()->default(0);
            $table->enum('role', ['admin', 'acolyte'])->nullable()->default('acolyte');
            $table->boolean('must_change_password')->nullable()->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
