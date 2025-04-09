<?php

namespace app\Http\Requests\Invoice;

use App\Http\Resources\InvoiceResource;
use App\Http\Traits\InvoiceRequestTrait;
use App\Models\Invoice;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class InvoiceCreateRequest extends FormRequest
{
    use InvoiceRequestTrait;
    private Invoice $invoice;
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
            'client_id'     => 'required|exists:clients,id',
            'numar_factura' => 'required|string|unique:invoices,numar_factura',
            'data_factura'  => 'required|date',
            'are_aviz'      => 'boolean',
            'numar_aviz'    => 'nullable|string',
            'cota_tva'      => 'required|numeric',
            'delegat'       => 'nullable|string',
            'seria_bi'      => 'nullable|string',
            'numar_bi'      => 'nullable|string',
            'cnp'           => 'nullable|string',
            'mijloc_transport'    => 'nullable|string',
            'numar_auto'          => 'nullable|string',
            'produse'             => 'required|array|min:1',
            'produse.*.id_produs' => 'required|integer',
            'produse.*.denumire'  => 'required|string',
            'produse.*.unitate_masura' => 'required|string',
            'produse.*.cantitate'      => 'required|numeric|min:0.01',
            'produse.*.pret_unitar'    => 'required|numeric|min:0',
        ];
    }

    public function perform(): JsonResponse
    {
        try {
            DB::beginTransaction();

            $this->calculateTotals()->created()->createDetails($this->invoice);

            DB::commit();

            $this->invoice->load(['client', 'details']);

            return (new InvoiceResource($this->invoice))->response()->setStatusCode(201);
        } catch (\Throwable $exception) {
            DB::rollback();
            return response()->json(['error' => $exception->getMessage()], 422);
        }
    }

    protected function created(): static
    {
        $facturaData = $this->only([
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
            'numar_auto'
        ]);

        $this->invoice = Invoice::create($facturaData);

        return $this;
    }
}
