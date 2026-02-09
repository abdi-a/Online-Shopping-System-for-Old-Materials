<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // Public: List all products for buyers
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        return response()->json($query->with('seller')->latest()->paginate(12));
    }

    // Public: Show single product
    public function show($id)
    {
        return response()->json(Product::with('seller')->findOrFail($id));
    }

    // Seller: Store new product
    public function store(Request $request)
    {
        if ($request->user()->role !== 'seller') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'condition' => 'required|string',
            'price' => 'required|numeric',
            'quantity' => 'required|integer',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product = Product::create([
            'seller_id' => $request->user()->id,
            'name' => $request->name,
            'category' => $request->category,
            'condition' => $request->condition,
            'price' => $request->price,
            'quantity' => $request->quantity,
            'description' => $request->description,
            'image' => $imagePath,
        ]);

        return response()->json($product, 201);
    }

    // Seller: Update product
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        if ($request->user()->id !== $product->seller_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'string',
            'price' => 'numeric',
            'quantity' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image code would go here
            $product->image = $request->file('image')->store('products', 'public');
        }

        $product->update($request->except(['image', 'seller_id'])); // Prevent changing owner or image via text

        return response()->json($product);
    }

    // Seller: Delete product
    public function destroy(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        if ($request->user()->id !== $product->seller_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
    
    // Seller: My Products
    public function myProducts(Request $request) {
        if ($request->user()->role !== 'seller') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($request->user()->products()->latest()->get());
    }
}
