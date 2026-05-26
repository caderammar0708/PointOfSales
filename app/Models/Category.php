<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;


class Category extends Model
{
    protected $fillable = ['name','is_active','parent_id'];

    // Parent relationship
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // Children relationship
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // Auto-generate slug when name is set
    protected static function boot()
    {
        parent::boot();
        static::saving(function ($category) {
            $category->slug = Str::slug($category->name);
        });
    }

}
