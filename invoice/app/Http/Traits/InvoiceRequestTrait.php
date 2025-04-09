<?php

namespace App\Http\Traits;

use App\Models\Invoice;
use App\Models\InvoiceDetails;

trait InvoiceRequestTrait
{
    /**
     * Calculează totalurile pentru factură pe baza produselor
     */
    protected function calculateTotals(): static
    {
        $produse = $this->input('produse', []);
        $totalFaraTva = 0;

        foreach ($produse as $produs) {
            $valoare = $produs['cantitate'] * $produs['pret_unitar'];
            $totalFaraTva += $valoare;
        }

        $cotaTva = $this->input('cota_tva');
        $totalTva = $totalFaraTva * ($cotaTva / 100);
        $totalCuTva = $totalFaraTva + $totalTva;

        $this->merge([
            'total_fara_tva' => $totalFaraTva,
            'total_tva' => $totalTva,
            'total_cu_tva' => $totalCuTva,
        ]);

        return $this;
    }

    /**
     * Creează detaliile facturii (linii de produse)
     */
    protected function createDetails(Invoice $invoice): static
    {
        $produse = $this->input('produse', []);
        $cotaTva = $this->input('cota_tva');

        foreach ($produse as $produs) {
            $valoare = $produs['cantitate'] * $produs['pret_unitar'];
            $valoareTva = $valoare * ($cotaTva / 100);

            InvoiceDetails::create([
                'invoice_id' => $invoice->id,
                'id_produs' => $produs['id_produs'],
                'denumire' => $produs['denumire'],
                'unitate_masura' => $produs['unitate_masura'],
                'cantitate' => $produs['cantitate'],
                'pret_unitar' => $produs['pret_unitar'],
                'valoare' => $valoare,
                'valoare_tva' => $valoareTva,
            ]);
        }

        return $this;
    }
}
