<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'user_id',
        'quantity',
        'type',
        'reason'
    ];

    /**
     * Link to the Product
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Link to the User (The cashier or admin who made the change)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

        public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }
}
