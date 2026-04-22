<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Manual extends Model
{
    use HasFactory;

    // Campos que o ManualController pode gravar no banco
    protected $fillable = [
        'church_id',
        'display_name',
        'file_path'
    ];

    public function church()
    {
        return $this->belongsTo(Church::class);
    }
}
