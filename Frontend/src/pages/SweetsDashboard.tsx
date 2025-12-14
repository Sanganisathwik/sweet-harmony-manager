import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header'; // Assuming this is your header component
import { Search, ShoppingCart, Menu, X, Star, Zap, Shield, Sparkles, User, Filter, ChevronDown, Loader2 } from 'lucide-react';

// --- MOCK DATA (Using existing mock data) ---
const MOCK_USER = { id: '1', name: 'Sweets Lover' };

const categories = ['all', 'Sweets', 'Premium sweets', 'Dry Fruits', 'Bakery', 'Snacks', 'Gift Boxes', 'Sugar Free'];

const MOCK_SWEETS = [
    { id: '1', name: "Ajmeera Kalakandh", category: "Sweets", price: 450, imageUrl: "/sweetsImgs/AjmeeaKalakandh.jpg", quantity: 10 },
    { id: '2', name: "Ariselu", category: "Sweets", price: 320, imageUrl: "/sweetsImgs/Ariselu.jpg", quantity: 12 },
    { id: '3', name: "Badusha", category: "Sweets", price: 280, imageUrl: "/sweetsImgs/Badusha.jpg", quantity: 15 },
    { id: '4', name: "Basen Ladoo", category: "Sweets", price: 350, imageUrl: "/sweetsImgs/BasenLadoo.jpg", quantity: 10 },
    { id: '5', name: "Brittle Candy", category: "Snacks", price: 180, imageUrl: "/sweetsImgs/BrittleCandy.jpg", quantity: 20 },
    { id: '6', name: "Chakkara Rekulu", category: "Sweets", price: 380, imageUrl: "/sweetsImgs/ChakkaraRekulu.jpg", quantity: 12 },
    { id: '7', name: "Coconut Burfi", category: "Sweets", price: 300, imageUrl: "/sweetsImgs/cocnutburfi.jpg", quantity: 15 },
    { id: '8', name: "Coconut Ladoo", category: "Sweets", price: 280, imageUrl: "/sweetsImgs/CocnutLadoo.jpg", quantity: 18 },
    { id: '9', name: "Community Special", category: "Gift Boxes", price: 1200, imageUrl: "/sweetsImgs/Community.jpg", quantity: 5 },
    { id: '10', name: "Dryfruit Basen Ladoo", category: "Premium sweets", price: 550, imageUrl: "/sweetsImgs/DryfruitBasenLadoo.jpg", quantity: 8 },
    { id: '11', name: "Gaja Halwa", category: "Sweets", price: 400, imageUrl: "/sweetsImgs/GajaHalwa.jpg", quantity: 10 },
    { id: '12', name: "Gond Ke Ladoo", category: "Premium sweets", price: 480, imageUrl: "/sweetsImgs/gond ke Ladoo.jpg", quantity: 7 },
    { id: '13', name: "Ice Cream Burfi", category: "Premium sweets", price: 420, imageUrl: "/sweetsImgs/IceCreamBurfi.jpg", quantity: 12 },
    { id: '14', name: "Jalebi", category: "Sweets", price: 250, imageUrl: "/sweetsImgs/Jalebi.jpg", quantity: 25 },
    { id: '15', name: "Kalakand", category: "Sweets", price: 380, imageUrl: "/sweetsImgs/Kalakand.jpg", quantity: 10 },
    { id: '16', name: "Mawa Malpua", category: "Sweets", price: 350, imageUrl: "/sweetsImgs/Mawa Malpua.jpg", quantity: 15 },
    { id: '17', name: "Pure Ghee Sweets", category: "Premium sweets", price: 600, imageUrl: "/sweetsImgs/PureGhee.jpg", quantity: 8 },
    { id: '18', name: "Rasmalai", category: "Sweets", price: 450, imageUrl: "/sweetsImgs/Rasmalai.jpg", quantity: 12 },
    { id: '19', name: "Shahi Tukra", category: "Premium sweets", price: 380, imageUrl: "/sweetsImgs/ShahiTukra.jpg", quantity: 10 },
    { id: '20', name: "Til Patti", category: "Snacks", price: 200, imageUrl: "/sweetsImgs/TilPatti.jpg", quantity: 20 },
    { id: '21', name: "Traditional Sweets Box", category: "Gift Boxes", price: 1500, imageUrl: "/sweetsImgs/TraditionalSweets.jpg", quantity: 5 },
];

