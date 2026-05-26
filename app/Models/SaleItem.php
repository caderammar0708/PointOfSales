<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleItem extends Model
{

public function sale()
{
    return $this->belongsTo(Sale::class);
}

public function product()
{
    return $this->belongsTo(Product::class);
}

protected $fillable =
['sale_id',
'product_id',
'quantity',
'price',
'original_price',
'discount_percent',
'discount_amount',
'subtotal'
];

use HasFactory;
}
