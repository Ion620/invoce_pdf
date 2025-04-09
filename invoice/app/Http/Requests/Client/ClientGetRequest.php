<?php

namespace app\Http\Requests\Client;

use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;

class ClientGetRequest extends FormRequest
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
            $client = Client::findOrFail($this->route('client'));

            return (new ClientResource($client))->response();
        } catch (\Throwable $exception) {
            return response()->json(['error' => $exception->getMessage()], 404);
        }
    }
}
