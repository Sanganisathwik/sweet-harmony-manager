import React from 'react';
import { Header } from '@/components/layout/Header';
import { Package, Truck, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders = () => {
  // Mock orders data
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-12-12',
      status: 'delivered',
      total: 1250,
      items: [
        { name: 'Rasmalai', quantity: 2, price: 450 },
        { name: 'Jalebi', quantity: 1, price: 250 },
      ]
    },
    {
      id: 'ORD-002',
      date: '2024-12-10',
      status: 'shipped',
      total: 850,
      items: [
        { name: 'Badusha', quantity: 3, price: 280 },
      ]
    },
    {
      id: 'ORD-003',
      date: '2024-12-08',
      status: 'processing',
      total: 1500,
      items: [
        { name: 'Traditional Sweets Box', quantity: 1, price: 1500 },
      ]
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <>
      <Header />
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Package className="w-10 h-10 text-purple-600" />
            My Orders
          </h1>

          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl">
              <Package className="w-24 h-24 mx-auto text-gray-300 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">No orders yet</h2>
              <p className="text-gray-500 mb-8">Start shopping to see your orders here!</p>
              <Link
                to="/sweets"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition"
              >
                Browse Sweets
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 hover:border-purple-200 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="font-bold text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-purple-100 pt-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-gray-600 py-1">
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-purple-100">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-purple-600">₹{order.total}</span>
                    </div>
                  </div>

                  <button className="mt-4 flex items-center text-purple-600 hover:text-purple-700 font-medium transition">
                    View Details <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
