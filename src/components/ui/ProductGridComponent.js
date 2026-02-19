import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductGridComponent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded Base URL (Taaki import ki galti na ho)
  // Note: Maine end mein '/' lagaya hai
  const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dcljdkqer/image/upload/";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Latest Arrivals</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          
          // 🔥 FINAL FIX HERE:
          // 1. Base URL joda
          // 2. Product ID joda
          // 3. '.jpg' apni taraf se laga diya (Extension fix)
          const fullImageUrl = `${CLOUDINARY_BASE_URL}${product.image}.jpg`;

          return (
            <div key={product._id} className="border rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden">
              <div className="h-64 overflow-hidden bg-gray-100">
                <img 
                  src={fullImageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                  // Debugging ke liye: Agar ab bhi load na ho to console me error dikhega
                  onError={(e) => { 
                    console.log("Image Failed Load:", fullImageUrl);
                    e.target.src = "https://placehold.co/400?text=Error"; 
                  }} 
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-500 text-sm">{product.category}</p>
                <span className="text-xl font-bold">₹{product.price}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGridComponent;