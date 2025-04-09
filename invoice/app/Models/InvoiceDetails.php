<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceDetails extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id',
        'id_produs',
        'denumire',
        'unitate_masura',
        'cantitate',
        'pret_unitar',
        'valoare',
        'valoare_tva',
    ];

    public function invoice() : BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
