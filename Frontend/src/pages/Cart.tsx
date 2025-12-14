import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const Cart = () => {
  // Mock cart data - in a real app, this would come from context/state management
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: '1', name: 'Ajmeera Kalakandh', price: 450, quantity: 2, imageUrl: '/sweetsImgs/AjmeeaKalakandh.jpg' },
    { id: '18', name: 'Rasmalai', price: 450, quantity: 1, imageUrl: '/sweetsImgs/Rasmalai.jpg' },
    { id: '14', name: 'Jalebi', price: 250, quantity: 3, imageUrl: '/sweetsImgs/Jalebi.jpg' },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = subtotal > 500 ? 0 : 50;
  const total = subtotal + deliveryCharge;

  return (
    <>
      <Header />
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8 flex items-center gap-3">
            <ShoppingCart className="w-10 h-10 text-purple-600" />
            Your Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Add some delicious sweets to your cart!</p>
              <Link
                to="/sweets"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition"
              >
                Browse Sweets <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex gap-4 shadow-lg border border-purple-100"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                      <p className="text-purple-600 font-bold text-xl">₹{item.price}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 rounded-full bg-purple-100 hover:bg-purple-200 transition"
                        >
                          <Minus className="w-4 h-4 text-purple-600" />
                        </button>
                        <span className="font-semibold text-gray-900 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 rounded-full bg-purple-100 hover:bg-purple-200 transition"
                        >
                          <Plus className="w-4 h-4 text-purple-600" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery</span>
                      <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                    </div>
                    {deliveryCharge > 0 && (
                      <p className="text-sm text-purple-600">
                        Add ₹{500 - subtotal} more for free delivery!
                      </p>
                    )}
                    <div className="border-t border-purple-100 pt-3">
                      <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Total</span>
                        <span>₹{total}</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition shadow-lg shadow-purple-300/50">
                    Proceed to Checkout
                  </button>
                  <Link
                    to="/sweets"
                    className="block text-center mt-4 text-purple-600 hover:underline"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
