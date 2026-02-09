'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import DashboardLayout from '@/components/DashboardLayout';

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', 
    category: 'Metal', 
    condition: 'Used', 
    price: '', 
    quantity: '', 
    description: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await api.get('/my-products');
      setProducts(res.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
        alert('Product updated successfully!');
      } else {
        await api.post('/products', formData);
        alert('Product added successfully!');
      }
      setFormData({ name: '', category: 'Metal', condition: 'Used', price: '', quantity: '', description: '' });
      setShowForm(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      condition: product.condition,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      alert('Product deleted successfully!');
      loadProducts();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Metal', 'Wood', 'Plastic', 'Glass', 'Electronics', 'Other'];

  if (loading) {
    return (
      <DashboardLayout role="seller">
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="seller">
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">My Products</h1>
                <p className="text-slate-600 mt-1">Manage your product listings</p>
              </div>
              <button 
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingProduct(null);
                  setFormData({ name: '', category: 'Metal', condition: 'Used', price: '', quantity: '', description: '' });
                }}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add New Product</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Total Products</p>
                  <p className="text-3xl font-bold mt-2">{products.length}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">In Stock</p>
                  <p className="text-3xl font-bold mt-2">{products.filter(p => p.quantity > 0).length}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Out of Stock</p>
                  <p className="text-3xl font-bold mt-2">{products.filter(p => p.quantity === 0).length}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Add/Edit Product Form */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button 
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., Steel Beams"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="Metal">Metal</option>
                    <option value="Wood">Wood</option>
                    <option value="Plastic">Plastic</option>
                    <option value="Glass">Glass</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Condition</label>
                  <select 
                    value={formData.condition}
                    onChange={e => setFormData({...formData, condition: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="Refurbished">Refurbished</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Price ($)</label>
                  <input 
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity</label>
                  <input 
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Describe your product..."
                  />
                </div>

                <div className="md:col-span-2">
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Search Products</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or description..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Filter by Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold">{filteredProducts.length}</span> products
              </p>
              {(searchTerm || categoryFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('All');
                  }}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl shadow-md p-12 text-center">
                <svg className="mx-auto h-16 w-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-slate-900">No products found</h3>
                <p className="mt-2 text-slate-600">Start by adding your first product</p>
              </div>
            ) : (
              filteredProducts.map((product: any) => (
                <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-20 h-20 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{product.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {product.category}
                      </span>
                      <span className="text-sm text-slate-600">Qty: {product.quantity}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div>
                        <p className="text-2xl font-bold text-emerald-600">${product.price}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
