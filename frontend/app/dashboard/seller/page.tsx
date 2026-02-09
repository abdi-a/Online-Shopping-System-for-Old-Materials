'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function SellerDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '', 
    category: 'Metal', 
    condition: 'Used', 
    price: '', 
    quantity: '', 
    description: '',
    image:t(() => {
    loadProducts();
  }, []);

  const l
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
          {/* Add Product Form */}
          <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-4">List New Material</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                  <input placeholder="Name" className="w-full border p-2" onChange={e => setFormData({...formData, name: e.target.value})} />
                  <div className="flex gap-2">
                    <input placeholder="Price" type="number" className="w-full border p-2" onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                    <input placeholder="Qty" type="number" className="w-full border p-2" onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
                  </div>
                  <textarea placeholder="Description" className="w-full border p-2" onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  <button className="bg-green-600 text-white px-4 py-2 w-full rounded">Add Product</button>
              </form>
          </div>

          {/* Product List */}
          <div>
            <h2 className="text-xl font-bold mb-4">My Listings</h2>
            <div className="space-y-2">
                {products.map((p: any) => (
                    <div key={p.id} className="border p-3 bg-white flex justify-between">
                        <span>{p.name}</span>
                        <span className="font-bold">${p.price}</span>
                    </div>
                ))}
            </div>
          </div>
      </div>
    </div>
  );
}
