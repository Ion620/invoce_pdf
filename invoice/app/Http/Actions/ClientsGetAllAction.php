<?php

namespace App\Http\Actions;

use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

class ClientsGetAllAction
{
    const ITEMS_PER_PAGE = 10;

    private $search_options;
    private Builder|Client $client_q;
    private JsonResource $result;
    private int $page;
    private int $limit;

    public function __construct($search_options)
    {
        $this->search_options = $search_options;
    }

    public static function perform($search_options): JsonResponse
    {
        return (new static($search_options))->handle();
    }

    public function handle(): JsonResponse
    {
        try {
            $this->init()->filter()->get();

            return $this->result->response();

        } catch (\Throwable $exception){
            Log::error('Error fetching clients: ' . $exception->getMessage());
            return response()->json(['error' => $exception->getMessage()], 422);
        }
    }

    public function init(): static
    {
        // Handle both Request objects and standard objects
        if ($this->search_options instanceof Request) {
            $this->page = $this->search_options->input('page', 1);
            $this->limit = $this->search_options->input('limit', self::ITEMS_PER_PAGE);
        } else {
            $this->page = $this->search_options->page ?? 1;
            $this->limit = $this->search_options->limit ?? self::ITEMS_PER_PAGE;
        }

        $this->client_q = Client::query();
        return $this;
    }

    public function filter(): static
    {
        $search = null;
        $sort_field = 'nume';
        $sort_direction = 'asc';

        if ($this->search_options instanceof Request) {
            $search = $this->search_options->input('search');
            $sort_field = $this->search_options->input('sort_field', 'nume');
            $sort_direction = $this->search_options->input('sort_direction', 'asc');
        } else if (method_exists($this->search_options, 'get')) {
            $search = $this->search_options->get('search');
            $sort_field = $this->search_options->get('sort_field', 'nume');
            $sort_direction = $this->search_options->get('sort_direction', 'asc');
        }

        if ($search) {
            $this->client_q->where(function($q) use ($search) {
                $q->where('nume', 'LIKE', "%{$search}%")
                    ->orWhere('cui', 'LIKE', "%{$search}%")
                    ->orWhere('nr_onrc', 'LIKE', "%{$search}%");
            });
        }

        $this->client_q->orderBy($sort_field, $sort_direction);

        return $this;
    }

    public function get(): static
    {
        $show_all = false;

        if ($this->search_options instanceof Request) {
            $show_all = $this->search_options->boolean('show_all', false);
        } else {
            $show_all = !empty($this->search_options->show_all);
        }

        $this->limit = $show_all ? $this->client_q->count() : $this->limit;
        $this->page = $show_all ? 1 : $this->page;

        $clients = $this->client_q->paginate($this->limit, ['*'], 'page', $this->page);
        $this->result = ClientResource::collection($clients);

        return $this;
    }
}