// --- NEW: Sweet Card Component ---
const SweetCard = ({ sweet, handlePurchase, purchasingId }) => {
    const isOutOfStock = sweet.quantity === 0;
    const isPurchasing = purchasingId === sweet.id;

    return (
        <div 
            key={sweet.id} 
            className="group backdrop-blur-md bg-white/80 rounded-2xl overflow-hidden border border-purple-200/50 hover:border-purple-400 transition-all duration-300 shadow-xl hover:shadow-purple-300/50"
        >
            <div className="relative overflow-hidden">
                <img 
                    // Using sweet.imageUrl, ensuring it's a valid web path
                    src={sweet.imageUrl || '/sweetsImgs/IceCreamBurfi.jpg'} 
                    alt={sweet.name} 
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                
                {/* Visual Badges */}
                {isOutOfStock && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-red-600/90 text-white rounded-full text-xs font-bold shadow-md">
                        Out of Stock
                    </div>
                )}
                {!isOutOfStock && sweet.quantity < 5 && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500/90 text-white rounded-full text-xs font-bold shadow-md animate-pulse">
                        <Zap className="w-3 h-3 inline mr-1" /> Only {sweet.quantity} left
                    </div>
                )}
            </div>
            
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-serif font-bold text-xl mb-1 text-gray-900 leading-tight">{sweet.name}</h3>
                        <p className="text-sm text-purple-500 font-medium tracking-wider">{sweet.category}</p>
                    </div>
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-purple-100">
                    <p className="text-3xl font-extrabold text-purple-700">
                        ₹{sweet.price}
                    </p>
                    <button
                        onClick={() => handlePurchase(sweet)}
                        disabled={isOutOfStock || isPurchasing}
                        className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center justify-center ${
                            isOutOfStock
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                : isPurchasing
                                    ? 'bg-purple-400 text-white'
                                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-400/50 transform hover:scale-[1.02]'
                        }`}
                    >
                        {isPurchasing ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                            <ShoppingCart className="w-5 h-5 mr-2" />
                        )}
                        {isPurchasing ? 'Adding...' : isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- MAIN DASHBOARD COMPONENT ---
const SweetsDashboard = () => {
    const user = MOCK_USER;
    
    // Filter states
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [purchasingId, setPurchasingId] = useState(null);
    const [cart, setCart] = useState([]); // Cart state for demonstration

    // Filter sweets logic (unchanged, still efficient)
    const filteredSweets = useMemo(() => {
        return MOCK_SWEETS.filter(sweet => {
            const matchesSearch = sweet.name.toLowerCase().includes(search.toLowerCase());
            // Added logic for 'Premium sweets' which was mismatched in categories
            const matchesCategory = category === 'all' || sweet.category.toLowerCase().includes(category.toLowerCase());
            const matchesMinPrice = !minPrice || sweet.price >= Number(minPrice);
            const matchesMaxPrice = !maxPrice || sweet.price <= Number(maxPrice);
            return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
        });
    }, [search, category, minPrice, maxPrice]);

    const handlePurchase = async (sweet) => {
        if (!user) {
            alert('Please sign in to make a purchase');
            return;
        }
        if (sweet.quantity === 0) {
            alert('This item is out of stock');
            return;
        }
        setPurchasingId(sweet.id);
        
        // Simulate API call
        setTimeout(() => {
            setCart(prev => [...prev, sweet]);
            // Removed alert, better UX for small actions
            console.log(`Added ${sweet.name} to cart! Current cart size: ${cart.length + 1}`);
            setPurchasingId(null);
        }, 800);
    };

    return (
        <>
            {/* Assuming Header is styled to match the theme */}
            <Header /> 
            
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen text-gray-900 font-sans">
                {/* Enhanced Animated Background (using more subtle, faster animations) */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-200/50 rounded-full blur-[100px] opacity-20 animate-wiggle"></div>
                    <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-pink-200/50 rounded-full blur-[100px] opacity-20 animate-wiggle-reverse" style={{animationDelay: '1.5s'}}></div>
                </div>

                {/* --- ELEVATED HERO SECTION --- */}
                <section className="relative py-24 lg:py-32 z-10 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center justify-between">
                            
                            {/* Hero Text Content */}
                            <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
                                <h2 className="font-serif text-6xl lg:text-8xl font-extrabold mb-4 text-gray-900 leading-tight drop-shadow-md">
                                    <span className="text-pink-600">Taste</span> of Tradition
                                </h2>
                                <p className="text-xl lg:text-2xl text-gray-700 mb-8 max-w-md lg:max-w-none">
                                    Handcrafted sweets, dry fruits, and gourmet treats. Experience the finest quality delivered to your door.
                                </p>
                                <div className="flex justify-center lg:justify-start space-x-4">
                                    <a href="#menu" className="px-8 py-3 bg-purple-600 text-white text-lg rounded-full font-bold shadow-xl shadow-purple-300/50 hover:bg-purple-700 transition duration-300 transform hover:scale-105">
                                        Shop Now
                                    </a>
                                    <button className="px-8 py-3 bg-white/70 text-purple-600 text-lg rounded-full font-bold border border-purple-300 hover:bg-white transition duration-300 transform hover:scale-105">
                                        <Star className="w-5 h-5 inline mr-2 text-yellow-500" /> Best Sellers
                                    </button>
                                </div>
                            </div>

                            {/* Hero Visual Element (Overlapping image/card) */}
                            <div className="lg:w-1/2 flex justify-center relative">
                                <div className="w-full max-w-lg aspect-square bg-white/70 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-4 border-white/90 backdrop-blur-sm transform rotate-3">
                                    <img 
                                        src="/sweetsImgs/IceCreamBurfi.jpg" 
                                        alt="Assorted Premium Sweets" 
                                        className="w-full h-full object-cover rounded-2xl shadow-2xl"
                                    />
                                    {/* Accent Badge */}
                                    <div className="absolute top-0 -left-6 bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl transform -rotate-6">
                                        <Sparkles className="w-4 h-4 inline mr-1" /> New Arrivals!
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <style jsx global>{`
                    /* Keyframes for subtle background animation */
                    @keyframes wiggle {
                        0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                        25% { transform: translate(-10px, 15px) rotate(1deg) scale(1.05); }
                        50% { transform: translate(10px, -15px) rotate(-1deg) scale(1); }
                        75% { transform: translate(-5px, 5px) rotate(0.5deg) scale(1.02); }
                    }
                    @keyframes wiggle-reverse {
                        0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                        25% { transform: translate(10px, -15px) rotate(-1deg) scale(1.05); }
                        50% { transform: translate(-10px, 15px) rotate(1deg) scale(1); }
                        75% { transform: translate(5px, -5px) rotate(-0.5deg) scale(1.02); }
                    }
                    .animate-wiggle {
                        animation: wiggle 20s infinite ease-in-out;
                    }
                    .animate-wiggle-reverse {
                        animation: wiggle-reverse 20s infinite ease-in-out;
                    }
                    .font-serif {
                        font-family: 'Georgia', serif; /* Use a beautiful serif font for titles */
                    }
                `}</style>


                {/* Main Content */}
                <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 z-10">
                    
                    {/* Section Title - More prominent */}
                    <div className="mb-10 text-center">
                        <p className="text-purple-600 font-semibold text-lg uppercase tracking-widest mb-1">Explore</p>
                        <h2 id="menu" className="font-serif text-4xl lg:text-5xl font-bold mb-4 text-gray-900">Our Full Gourmet Menu</h2>
                        <p className="text-gray-600 text-lg">Browse our meticulously crafted selection of {MOCK_SWEETS.length} treats.</p>
                    </div>

                    {/* Filters Section - Styled for better visual appeal */}
                    <div className="mb-12">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden mb-4 px-5 py-2 bg-purple-600 text-white rounded-full font-semibold flex items-center justify-center w-full space-x-2 shadow-lg hover:bg-purple-700 transition"
                        >
                            <Filter className="w-5 h-5" />
                            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : 'rotate-0'}`} />
                        </button>

                        <div className={`backdrop-blur-xl bg-white/90 rounded-3xl p-6 lg:p-8 border border-purple-300/50 shadow-2xl shadow-purple-200/50 ${showFilters ? 'block' : 'hidden md:block'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {/* Search */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Search Product</label>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-purple-400" />
                                        <input
                                            type="text"
                                            placeholder="Search sweets by name..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition text-gray-900 placeholder-gray-500 shadow-inner"
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Filter by Category</label>
                                    <div className="relative">
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-3.5 bg-white/80 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition text-gray-900 appearance-none shadow-inner"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Price Range (₹)</label>
                                    <div className="flex space-x-3">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="w-1/2 px-3 py-3.5 bg-white/80 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition text-gray-900 placeholder-gray-500 shadow-inner"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="w-1/2 px-3 py-3.5 bg-white/80 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition text-gray-900 placeholder-gray-500 shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Active Filters Display & Clear Button */}
                            {(search || category !== 'all' || minPrice || maxPrice) && (
                                <div className="mt-6 pt-4 border-t border-purple-200">
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <span className="text-sm font-semibold text-gray-700">Active filters:</span>
                                        {search && (
                                            <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-medium flex items-center">
                                                <Search className="w-3 h-3 mr-1" /> "{search}"
                                            </span>
                                        )}
                                        {category !== 'all' && (
                                            <span className="px-3 py-1 bg-pink-200 text-pink-800 rounded-full text-xs font-medium">
                                                {category}
                                            </span>
                                        )}
                                        {(minPrice || maxPrice) && (
                                            <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                                                ₹{minPrice || '0'} - ₹{maxPrice || '∞'}
                                            </span>
                                        )}
                                        <button
                                            onClick={() => {
                                                setSearch('');
                                                setCategory('all');
                                                setMinPrice('');
                                                setMaxPrice('');
                                            }}
                                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-300 transition"
                                        >
                                            <X className="w-3 h-3 inline mr-1" /> Clear All
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-6 text-xl font-semibold text-gray-700">
                        Showing <span className="font-extrabold text-purple-700">{filteredSweets.length}</span> results
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredSweets.length === 0 ? (
                            <div className="col-span-full text-center py-20">
                                <div className="backdrop-blur-xl bg-white/80 rounded-3xl p-16 border border-purple-300/50 shadow-xl">
                                    <p className="text-gray-600 text-xl font-semibold mb-6">😔 Oh no! No sweets found matching your refined taste.</p>
                                    <button
                                        onClick={() => {
                                            setSearch('');
                                            setCategory('all');
                                            setMinPrice('');
                                            setMaxPrice('');
                                        }}
                                        className="mt-4 px-8 py-3 bg-pink-600 text-white rounded-full font-bold hover:bg-pink-700 transition shadow-lg transform hover:scale-105"
                                    >
                                        <Filter className="w-5 h-5 inline mr-2" /> Reset Filters
                                    </button>
                                </div>
                            </div>
                        ) : (
                            filteredSweets.map(sweet => (
                                <SweetCard 
                                    key={sweet.id} 
                                    sweet={sweet} 
                                    handlePurchase={handlePurchase} 
                                    purchasingId={purchasingId} 
                                />
                            ))
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative border-t-2 border-purple-200/50 py-10 mt-16 bg-white/70 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
                        <p className="text-lg mb-2">Sweet Harmony — Handcrafted with Love ❤️</p>
                        <p className="text-sm">© 2025 Sweet Shop. All Rights Reserved. | Designed with passion for premium sweets.</p>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default SweetsDashboard;