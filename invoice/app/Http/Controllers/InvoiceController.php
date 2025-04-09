<?php

namespace App\Http\Controllers;

use App\Http\Actions\InvoicesGetAllAction;
use app\Http\Requests\Invoice\GenerateInvoicePdfRequest;
use app\Http\Requests\Invoice\InvoiceCreateRequest;
use app\Http\Requests\Invoice\InvoiceDeleteRequest;
use app\Http\Requests\Invoice\InvoiceGetRequest;
use app\Http\Requests\Invoice\InvoiceUpdateRequest;
use App\Models\Invoice;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InvoiceController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(Request $request): JsonResponse
    {
        return InvoicesGetAllAction::perform($request);
    }

    public function store(InvoiceCreateRequest $request): JsonResponse
    {
        return $request->perform();
    }

    public function show(InvoiceGetRequest $request): JsonResponse
    {
        return $request->perform();
    }

    public function update(InvoiceUpdateRequest $request, Invoice $invoice): JsonResponse
    {
        return $request->perform($invoice);
    }

    public function destroy(InvoiceDeleteRequest $request): JsonResponse
    {
        return $request->perform();
    }

    public function generatePdf(GenerateInvoicePdfRequest $request): Response
    {
        return $request->perform();
    }

    public function getProducts(): JsonResponse
    {
        $products = $this->productService->getProducts();

        return response()->json($products);
    }
}
