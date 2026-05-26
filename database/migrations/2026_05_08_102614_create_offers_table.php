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
Schema::create('offers', function (Blueprint $table) {
    $table->id();
    $table->string('name'); // e.g., "Summer Sale" or "Burger Combo"
    $table->enum('type', ['combo', '1to1', 'discount', 'coupon']);
    
    // For Discounts & Coupons
    $table->enum('discount_type', ['percentage', 'fixed'])->nullable();
    $table->decimal('discount_value', 12, 2)->default(0);
    
    // For Coupons
    $table->string('code')->unique()->nullable(); 
    
    // For Combo & 1to1
    $table->integer('buy_quantity')->nullable();
    $table->integer('get_quantity')->nullable();
    
    // Limits
    $table->decimal('min_bill_amount', 12, 2)->default(0);
    $table->date('start_date')->nullable();
    $table->date('end_date')->nullable();
    $table->boolean('is_active')->default(true);
    
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};
