<?php

namespace app\Http\Requests\Client;

use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;

class ClientUpdateRequest extends FormRequest
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
            'nume'     => 'sometimes|required|string|between:2,100',
            'nr_onrc'  => 'nullable|string|between:2,100',
            'cui'      => 'nullable|string|between:2,100',
            'sediul'   => 'nullable|string|between:2,100',
            'judetul'  => 'nullable|string|between:2,100',
            'cod_iban' => 'nullable|string|between:2,100',
            'banca'    => 'nullable|string|between:2,100',
        ];
    }

    public function perform(Client $client): JsonResponse
    {
        try {
            $client->update($this->validated());

            return (new ClientResource($client))->response();
        } catch (\Throwable $exception) {
            return response()->json(['error' => $exception->getMessage()], 422);
        }
    }
}
