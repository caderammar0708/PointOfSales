<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            [
                'name' => 'Walk-in Customer',
                'phone' => '0000000000',
                'email' => 'walkin@example.com',
                'address' => 'N/A',
            ],
            [
                'name' => 'Ammar Ahmed',
                'phone' => '03001234567',
                'email' => 'ammar@example.com',
                'address' => 'Phase 6, DHA, Lahore',
            ],
            [
                'name' => 'Sara Khan',
                'phone' => '03217654321',
                'email' => 'sara@example.com',
                'address' => 'Gulberg III, Lahore',
            ],
            [
                'name' => 'Zeeshan Ali',
                'phone' => '03339876543',
                'email' => 'zeeshan@example.com',
                'address' => 'Bahria Town, Islamabad',
            ],
            [
                'name' => 'Mehak Fatima',
                'phone' => '03451122334',
                'email' => 'mehak@example.com',
                'address' => 'F-10, Islamabad',
            ],
        ];

        foreach ($customers as $customer) {
            Customer::updateOrCreate(['phone' => $customer['phone']], $customer);
        }
    }
}
