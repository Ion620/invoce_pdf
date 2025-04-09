<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoice_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained('invoices')->onDelete('cascade');
            $table->integer('id_produs');
            $table->string('denumire');
            $table->string('unitate_masura');
            $table->decimal('cantitate', 10, 2);
            $table->decimal('pret_unitar', 10, 2);
            $table->decimal('valoare', 10, 2);
            $table->decimal('valoare_tva', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_details');
    }
};
