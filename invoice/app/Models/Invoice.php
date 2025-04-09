<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'numar_factura',
        'data_factura',
        'are_aviz',
        'numar_aviz',
        'cota_tva',
        'total_fara_tva',
        'total_tva',
        'total_cu_tva',
        'delegat',
        'seria_bi',
        'numar_bi',
        'cnp',
        'mijloc_transport',
        'numar_auto',
    ];

    protected $casts = [
        'data_factura' => 'date',
        'are_aviz' => 'boolean',
    ];

    public function client() : BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function details() : HasMany
    {
        return $this->hasMany(InvoiceDetails::class);
    }
}
