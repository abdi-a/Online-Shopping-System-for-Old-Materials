'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data));
    api.get('/admin/orders').then(res => setTransactions(res.data.data)); // paginated response
  }, []);

  const approve = async (txId: number) => {
      await api.put(`/admin/transactions/${txId}`, { status: 'approved' });
      alert('Approved');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-red-700">Admin Dashboard</h1>

      {/* Stats Cards */}
      {stats && (
          <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-100 p-4 rounded">Users: {stats.users}</div>
              <div className="bg-green-100 p-4 rounded">Products: {stats.products}</div>
              <div className="bg-yellow-100 p-4 rounded">Orders: {stats.orders}</div>
              <div className="bg-purple-100 p-4 rounded">Revenue: ${stats.revenue}</div>
          </div>
      )}

      {/* Transactions Area */}
      <h2 className="text-xl font-bold mb-4">Pending Transactions</h2>
      <table className="w-full bg-white shadow rounded">
          <thead>
              <tr className="bg-gray-200 text-left">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Buyer</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3">Action</th>
              </tr>
          </thead>
          <tbody>
              {transactions.map((order: any) => (
                  <tr key={order.id} className="border-t">
                      <td className="p-3">#{order.id}</td>
                      <td className="p-3">{order.buyer.name}</td>
                      <td className="p-3">${order.total_price}</td>
                      <td className="p-3">{order.status}</td>
                      <td className="p-3">
                          {order.status === 'pending' && (
                             <button onClick={() => approve(order.transaction?.id)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                                Approve
                             </button>
                          )}
                      </td>
                  </tr>
              ))}
          </tbody>
      </table>
    </div>
  );
}
