<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ProductService
{
    protected $api_url = 'https://testare.softis.ro/produse';

    public function getProducts()
    {
        $response = Http::get($this->api_url);

        if ($response->successful()) {
            return $response->json();
        }

        return [];
    }
}
