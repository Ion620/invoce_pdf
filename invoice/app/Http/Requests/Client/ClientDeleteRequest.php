<?php

namespace app\Http\Requests\Client;

use App\Models\Client;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;

class ClientDeleteRequest extends FormRequest
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
            $client->delete();

            return response()->json(['message' => 'Client șters cu succes']);
        } catch (\Throwable $exception) {
            return response()->json(['error' => $exception->getMessage()], 404);
        }
    }
}
