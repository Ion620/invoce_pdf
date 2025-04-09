<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
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
            'client_id'  => $this->client_id,
            'client'     => new ClientResource($this->whenLoaded('client')),
            'numar_factura'  => $this->numar_factura,
            'data_factura'   => $this->data_factura,
            'are_aviz'       => $this->are_aviz,
            'numar_aviz'     => $this->numar_aviz,
            'cota_tva'       => $this->cota_tva,
            'total_fara_tva' => $this->total_fara_tva,
            'total_tva'      => $this->total_tva,
            'total_cu_tva'   => $this->total_cu_tva,
            'delegat'        => $this->delegat,
            'seria_bi'       => $this->seria_bi,
            'numar_bi'       => $this->numar_bi,
            'cnp'            => $this->cnp,
            'mijloc_transport' => $this->mijloc_transport,
            'numar_auto'       => $this->numar_auto,
            'details' => InvoiceDetailsResource::collection($this->whenLoaded('details')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
