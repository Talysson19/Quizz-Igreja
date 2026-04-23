<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Campos que podem ser preenchidos em massa.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'church_id',
        'role',
        'must_change_password',
        'points',
    ];

    /**
     * Campos escondidos em respostas JSON.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Conversão de tipos (Casts).
     */
    protected function casts(): array
    {
        return [
            // Removida a linha do email_verified_at que causava o erro 500
            'password' => 'hashed',
        ];
    }

    // Relacionamento com a Igreja
    public function church()
    {
        return $this->belongsTo(Church::class);
    }
}
