<?php

namespace app\Http\Requests\Invoice;

use App\Models\Invoice;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;

class InvoiceDeleteRequest extends FormRequest
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
        return [
            //
        ];
    }

    public function perform(): JsonResponse
    {
        try {
            $invoice = Invoice::findOrFail($this->route('facturi'));
            $invoice->delete();

            return response()->json(['message' => 'Factură ștearsă cu succes']);
        } catch (\Throwable $exception) {
            return response()->json(['error' => $exception->getMessage()], 404);
        }
    }
}
