import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function BrandPage() {
  const { brandName } = useParams(); 
  const navigate = useNavigate();
  const { addToCart } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandProducts = async () => {
      try {
        window.scrollTo(0,0);
        // 1. Fetch ALL products (Better approach: Backend filter API, but filtering here works for small DB)
        const res = await axios.get(`http://localhost:5000/api/products`);
        
        // 2. Filter logic (Case insensitive)
        const filtered = res.data.filter(p => 
            p.brand.toLowerCase() === brandName.toLowerCase()
        );
        
        setProducts(filtered);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchBrandProducts();
  }, [brandName]);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20">Loading Brand Collection...</div>;

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container mx-auto px-6">
        
        {/* HEADER */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-black mb-8">
            <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="mb-12 border-b border-gray-100 pb-8">
            <h1 className="text-4xl md:text-6xl font-serif text-gray-900 mb-2 capitalize">{brandName}</h1>
            <p className="text-gray-500">Explore the exclusive collection from {brandName}.</p>
        </div>

        {/* PRODUCTS GRID */}
        {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((item) => (
                    <div key={item._id} className="group cursor-pointer">
                        <div 
                            onClick={() => navigate(`/product-details/${item._id}`)}
                            className="bg-gray-50 rounded-xl p-8 mb-4 relative overflow-hidden border border-transparent group-hover:border-gray-200 transition-all"
                        >
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-48 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-900">{item.name}</h3>
                                <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                            </div>
                            <p className="font-bold text-amber-600">₹{item.price.toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 text-gray-400">
                No products found for this brand.
            </div>
        )}

      </div>
    </div>
  );
}