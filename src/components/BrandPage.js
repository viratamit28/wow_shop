import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Star, Filter, ArrowLeft } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';

// ==================== 1. BRAND DATA (Dummy Info) ====================
const brandsInfo = {
  bosch: {
    name: "Bosch",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Bosch-Logo.svg/2560px-Bosch-Logo.svg.png",
    description: "Bosch is a world-class German engineering brand known for precision, quality, and reliability. Their kitchen appliances combine timeless design with advanced technology to make cooking effortless.",
    banner: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80",
    categories: ["All", "Ovens", "Hobs", "Dishwashers", "Chimneys"]
  },
  siemens: {
    name: "Siemens",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Siemens_AG_logo.svg/2560px-Siemens_AG_logo.svg.png",
    description: "Siemens offers visionary technology and fascinating design. Their built-in appliances are designed to work together seamlessly, offering you full control over your kitchen.",
    banner: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80",
    categories: ["All", "Coffee Machines", "Ovens", "Hobs"]
  },
  // Default fallback for other brands
  default: {
    name: "Premium Partner",
    logo: "",
    description: "Experience the best in kitchen innovation with our premium brand partners. Quality and durability guaranteed.",
    banner: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80",
    categories: ["All", "Ovens", "Hobs"]
  }
};

// ==================== 2. PRODUCT DATA (10 Items) ====================
// Real scenario me ye Backend API se aayega via `brand` filter
const dummyBrandProducts = [
  { id: 1, name: "Series 8 Oven", category: "Ovens", price: 85000, image: "https://images.unsplash.com/photo-1585233216503-4f9327588147?auto=format&fit=crop&q=80" },
  { id: 2, name: "Induction Hob 4 Zone", category: "Hobs", price: 45000, image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80" },
  { id: 3, name: "Silent Dishwasher", category: "Dishwashers", price: 55000, image: "https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?auto=format&fit=crop&q=80" },
  { id: 4, name: "Wall Chimney 90cm", category: "Chimneys", price: 28000, image: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&q=80" },
  { id: 5, name: "Combi Microwave", category: "Ovens", price: 35000, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80" },
  { id: 6, name: "Gas Hob 5 Burner", category: "Hobs", price: 32000, image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80" },
  { id: 7, name: "Built-in Coffee Machine", category: "Coffee Machines", price: 120000, image: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?auto=format&fit=crop&q=80" },
  { id: 8, name: "Steam Oven Pro", category: "Ovens", price: 95000, image: "https://images.unsplash.com/photo-1626806749707-e44c82eed727?auto=format&fit=crop&q=80" },
  { id: 9, name: "Island Hood", category: "Chimneys", price: 65000, image: "https://plus.unsplash.com/premium_photo-1664372599744-607291a12028?auto=format&fit=crop&q=80" },
  { id: 10, name: "Warming Drawer", category: "Ovens", price: 15000, image: "https://plus.unsplash.com/premium_photo-1686050416693-4b6d655e69e0?auto=format&fit=crop&q=80" },
];

export default function BrandPage() {
  const { brandSlug } = useParams();
  const navigate = useNavigate();
  const { token, refreshCart } = useContext(AuthContext);

  const [activeCategory, setActiveCategory] = useState("All");

  // Get Brand Data
  const brandData = brandsInfo[brandSlug] || brandsInfo.default;

  // Filter Products Logic
  const filteredProducts = activeCategory === "All" 
    ? dummyBrandProducts 
    : dummyBrandProducts.filter(p => p.category === activeCategory);

  // Add to Cart Logic
  const handleAddToCart = async (product) => {
    if (!token) {
      alert("Please login first!");
      return;
    }
    try {
      // Backend API call (Using Dummy ID for now, real DB ID chahiye hoga)
      // Note: Real world me product._id use karna
      await axios.post('http://localhost:5000/api/cart/add', 
        { productId: "DUMMY_ID_" + product.id, quantity: 1 }, // Replace with real ID
        { headers: { 'auth-token': token } }
      );
      refreshCart();
      alert(`${product.name} added to cart!`);
    } catch (err) {
      // Since we are using dummy data without real DB IDs, it might fail on backend
      // But UI logic is correct.
      alert("Backend error: Product ID mismatch (Dummy Data)");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[400px] w-full bg-black">
        <img src={brandData.banner} alt="Banner" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 via-transparent to-black/30" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="container mx-auto flex flex-col md:flex-row items-end gap-8">
            {/* Logo Box */}
            <div className="w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center p-4 -mb-12 relative z-10">
              <img src={brandData.logo} alt={brandData.name} className="max-w-full max-h-full object-contain" />
            </div>
            
            <div className="flex-1 mb-4">
               <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-2">{brandData.name}</h1>
               <p className="text-gray-600 max-w-2xl text-lg">{brandData.description}</p>
            </div>
          </div>
        </div>

        <button 
           onClick={() => navigate('/')}
           className="absolute top-8 left-8 text-white flex items-center gap-2 hover:text-amber-500 transition"
        >
           <ArrowLeft className="w-5 h-5" /> Back
        </button>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        
        {/* Filters */}
        <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
           <span className="text-gray-400 font-bold uppercase text-xs tracking-widest mr-2 flex items-center gap-2">
             <Filter className="w-4 h-4" /> Filter:
           </span>
           {brandData.categories.map(cat => (
             <button
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                 activeCategory === cat 
                 ? "bg-black text-white shadow-lg" 
                 : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
               }`}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {filteredProducts.map((product) => (
             <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                
                {/* Image */}
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                   <img 
                     src={product.image} 
                     alt={product.name} 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" 
                   />
                   <div className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">
                     {product.category}
                   </div>
                </div>

                {/* Details */}
                <div className="p-5">
                   <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3 h-3 fill-current" /> 4.8
                      </div>
                   </div>
                   
                   <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                     Premium finish {product.category.toLowerCase()} with advanced features for modern kitchens.
                   </p>

                   <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-lg font-serif font-bold text-gray-900">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-black text-white p-3 rounded-full hover:bg-amber-500 hover:text-black transition-colors shadow-lg hover:shadow-amber-500/20 active:scale-95"
                      >
                         <ShoppingCart className="w-4 h-4" />
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