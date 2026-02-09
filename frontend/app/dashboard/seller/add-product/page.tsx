'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import DashboardLayout from '@/components/DashboardLayout';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', 
    category: 'Metal', 
    condition: 'Used', 
    price: '', 
    quantity: '', 
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/products', formData);
      alert('Product added successfully!');
      router.push('/dashboard/seller/products');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="seller">
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Add New Product</h1>
                <p className="text-slate-600 mt-1">List a new product for sale</p>
              </div>
              <button 
                onClick={() => router.push('/dashboard/seller/products')}
                className="text-slate-600 hover:text-slate-900 font-medium flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Products</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Steel Beams, Wooden Planks, etc."
                />
              </div>

              {/* Category and Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Condition <span className="text-red-500">*</span>
                  </label>
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
              </div>

              {/* Price and Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-500">$</span>
                    <input 
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={6}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Provide a detailed description of your product including dimensions, material specifications, and any other relevant information..."
                />
                <p className="text-sm text-slate-500 mt-2">
                  Tip: Include details about the material, dimensions, weight, and any special features
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center space-x-4 pt-6 border-t border-slate-200">
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-4 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Adding Product...' : 'Add Product'}
                </button>
                <button 
                  type="button"
                  onClick={() => router.push('/dashboard/seller/products')}
                  className="px-8 py-4 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Tips for listing products</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use clear and descriptive product names</li>
                  <li>• Provide accurate measurements and specifications</li>
                  <li>• Be honest about the condition of the materials</li>
                  <li>• Set competitive prices based on market rates</li>
                  <li>• Keep your inventory quantities up to date</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
