<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceDetailsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'invoice_id' => $this->factura_id,
            'id_produs'  => $this->id_produs,
            'denumire'   => $this->denumire,
            'unitate_masura' => $this->unitate_masura,
            'cantitate'      => $this->cantitate,
            'pret_unitar'    => $this->pret_unitar,
            'valoare'        => $this->valoare,
            'valoare_tva'    => $this->valoare_tva,
        ];
    }
}
