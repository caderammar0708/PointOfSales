<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable =
    ['category_id',
    'name',
    'price',
    'cost_price',
    'unit_id',
    'stock',
    'image',
    'product_code'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    // Active offers for this product
    public function activeOffers()
    {
        return $this->belongsToMany(Offer::class, 'offer_product')
                    ->where('is_active', true)
                    ->where(function ($query) {
                        $query->whereNull('start_date')->orWhere('start_date', '<=', now());
                    })
                    ->where(function ($query) {
                        $query->whereNull('end_date')->orWhere('end_date', '>=', now());
                    })
                    ->withPivot('specific_discount');
    }

    // Offers that apply to individual products (excludes combos)
    public function individualOffers()
    {
        return $this->activeOffers()->where('type', '!=', 'combo');
    }

    // Get the best discount for this product (only individual offers)
    public function getBestDiscountAttribute()
    {
        $offer = $this->individualOffers()->first();
        return $offer ? $offer->pivot->specific_discount : 0;
    }

    // Get discounted price
    public function getDiscountedPriceAttribute()
    {
        $discount = $this->getBestDiscountAttribute();
        return $this->price * (1 - $discount / 100);
    }

}
