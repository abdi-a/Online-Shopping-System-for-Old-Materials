<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Transaction;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Users
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $seller = User::create([
            'name' => 'John Seller',
            'email' => 'seller@example.com',
            'password' => Hash::make('password'),
            'role' => 'seller',
        ]);

        $buyer = User::create([
            'name' => 'Jane Buyer',
            'email' => 'buyer@example.com',
            'password' => Hash::make('password'), // password is 'password'
            'role' => 'buyer',
        ]);

        // 2. Create Products (by Seller)
        $products = [
            [
                'seller_id' => $seller->id,
                'name' => 'Scrap Copper Wire',
                'category' => 'Metal',
                'condition' => 'Scrap',
                'price' => 50.00,
                'quantity' => 100, // kg
                'description' => 'High quality copper wire scrap stripped from renovation.',
            ],
            [
                'seller_id' => $seller->id,
                'name' => 'Used Steel Pipes',
                'category' => 'Metal',
                'condition' => 'Used-Good',
                'price' => 20.00,
                'quantity' => 50,
                'description' => 'Steel pipes from old plumbing, good condition.',
            ],
            [
                'seller_id' => $seller->id,
                'name' => 'Old Motherboards',
                'category' => 'Electronics',
                'condition' => 'Scrap',
                'price' => 15.00,
                'quantity' => 20,
                'description' => 'Non-functional motherboards for gold recovery.',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        // 3. Create a Demo Order (Buyer buys similar items)
        $product = Product::first();
        if ($product) {
            $qty = 5;
            $price = $product->price * $qty;
            
            $order = Order::create([
                'buyer_id' => $buyer->id,
                'total_price' => $price,
                'status' => 'pending',
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $qty,
                'price' => $product->price,
            ]);

             // Initial transaction
             Transaction::create([
                'order_id' => $order->id,
                'status' => 'pending'
            ]);
            
            // Deduct stock for the demo order
            $product->decrement('quantity', $qty);
        }
    }
}
