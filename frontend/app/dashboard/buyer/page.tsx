'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function BuyerDashboard() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Fetch my orders
    api.get('/my-orders').then(res => setOrders(res.data))
       .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Buyer Dashboard</h1>
      <h2 className="text-xl mb-4">My Order History</h2>
      
      <div className="grid gap-4">
        {orders.map((order: any) => (
            <div key={order.id} className="border p-4 rounded bg-white shadow">
                <p className="font-bold">Order #{order.id}</p>
                <p>Status: <span className="capitalize text-blue-600">{order.status}</span></p>
                <p>Total: ${order.total_price}</p>
                <div className="mt-2 text-sm text-gray-600">
                    <p>Items:</p>
                    <ul className="list-disc pl-5">
                        {order.items.map((item: any) => (
                            <li key={item.id}>{item.product.name} (x{item.quantity})</li>
                        ))}
                    </ul>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
