import React from 'react';
import { Header } from '@/components/layout/Header';
import { User, Package, Heart, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { user, signOut } = useAuth();

  const menuItems = [
    { icon: Package, label: 'My Orders', path: '/orders', description: 'View your order history' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist', description: 'Your saved items' },
    { icon: Settings, label: 'Settings', path: '/settings', description: 'Account settings' },
  ];

  return (
    <>
      <Header />
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Profile Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-serif font-bold text-gray-900">
                  {user?.user_metadata?.full_name || 'Sweet Lover'}
                </h1>
                <p className="text-gray-500">{user?.email || 'guest@sweetharmony.com'}</p>
                <p className="text-purple-600 font-medium mt-1">Member since Dec 2024</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 hover:border-purple-300 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-100 group-hover:bg-purple-200 transition">
                    <item.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.label}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Stats</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-purple-600">12</p>
                <p className="text-sm text-gray-500">Orders</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-pink-600">5</p>
                <p className="text-sm text-gray-500">Wishlist</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">₹4,500</p>
                <p className="text-sm text-gray-500">Total Spent</p>
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
