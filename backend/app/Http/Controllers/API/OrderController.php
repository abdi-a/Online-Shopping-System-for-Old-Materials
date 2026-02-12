<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // Buyer: Place an order
    public function store(Request $request)
    {
        if ($request->user()->role !== 'buyer') {
            return response()->json(['message' => 'Only buyers can place orders'], 403);
        }

        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            $totalPrice = 0;
            $orderItemsData = [];

            foreach ($request->items as $item) {
                $product = Product::lockForUpdate()->find($item['product_id']);

                if ($product->quantity < $item['quantity']) {
                    throw new \Exception("Insufficient stock for product: " . $product->name);
                }

                $product->decrement('quantity', $item['quantity']);

                $price = $product->price * $item['quantity'];
                $totalPrice += $price;

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ];
            }

            $order = Order::create([
                'buyer_id' => $request->user()->id,
                'total_price' => $totalPrice,
                'status' => 'pending',
            ]);

            foreach ($orderItemsData as $data) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $data['product_id'],
                    'quantity' => $data['quantity'],
                    'price' => $data['price'],
                ]);
            }
            
            // Create initial transaction record
            $order->transaction()->create([
                'status' => 'pending'
            ]);

            DB::commit();

            return response()->json($order->load('items'), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    // Buyer: View my orders
    public function index(Request $request)
    {
        return response()->json(
            Order::with('items.product')->where('buyer_id', $request->user()->id)->latest()->get()
        );
    }
    
    // Seller: See orders containing their products
    public function sellerOrders(Request $request)
    {
        if ($request->user()->role !== 'seller') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Logic to find orders that contain products belonging to this seller
        // This is a bit complex as an order could have multiple sellers' items theoretically.
        // For simplicity, we assume the UI filters appropriately or we query deeply.
        
        $sellerId = $request->user()->id;
        
        $orders = Order::whereHas('items.product', function($q) use ($sellerId) {
            $q->where('seller_id', $sellerId);
        })->with(['items' => function($q) use ($sellerId) {
            $q->whereHas('product', function($p) use ($sellerId) {
                $p->where('seller_id', $sellerId);
            })->with('product');
        }])->latest()->get();

        return response()->json($orders);
    }
    
    // Seller: Update order status (confirm/reject)
    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        // Check if user is the seller of products in this order
        $sellerId = $request->user()->id;
        $hasSellerProducts = $order->items()->whereHas('product', function($q) use ($sellerId) {
            $q->where('seller_id', $sellerId);
        })->exists();
        
        if (!$hasSellerProducts && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $request->validate([
            'status' => 'required|in:confirmed,rejected,cancelled'
        ]);
        
        $order->update(['status' => $request->status]);
        
        return response()->json($order);
    }
}
