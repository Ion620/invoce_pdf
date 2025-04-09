<?php

namespace App\Http\Controllers;

use App\Http\Actions\ClientsGetAllAction;
use app\Http\Requests\Client\ClientCreateRequest;
use app\Http\Requests\Client\ClientDeleteRequest;
use app\Http\Requests\Client\ClientGetRequest;
use app\Http\Requests\Client\ClientUpdateRequest;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return ClientsGetAllAction::perform($request);
    }

    public function store(ClientCreateRequest $request): JsonResponse
    {
        return $request->perform();
    }

    public function show(ClientGetRequest $request): JsonResponse
    {
        return $request->perform();
    }

    public function update(ClientUpdateRequest $request, Client $client): JsonResponse
    {
        return $request->perform($client);
    }

    public function destroy(ClientDeleteRequest $request): JsonResponse
    {
        return $request->perform();
    }
}
