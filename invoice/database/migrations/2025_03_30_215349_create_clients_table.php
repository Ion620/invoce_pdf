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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('nume')->nullable();
            $table->string('nr_onrc')->nullable();
            $table->string('cui')->nullable();
            $table->string('sediul')->nullable();
            $table->string('judetul')->nullable();
            $table->string('cod_iban')->nullable();
            $table->string('banca')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
