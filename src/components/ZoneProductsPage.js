// src/components/ZoneProductsPage.js

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'; // useSearchParams add kiya
import axios from 'axios'; 

export default function ZoneProductsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // URL parameters read karne ke liye

  // LOGIC: Data ya toh Visualizer se aayega (state) YA Header se aayega (URL params)
  // Header bhejta hai: /products?category=Cooking&type=Ovens
  const zoneFromState = location.state?.zoneName;
  const typeFromUrl = searchParams.get('type');       // e.g. "Ovens"
  const categoryFromUrl = searchParams.get('category'); // e.g. "Cooking & Baking"

  // Final Filter determine karna (Priority: State > Type > Category)
  const activeFilter = zoneFromState || typeFromUrl || categoryFromUrl;

  // State banaya data store karne ke liye
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Database se Products lana
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Backend API call
        const response = await axios.get('http://localhost:5000/api/products');
        console.log("Data from DB:", response.data); 
        
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 2. Filter Logic (DB data aane ke baad filter karna)
  const displayedProducts = products.filter(item => {
    if (!activeFilter) return true; // Agar koi filter nahi hai toh sab dikhao

    // Hum check karenge ki item ki category ya naam match karta hai kya
    // Note: Apne DB schema ke hisaab se fields adjust karna (item.category, item.type, etc.)
    return (
      item.category === activeFilter || 
      item.name.includes(activeFilter) || 
      item.type === activeFilter
    );
  });

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold animate-pulse">Loading Products from Server...</h2>
      </div>
    );
  }

  // Agar Products nahi mile
  if (!displayedProducts || displayedProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">No Products Found</h1>
          <p className="mb-4 text-gray-600">
            Looking for: <span className="font-bold">{activeFilter}</span>
          </p>
          <button onClick={() => navigate(-1)} className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleSelect = (product) => {
    // Yahan hum user ko Product Details page pe bhej sakte hain
    navigate(`/product-details/${product._id}`);
  };

  const handleAddToCart = (product) => {
      // Future: Add to Cart Logic here
      alert(`${product.name} added to cart!`);
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-black font-medium transition-colors"
        >
          ← Back
        </button>

        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-200 pb-6">
            <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {activeFilter ? `${activeFilter} Collection` : 'All Products'}
                </h1>
                <p className="text-gray-500">
                Explore our premium range of kitchen appliances.
                </p>
            </div>
            <span className="text-lg font-medium text-gray-900 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 mt-4 md:mt-0">
                {displayedProducts.length} Items Found
            </span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayedProducts.map(product => (
            <div
              key={product._id} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col h-full"
            >
              {/* Image Area */}
              <div className="relative h-64 overflow-hidden rounded-t-2xl bg-gray-50 p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-500"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }} 
                />
                {/* Quick Add Button overlay (Optional style) */}
                <button 
                    onClick={() => handleSelect(product)}
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-black p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
              </div>

              {/* Content Area */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="mb-auto">
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">{product.category}</p>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{product.description}</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleSelect(product)}
                            className="bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold text-sm hover:bg-gray-200 transition"
                        >
                            View Details
                        </button>
                        <button 
                            onClick={() => handleAddToCart(product)}
                            className="bg-black text-white py-3 rounded-lg font-semibold text-sm hover:bg-amber-600 hover:text-white transition shadow-lg shadow-black/20 hover:shadow-amber-600/20"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}