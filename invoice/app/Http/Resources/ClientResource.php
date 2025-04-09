<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'       => $this->id,
            'nume'     => $this->nume,
            'nr_onrc'  => $this->nr_onrc,
            'cui'      => $this->cui,
            'sediul'   => $this->sediul,
            'judetul'  => $this->judetul,
            'cod_iban' => $this->cod_iban,
            'banca'    => $this->banca,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
