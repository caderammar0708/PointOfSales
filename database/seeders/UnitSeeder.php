<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Unit;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing units
        Unit::query()->delete();

        // Create common units for POS system
        $units = [
            ['name' => 'Pieces', 'short_name' => 'pcs'],
            ['name' => 'Kilograms', 'short_name' => 'kg'],
            ['name' => 'Grams', 'short_name' => 'g'],
            ['name' => 'Liters', 'short_name' => 'L'],
            ['name' => 'Milliliters', 'short_name' => 'mL'],
            ['name' => 'Meters', 'short_name' => 'm'],
            ['name' => 'Centimeters', 'short_name' => 'cm'],
            ['name' => 'Boxes', 'short_name' => 'box'],
            ['name' => 'Cartons', 'short_name' => 'ctn'],
            ['name' => 'Bottles', 'short_name' => 'btl'],
            ['name' => 'Cans', 'short_name' => 'can'],
            ['name' => 'Bags', 'short_name' => 'bag'],
            ['name' => 'Packs', 'short_name' => 'pk'],
            ['name' => 'Dozens', 'short_name' => 'doz'],
            ['name' => 'Pairs', 'short_name' => 'pr'],
            ['name' => 'Rolls', 'short_name' => 'roll'],
            ['name' => 'Sets', 'short_name' => 'set'],
            ['name' => 'Gallons', 'short_name' => 'gal'],
            ['name' => 'Pounds', 'short_name' => 'lb'],
            ['name' => 'Ounces', 'short_name' => 'oz'],
            ['name' => 'Feet', 'short_name' => 'ft'],
            ['name' => 'Inches', 'short_name' => 'in'],
        ];

        foreach ($units as $unit) {
            Unit::create($unit);
        }

        $this->command->info('Units seeded successfully!');
    }
}
