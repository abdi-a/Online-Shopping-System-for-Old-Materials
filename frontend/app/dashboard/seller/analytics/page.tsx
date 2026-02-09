'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import DashboardLayout from '@/components/DashboardLayout';

export default function SellerAnalyticsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/my-products'),
        api.get('/seller/orders')
      ]);
      setProducts(productsRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="seller">
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const totalRevenue = orders
    .filter(o => o.status === 'approved' || o.status === 'confirmed')
    .reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);

  const categoryStats = products.reduce((acc: any, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  const topProducts = products
    .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
    .slice(0, 5);

  return (
    <DashboardLayout role="seller">
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Analytics & Insights</h1>
              <p className="text-slate-600 mt-1">Track your sales performance and product metrics</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <p className="text-blue-100 text-sm font-medium">Total Orders</p>
                  <p className="text-3xl font-bold mt-2">{orders.length}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold mt-2">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Avg Order Value</p>
                  <p className="text-3xl font-bold mt-2">
                    ${orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Products by Category */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Products by Category</h2>
              <div className="space-y-4">
                {Object.entries(categoryStats).map(([category, count]: [string, any]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm font-medium text-slate-700">{category}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-bold text-slate-900">{count}</span>
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{width: `${(count / products.length) * 100}%`}}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Status Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Status Distribution</h2>
              <div className="space-y-4">
                {['pending', 'confirmed', 'approved', 'rejected'].map(status => {
                  const count = orders.filter(o => o.status === status).length;
                  const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          status === 'pending' ? 'bg-yellow-500' :
                          status === 'confirmed' ? 'bg-blue-500' :
                          status === 'approved' ? 'bg-green-500' :
                          'bg-red-500'
                        }`}></div>
                        <span className="text-sm font-medium text-slate-700 capitalize">{status}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-slate-900">{count}</span>
                        <div className="w-32 bg-slate-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${
                            status === 'pending' ? 'bg-yellow-500' :
                            status === 'confirmed' ? 'bg-blue-500' :
                            status === 'approved' ? 'bg-green-500' :
                            'bg-red-500'
                          }`} style={{width: `${percentage}%`}}></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <h2 className="text-xl font-bold text-slate-900">Top Products by Stock</h2>
              <p className="text-sm text-slate-600 mt-1">Your products with highest inventory</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {topProducts.map((product: any) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-900">{product.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-slate-900">${product.price}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-900">{product.quantity}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
