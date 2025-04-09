<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'nume',
        'nr_onrc',
        'cui',
        'sediul',
        'judetul',
        'cod_iban',
        'banca',
    ];

    public function invoice() : HasMany
    {
        return $this->hasMany(Invoice::class);
    }
}
