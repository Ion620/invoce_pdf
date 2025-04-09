<?php

namespace App\Http\Actions;

use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

class InvoicesGetAllAction
{
    const ITEMS_PER_PAGE = 10;

    private $search_options;
    private Builder|Invoice $invoice_q;
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
            Log::error('Error fetching facturi: ' . $exception->getMessage());
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

        $this->invoice_q = Invoice::with(['client']);
        return $this;
    }

    public function filter(): static
    {
        // Handle both Request objects and standard objects
        $search = null;
        $client_id = null;
        $date_from = null;
        $date_to = null;
        $sort_field = 'data_factura';
        $sort_direction = 'desc';

        if ($this->search_options instanceof Request) {
            $search = $this->search_options->input('search');
            $client_id = $this->search_options->input('client_id');
            $date_from = $this->search_options->input('date_from');
            $date_to = $this->search_options->input('date_to');
            $sort_field = $this->search_options->input('sort_field', 'data_factura');
            $sort_direction = $this->search_options->input('sort_direction', 'desc');
        } else if (method_exists($this->search_options, 'get')) {
            $search = $this->search_options->get('search');
            $client_id = $this->search_options->get('client_id');
            $date_from = $this->search_options->get('date_from');
            $date_to = $this->search_options->get('date_to');
            $sort_field = $this->search_options->get('sort_field', 'data_factura');
            $sort_direction = $this->search_options->get('sort_direction', 'desc');
        }

        if ($search) {
            $this->invoice_q->where(function($q) use ($search) {
                $q->where('numar_factura', 'LIKE', "%{$search}%")
                    ->orWhereHas('client', function($q) use ($search) {
                        $q->where('nume', 'LIKE', "%{$search}%");
                    });
            });
        }

        if ($client_id) {
            $this->invoice_q->where('client_id', $client_id);
        }

        if ($date_from) {
            $this->invoice_q->whereDate('data_factura', '>=', $date_from);
        }

        if ($date_to) {
            $this->invoice_q->whereDate('data_factura', '<=', $date_to);
        }

        $this->invoice_q->orderBy($sort_field, $sort_direction);

        return $this;
    }

    public function get(): static
    {
        $show_all = false;

        // Handle both Request objects and standard objects
        if ($this->search_options instanceof Request) {
            $show_all = $this->search_options->boolean('show_all', false);
        } else {
            $show_all = !empty($this->search_options->show_all);
        }

        $this->limit = $show_all ? $this->invoice_q->count() : $this->limit;
        $this->page = $show_all ? 1 : $this->page;

        $invoices = $this->invoice_q->paginate($this->limit, ['*'], 'page', $this->page);
        $this->result = InvoiceResource::collection($invoices);

        return $this;
    }
}
