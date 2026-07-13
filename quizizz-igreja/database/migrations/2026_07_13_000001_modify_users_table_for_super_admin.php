<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Drop foreign key constraint on church_id
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['church_id']);
        });

        // 2. Change columns: church_id to nullable, role to string
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('church_id')->nullable()->change();
            $table->string('role')->default('acolyte')->change();
        });

        // 3. Re-add foreign key constraint
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('church_id')->references('id')->on('churches')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['church_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('church_id')->change();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreign('church_id')->references('id')->on('churches')->onDelete('cascade');
        });
    }
};
