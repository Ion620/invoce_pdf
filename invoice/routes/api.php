<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\InvoiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('clients', ClientController::class);

    Route::apiResource('facturi', InvoiceController::class);
    Route::get('/facturi/{factura}/pdf', [InvoiceController::class, 'generatePdf']);
    Route::get('/products', [InvoiceController::class, 'getProducts']);
});
