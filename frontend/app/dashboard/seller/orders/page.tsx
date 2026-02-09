'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import DashboardLayout from '@/components/DashboardLayout';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get('/seller/orders');
      setOrders(res.data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId: number, status: 'confirmed' | 'rejected') => {
    try {
      await api.put(`/orders/${orderId}`, { status });
      alert(`Order ${status} successfully!`);
      loadOrders();
    } catch (error: any) {
      alert(error.response?.data?.message || `Failed to ${status} order`);
    }
  };

  const filteredOrders = orders.filter(order => {
    return statusFilter === 'All' || order.status === statusFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    approved: orders.filter(o => o.status === 'approved').length,
    total: orders.length
  };

  return (
    <DashboardLayout role="seller">
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Orders on My Products</h1>
                <p className="text-slate-600 mt-1">Manage orders for your products</p>
              </div>
              <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-emerald-900">Total Orders: {orders.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Total Orders</p>
                  <p className="text-3xl font-bold mt-2">{stats.total}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold mt-2">{stats.pending}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Confirmed</p>
                  <p className="text-3xl font-bold mt-2">{stats.confirmed}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Approved</p>
                  <p className="text-3xl font-bold mt-2">{stats.approved}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="All">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">
                  Showing <span className="font-semibold">{filteredOrders.length}</span> orders
                </p>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <svg className="mx-auto h-16 w-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-slate-900">No orders found</h3>
                <p className="mt-2 text-slate-600">Orders will appear here when buyers purchase your products</p>
              </div>
            ) : (
              filteredOrders.map((order: any) => (
                <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-emerald-100 rounded-lg p-3">
                          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-900">Order #{order.id}</p>
                          <p className="text-sm text-slate-600">
                            Buyer: {order.buyer?.name || 'Unknown'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(order.created_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <p className="text-2xl font-bold text-slate-900 mt-2">${order.total_price}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Order Items:</h4>
                    <div className="space-y-2">
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="flex justify-between bg-slate-50 p-3 rounded-lg">
                          <div>
                            <p className="font-semibold text-slate-900">{item.product?.name || 'Product'}</p>
                            <p className="text-sm text-slate-600">Quantity: {item.quantity} × ${item.price}</p>
                          </div>
                          <p className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-slate-900">Total: ${order.total_price}</p>
                      {order.status === 'pending' && (
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => handleOrderAction(order.id, 'confirmed')}
                            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm font-medium rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                          >
                            Confirm Order
                          </button>
                          <button 
                            onClick={() => handleOrderAction(order.id, 'rejected')}
                            className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-medium rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                          >
                            Reject Order
                          </button>
                        </div>
                      )}
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
