// src/components/ZoneProductsPage.js

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios import kiya

export default function ZoneProductsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Humen sirf zoneName chahiye, products hum DB se layenge
  const { zoneName } = location.state || {};

  // State banaya data store karne ke liye
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Jab page khulega, tab ye chalega
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Backend API call
        const response = await axios.get('http://localhost:5000/api/products');
        console.log("Data from DB:", response.data); // Console check karna
        
        // Data set kar diya
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter Logic: Jo Zone select kiya hai, bas wahi products dikhaye
  // Note: Database me 'category' aur yahan 'zoneName' ki spelling same honi chahiye
  const displayedProducts = products.filter(item => 
    zoneName ? item.category === zoneName : true
  );
  // const displayedProducts = products;

  // Loading Screen (Jab tak data aa raha hai)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Loading Products from Server...</h2>
      </div>
    );
  }

  // Agar Products nahi mile
  if (!displayedProducts || displayedProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">No Products Found</h1>
          <p className="mb-4 text-gray-600">Looking for Category: {zoneName}</p>
          <button onClick={() => navigate(-1)} className="bg-black text-white px-8 py-3 rounded-lg">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleSelect = (product) => {
    alert(`Selected: ${product.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-700 hover:text-black font-medium"
        >
          Back to Layout
        </button>

        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          All {zoneName || 'Products'}
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          {displayedProducts.length} products available
        </p>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {displayedProducts.map(product => (
            <div
              key={product._id} // MongoDB me id '_id' hoti hai
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              <div className="h-64 overflow-hidden bg-gray-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }} // Fallback image
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-3 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                <p className="text-3xl font-bold text-green-600 mb-6">
                  ₹{product.price.toLocaleString()}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSelect(product)}
                    className="flex-1 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition"
                  >
                    Select
                  </button>
                  <button className="flex-1 bg-yellow-500 text-black py-4 rounded-xl font-bold hover:bg-yellow-600 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}