<?php

namespace app\Http\Requests\Invoice;

use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Response;

class GenerateInvoicePdfRequest extends FormRequest
{
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
        return [];
    }

    public function perform(): Response
    {
        try {
            $factura = Invoice::with(['client', 'details'])->findOrFail($this->route('factura'));

            $pdf = PDF::loadView('pdf.factura', ['factura' => $factura]);

            return $pdf->download('factura_' . $factura->numar_factura . '.pdf');
        } catch (\Throwable $exception) {
            return response($exception->getMessage(), 404);
        }
    }
}
