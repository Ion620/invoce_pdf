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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->string('numar_factura')->nullable();
            $table->date('data_factura');
            $table->boolean('are_aviz')->default(false);
            $table->string('numar_aviz')->nullable();
            $table->decimal('cota_tva', 8, 2)->default(19);
            $table->decimal('total_fara_tva', 10, 2)->default(0);
            $table->decimal('total_tva', 10, 2)->default(0);
            $table->decimal('total_cu_tva', 10, 2)->default(0);
            $table->string('delegat')->nullable();
            $table->string('seria_bi')->nullable();
            $table->string('numar_bi')->nullable();
            $table->string('cnp')->nullable();
            $table->string('mijloc_transport')->nullable();
            $table->string('numar_auto')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice');
    }
};
