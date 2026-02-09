<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'users' => User::count(),
            'products' => Product::count(),
            'orders' => Order::count(),
            'revenue' => Order::where('status', '!=', 'cancelled')->sum('total_price'),
        ]);
    }

    public function allOrders()
    {
        return response()->json(Order::with(['buyer', 'items.product', 'transaction'])->latest()->paginate(20));
    }

    public function allUsers()
    {
        return response()->json(User::latest()->paginate(20));
    }

    public function approveTransaction(Request $request, $id)
    {
        $transaction = Transaction::findOrFail($id);
        
        $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $transaction->update([
            'status' => $request->status,
            'approved_by' => $request->user()->id
        ]);

        if ($request->status === 'approved') {
            $transaction->order->update(['status' => 'confirmed']);
        } else {
            $transaction->order->update(['status' => 'cancelled']);
            // Ideally, we should restore stock here if rejected
        }

        return response()->json($transaction);
    }
}
