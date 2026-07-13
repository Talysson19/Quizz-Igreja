<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        if (!User::where('email', 'admin@igrejas.com')->exists()) {
            User::create([
                'name' => 'Administrador Geral',
                'email' => 'admin@igrejas.com',
                'password' => Hash::make('@Igreja29$'),
                'role' => 'super_admin',
                'must_change_password' => false,
                'church_id' => null,
            ]);
        }
    }

    public function down(): void
    {
        User::where('email', 'admin@igrejas.com')->delete();
    }
};
