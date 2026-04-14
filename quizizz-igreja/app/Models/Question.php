<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    // Crucial: O Laravel só salva o que estiver nesta lista!
    protected $fillable = [
        'church_id',
        'level',
        'title',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'correct_option',
        'hint',
        'explanation'
    ];

    public function church() {
        return $this->belongsTo(Church::class);
    }
}
