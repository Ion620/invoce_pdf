<?php

namespace app\Http\Requests\Invoice;

use App\Http\Resources\InvoiceResource;
use App\Http\Traits\InvoiceRequestTrait;
use App\Models\Invoice;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class InvoiceUpdateRequest extends FormRequest
{
    use InvoiceRequestTrait;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'client_id'     => 'sometimes|required|exists:clients,id',
            'numar_factura' => 'sometimes|required|string|unique:invoices,numar_factura,' . $this->route('factura'),
            'data_factura'  => 'sometimes|required|date',
            'are_aviz'      => 'boolean',
            'numar_aviz'    => 'nullable|string',
            'cota_tva'      => 'sometimes|required|numeric',
            'delegat'       => 'nullable|string',
            'seria_bi'      => 'nullable|string',
            'numar_bi'      => 'nullable|string',
            'cnp'           => 'nullable|string',
            'mijloc_transport' => 'nullable|string',
            'numar_auto'       => 'nullable|string',
            'produse'          => 'sometimes|required|array|min:1',
            'produse.*.id_produs'      => 'required|integer',
            'produse.*.denumire'       => 'required|string',
            'produse.*.unitate_masura' => 'required|string',
            'produse.*.cantitate'      => 'required|numeric|min:0.01',
            'produse.*.pret_unitar'    => 'required|numeric|min:0',
        ];
    }

    public function perform(Invoice $invoice): JsonResponse
    {
        try {
            DB::beginTransaction();

            if ($this->has('produse')) {
                $invoice->details()->delete();

                $this->calculateTotals();
                $invoice->update($this->validated());

                $this->createDetails($invoice);
            } else {
                $invoice->update($this->validated());
            }

            DB::commit();

            $invoice->load(['client', 'details']);

            return (new InvoiceResource($invoice))->response();
        } catch (\Throwable $exception) {
            DB::rollback();
            return response()->json(['error' => $exception->getMessage()], 422);
        }
    }
}
