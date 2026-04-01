// src/components/ZoneProductsPage.js

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'; 
import axios from 'axios'; 

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function ZoneProductsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); 

  // URL se parameters extract karo
  const typeFromUrl = searchParams.get('type');       
  const categoryFromUrl = searchParams.get('category'); 
  const searchFromUrl = searchParams.get('search'); // 🔥 FIX: Search ko add kiya
  const zoneFromState = location.state?.zoneName;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Title banayenge UI ke liye
  let pageTitle = "All Products";
  if (searchFromUrl) pageTitle = `Search Results for "${searchFromUrl}"`;
  else if (typeFromUrl) pageTitle = `${typeFromUrl} Collection`;
  else if (categoryFromUrl) pageTitle = `${categoryFromUrl} Collection`;
  else if (zoneFromState) pageTitle = `${zoneFromState} Products`;

  // 1. Database se Products lana (Direct Filtered from Backend)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // 🔥 FIX: Backend API ko direct query parameters bhej rahe hain!
        // location.search me already "?category=...&type=..." hota hai
        // Agar state se zone aaya hai (without URL), toh manually query banayenge
        let queryUrl = `${BACKEND_URL}/api/products${location.search}`;
        
        if (!location.search && zoneFromState) {
            queryUrl = `${BACKEND_URL}/api/products?category=${encodeURIComponent(zoneFromState)}`;
        }

        const response = await axios.get(queryUrl);
        setProducts(response.data);
        
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search, zoneFromState]); // URL change hone pe data reload hoga

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h2 className="text-xl font-bold text-amber-600 animate-pulse flex items-center gap-3">
           <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
           Loading Premium Appliances...
        </h2>
      </div>
    );
  }

  // Agar Products nahi mile
  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">No Products Found</h1>
          <p className="mb-8 text-gray-600">
            We couldn't find any items matching your criteria.
          </p>
          <button onClick={() => navigate(-1)} className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-amber-600 font-bold tracking-widest uppercase text-[12px] transition-all shadow-md">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleSelect = (product) => {
    navigate(`/product-details/${product._id}`);
  };

  const handleAddToCart = (product) => {
      // Future me Context API se yahan add karenge
      // 🔥 CHANGE: product.name -> product.Product_Name
      alert(`${product.Product_Name} will be added to portfolio soon!`);
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors text-sm"
        >
          ← Back to Previous
        </button>

        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-200 pb-6">
            <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
                    {pageTitle}
                </h1>
                <p className="text-gray-500">
                    Explore our premium range of kitchen appliances tailored for your needs.
                </p>
            </div>
            <span className="text-[13px] font-bold text-gray-900 bg-white px-4 py-2 rounded shadow-sm border border-gray-100 mt-4 md:mt-0 uppercase tracking-widest">
                {products.length} Items Found
            </span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => {
            // 🔥 CHANGE: product.image -> product.Image
            const imageUrl = Array.isArray(product.Image) ? product.Image[0] : (product.Image || 'https://via.placeholder.com/300?text=No+Image');

            return (
              <div
                key={product._id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-100 flex flex-col h-full overflow-hidden"
              >
                {/* Image Area */}
                <div className="relative h-64 overflow-hidden bg-white p-6 cursor-pointer" onClick={() => handleSelect(product)}>
                  <img
                    src={imageUrl}
                    alt={product.Product_Name} // 🔥 CHANGE: product.name -> product.Product_Name
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }} 
                  />
                  
                  {/* Quick View Button Overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="bg-white/90 backdrop-blur text-gray-900 p-3 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-amber-600 hover:text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col flex-grow bg-gray-50/50">
                   <div className="mb-auto cursor-pointer" onClick={() => handleSelect(product)}>
                      {/* 🔥 CHANGE: product.category -> product.Category */}
                      <p className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest mb-2">{product.Category || product.Brand}</p>
                      {/* 🔥 CHANGE: product.name -> product.Product_Name */}
                      <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">{product.Product_Name}</h3>
                      {/* 🔥 CHANGE: product.description -> product.Technical_Specifications */}
                      <p className="text-[13px] text-gray-500 line-clamp-2 mb-4 font-light">{product.Technical_Specifications || "Premium kitchen appliance built for modern homes."}</p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-5">
                          {/* 🔥 CHANGE: product.price -> product.Selling_Price */}
                          <span className="text-xl font-bold text-gray-900">₹{product.Selling_Price?.toLocaleString() || 'N/A'}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                          <button
                              onClick={() => handleSelect(product)}
                              className="bg-white border border-gray-200 text-gray-900 py-3.5 rounded font-bold text-[11px] uppercase tracking-wider hover:border-gray-400 hover:bg-gray-50 transition-all text-center"
                          >
                              Details
                          </button>
                          <button 
                              onClick={() => handleAddToCart(product)}
                              className="bg-gray-900 text-white py-3.5 rounded font-bold text-[11px] uppercase tracking-wider hover:bg-amber-600 transition-all shadow-md text-center"
                          >
                              Add To List
                          </button>
                      </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}