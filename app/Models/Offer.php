<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'type', 
        'discount_type', 
        'discount_value', // Single discount for combo/coupon
        'code', 
        'buy_quantity', 
        'get_quantity', 
        'min_bill_amount', 
        'start_date', 
        'end_date', 
        'is_active'
    ];

    // Link to Products with the extra 'specific_discount' field
public function products()
{
    return $this->belongsToMany(Product::class, 'offer_product')
                ->withPivot('specific_discount') // Add this line
                ->withTimestamps();
}
}