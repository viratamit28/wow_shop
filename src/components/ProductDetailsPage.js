import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { 
  Star, Check, ShoppingCart, ArrowLeft, 
  ShieldCheck, Truck, RotateCcw, Share2, Plus, X 
} from 'lucide-react';
import { AuthContext } from "../context/AuthContext";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, refreshCart } = useContext(AuthContext);

  const [product, setProduct] = useState(null); 
  const [similarProducts, setSimilarProducts] = useState([]); // For comparison
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(""); // For image switching if you have gallery

  // --- 1. FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Scroll to top when ID changes
        window.scrollTo(0,0);

        // Fetch Current Product
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
        setMainImage(res.data.image);

        // Fetch Similar Products (Same Category)
        if (res.data.category) {
            const relatedRes = await axios.get(`http://localhost:5000/api/products?category=${res.data.category}`);
            // Exclude current product
            setSimilarProducts(relatedRes.data.filter(p => p._id !== id).slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // --- 2. ADD TO CART LOGIC ---
  const handleAddToCart = async () => {
    if (!token) return alert("Please Login to shop!");
    try {
      await axios.post('http://localhost:5000/api/cart/add', 
        { productId: product._id, quantity: 1 }, 
        { headers: { 'auth-token': token } }
      );
      refreshCart();
      alert("Added to Cart Successfully!");
    } catch (err) { alert("Could not add to cart."); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-400 font-medium tracking-widest">LOADING LUXURY...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product Not Found</div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans mt-[100px]">
      
      {/* ================= HEADER NAVIGATION ================= */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-3 text-sm text-gray-500 hover:text-black transition-colors uppercase tracking-widest font-bold"
        >
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-black transition-colors">
                <ArrowLeft className="w-4 h-4" />
            </div>
            Back
        </button>
        <div className="text-xs text-gray-400 uppercase tracking-widest hidden md:block">
            {product.category} / {product.brand} / <span className="text-black">{product.name}</span>
        </div>
      </div>

      {/* ================= MAIN CONTENT GRID ================= */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
        
        {/* LEFT: IMAGE GALLERY (Premium Look) */}
        <div className="space-y-6">
            <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 flex items-center justify-center p-8 group">
                <img 
                    src={mainImage} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" 
                />
                {product.tag && (
                    <span className="absolute top-6 left-6 bg-black text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest">
                        {product.tag}
                    </span>
                )}
            </div>
            {/* Thumbnails (Mocked for now, assumes single image usually) */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                {[product.image].map((img, i) => (
                    <button 
                        key={i} 
                        onClick={() => setMainImage(img)}
                        className={`w-20 h-20 rounded-xl border-2 flex-shrink-0 p-2 flex items-center justify-center bg-white transition-all ${mainImage === img ? "border-black" : "border-transparent hover:border-gray-300"}`}
                    >
                        <img src={img} className="max-h-full max-w-full object-contain mix-blend-multiply" alt=""/>
                    </button>
                ))}
            </div>
        </div>

        {/* RIGHT: PRODUCT DETAILS */}
        <div className="flex flex-col justify-center">
            
            {/* Brand & Rating */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-amber-600 font-bold text-xs uppercase tracking-[0.2em]">{product.brand}</span>
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <Star className="w-3 h-3 text-black fill-black" />
                    <span className="text-xs font-bold">{product.rating || 4.5} (120+ Reviews)</span>
                </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-6">
                {product.name}
            </h1>

            {/* Price Block */}
            <div className="flex items-baseline gap-4 mb-8 border-b border-gray-100 pb-8">
                <span className="text-4xl font-light text-gray-900">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                    <>
                        <span className="text-xl text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                        <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">
                            {Math.round(((product.originalPrice - product.price)/product.originalPrice)*100)}% SAVE
                        </span>
                    </>
                )}
            </div>

            {/* Description */}
            <p className="text-gray-500 leading-relaxed mb-8">
                {product.description || "Experience the pinnacle of kitchen innovation. Designed for the modern home chef, this appliance combines aesthetic elegance with industrial-grade performance."}
            </p>

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
                {product.features && product.features.length > 0 ? product.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-700">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-700 shrink-0">
                            <Check className="w-3 h-3" />
                        </div>
                        {feat}
                    </div>
                )) : (
                    // Fallback features if none in DB
                    ["Smart Connectivity", "Energy Efficient", "2 Year Warranty", "Premium Finish"].map((f, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-gray-700">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                                <Check className="w-3 h-3" />
                            </div>
                            {f}
                        </div>
                    ))
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
                <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-black text-white h-14 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
                <button className="w-14 h-14 border border-gray-200 rounded-xl flex items-center justify-center hover:border-black hover:bg-gray-50 transition-all text-gray-600 hover:text-black">
                    <Share2 className="w-5 h-5" />
                </button>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-6 text-xs text-gray-500 font-medium uppercase tracking-wider">
                <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Free Delivery
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> 1 Year Warranty
                </div>
                <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> 7 Day Returns
                </div>
            </div>

        </div>
      </div>

      {/* ================= TECH SPECS (Table) ================= */}
      {product.specs && (
        <div className="bg-gray-50 py-20">
            <div className="max-w-4xl mx-auto px-6">
                <h3 className="text-2xl font-serif text-center mb-10">Technical Specifications</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {Object.entries(product.specs).map(([key, value], idx) => (
                        <div key={key} className={`flex flex-col sm:flex-row p-5 ${idx !== Object.keys(product.specs).length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <div className="sm:w-1/3 text-gray-500 font-medium text-sm uppercase tracking-wide">{key}</div>
                            <div className="sm:w-2/3 font-bold text-gray-900 mt-1 sm:mt-0">{value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* ================= SIMILAR PRODUCTS (For Comparison) ================= */}
      {similarProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-serif">Similar Items You Might Like</h3>
                <button onClick={() => navigate(`/category/${product.category.toLowerCase()}`)} className="text-xs font-bold uppercase tracking-widest text-amber-600 hover:text-black transition-colors">View All</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {similarProducts.map((item) => (
                    <div 
                        key={item._id} 
                        onClick={() => navigate(`/product-details/${item._id}`)}
                        className="group border border-gray-100 rounded-xl p-4 cursor-pointer hover:shadow-xl hover:border-amber-100 transition-all bg-white"
                    >
                        <div className="aspect-square flex items-center justify-center bg-gray-50 rounded-lg mb-4 p-4">
                            <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">{item.name}</h4>
                        <div className="flex items-center justify-between">
                            <p className="text-amber-600 font-bold">₹{item.price.toLocaleString()}</p>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">{item.brand}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

    </div>
  );
}