<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Church extends Model
{
    // Permitir que o Laravel preencha esses campos no cadastro
    protected $fillable = ['name', 'responsible_name', 'manual_path', 'certificate_enabled'];

    protected $casts = [
        'certificate_enabled' => 'boolean',
    ];

    public function users() {
        return $this->hasMany(User::class);
    }

    public function manuals() {
    return $this->hasMany(Manual::class);
}
}
