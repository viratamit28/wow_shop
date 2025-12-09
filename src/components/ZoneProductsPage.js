// ZoneProductsPage.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Tumhara appliances data yahan import karo (same jagah se jahan ChooseLayout mein hai)
import { appliancesData } from './ChooseLayout'; // agar alag file mein hai toh wahan se import karo
// ya agar data same file mein hai toh upar wali line hata do aur neeche appliancesData use karo

export default function ZoneProductsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { zoneName, zoneProducts } = location.state || {};

  if (!zoneName || !zoneProducts || zoneProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">No Products Found</h1>
          <button onClick={() => navigate(-1)} className="bg-black text-white px-8 py-3 rounded-lg">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleSelect = (product) => {
    alert(`Selected: ${product.name}`);
    // Yahan baad mein real select logic laga dena
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
          All {zoneName === 'Referigerators' ? 'Refrigerators' : zoneName}
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          {zoneProducts.length} products available
        </p>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {zoneProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-3 line-clamp-2">{product.name}</h3>
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