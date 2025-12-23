import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Filter, ChevronDown, 
  Heart, Star, ArrowRightLeft, X, ArrowRight, Check, Eye 
} from "lucide-react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

// ... (Category Config Same rahega, no change needed there) ...
const categoryConfig = {
  ovens: {
    title: "Signature Ovens",
    subtitle: "Precision baking meets modern aesthetics.",
    banner: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=2070&auto=format&fit=crop",
    filters: ["All", "Built-in", "Combi", "Microwave"]
  },
  hobs: {
    title: "Premium Hobs",
    subtitle: "The heart of your culinary creativity.",
    banner: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80",
    filters: ["All", "3 Burner", "4 Burner", "Induction"]
  },
  hoods: {
    title: "Designer Chimneys",
    subtitle: "Silent power for a fresh kitchen atmosphere.",
    banner: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&q=80",
    filters: ["All", "Wall Mounted", "Island", "Downdraft"]
  },
  refrigerators: {
    title: "Refrigerators",
    subtitle: "Keep your ingredients fresh in style.",
    banner: "https://images.unsplash.com/photo-1571175443880-49e1d58b95da?auto=format&fit=crop&q=80",
    filters: ["All", "Single Door", "Double Door", "Side-by-Side"]
  },
  dishwashers: {
    title: "Dishwashers",
    subtitle: "Effortless cleaning for your premium crockery.",
    banner: "https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?auto=format&fit=crop&q=80",
    filters: ["All", "Built-in", "Freestanding"]
  },
  'small-appliances': {
    title: "Countertop Essentials",
    subtitle: "Small but mighty essentials for daily prep.",
    banner: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?auto=format&fit=crop&q=80",
    filters: ["All", "Mixer", "Blender", "Toaster"]
  },
  washing: {
    title: "Laundry Care",
    subtitle: "Advanced fabric care for your clothes.",
    banner: "https://images.unsplash.com/photo-1626806749707-e44c82eed727?auto=format&fit=crop&q=80",
    filters: ["All", "Washing Machine", "Dryer"]
  }
};

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext); // Removed refreshCart as we are not adding to cart here anymore
  
  const [products, setProducts] = useState([]); 
  const [visibleProducts, setVisibleProducts] = useState([]); 
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Recommended");
  const [loading, setLoading] = useState(true);
  
  const [compareList, setCompareList] = useState([]); 

  const config = categoryConfig[slug] || categoryConfig['ovens'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/products?category=${slug}`);
        setProducts(res.data);
        setVisibleProducts(res.data);
      } catch (err) {
        console.error("Error fetching products", err);
        setProducts([]); 
        setVisibleProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug]);

  useEffect(() => {
    let filtered = [...products];
    if (activeFilter !== "All") {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(activeFilter.toLowerCase()) || p.type === activeFilter);
    }
    if (sortBy === "Price: Low to High") filtered.sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low") filtered.sort((a, b) => b.price - a.price);
    setVisibleProducts(filtered);
  }, [products, activeFilter, sortBy]);

  const toggleCompare = (e, product) => {
    e.stopPropagation();
    if (compareList.find(c => c._id === product._id)) {
        setCompareList(compareList.filter(c => c._id !== product._id));
    } else {
        if (compareList.length >= 3) return alert("You can only compare 3 items at a time.");
        setCompareList([...compareList, product]);
    }
  };

  const handleProductClick = (id) => {
    navigate(`/product-details/${id}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* ================= HERO HEADER ================= */}
      <div className="relative h-[50vh] w-full overflow-hidden mt-[100px]">
        <img src={config.banner} alt={config.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105" />
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-[0.3em] mb-4 animate-fade-in-up">The Collection</span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-4 tracking-wide animate-fade-in-up delay-100">
            {config.title}
          </h1>
          <p className="text-white/80 text-lg font-light tracking-wider max-w-xl animate-fade-in-up delay-200">
            {config.subtitle}
          </p>
        </div>

        {/* 👇 UPDATED: Back Button (Goes back in history) */}
        <button 
            onClick={() => navigate(-1)} 
            className="absolute top-8 left-8 text-white flex items-center gap-2 text-xs uppercase tracking-widest hover:text-amber-500 transition-colors z-20"
        >
            <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="sticky top-[80px] z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex overflow-x-auto no-scrollbar gap-2 w-full md:w-auto">
            {config.filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeFilter === filter ? "bg-black text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
             <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Sort</span>
             <select 
                className="bg-transparent text-sm font-bold text-gray-900 focus:outline-none cursor-pointer"
                onChange={(e) => setSortBy(e.target.value)}
             >
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
             </select>
          </div>
        </div>
      </div>

      {/* ================= PRODUCT GRID ================= */}
      <div className="container mx-auto px-6 py-16 pb-40">
        {loading ? (
           <div className="text-center py-20 text-gray-400">Loading exquisite items...</div>
        ) : visibleProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {visibleProducts.map((product) => {
              const isComparing = compareList.some(c => c._id === product._id);
              
              return (
                <div 
                    key={product._id} 
                    onClick={() => handleProductClick(product._id)}
                    className="group relative cursor-pointer"
                >
                  <div className={`relative aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden mb-4 border transition-all duration-300 ${isComparing ? "border-amber-500 ring-2 ring-amber-500 ring-offset-2" : "border-transparent group-hover:border-gray-200"}`}>
                     
                     <div className="absolute top-3 left-3 z-10">
                        {product.tag && <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">{product.tag}</span>}
                     </div>

                     <button 
                        onClick={(e) => toggleCompare(e, product)}
                        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-300 flex items-center gap-1 shadow-sm ${isComparing ? "bg-amber-500 text-white" : "bg-white text-gray-500 hover:bg-black hover:text-white"}`}
                        title={isComparing ? "Remove from Compare" : "Add to Compare"}
                     >
                        {isComparing ? <Check className="w-4 h-4" /> : <ArrowRightLeft className="w-4 h-4" />}
                     </button>

                     <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply" />

                     {/* 👇 UPDATED: View Details Button instead of Add to Cart */}
                     <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleProductClick(product._id);
                            }}
                            className="w-full bg-white text-black py-3 rounded-lg font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            <Eye className="w-4 h-4" /> View Details
                        </button>
                     </div>
                  </div>

                  <div>
                     <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-1">
                        {product.name}
                     </h3>
                     <div className="flex justify-between items-center mt-1">
                        <p className="text-gray-500 text-xs">{product.brand}</p>
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500 fill-current" />
                            <span className="text-xs font-bold">{product.rating || 4.5}</span>
                        </div>
                     </div>
                     <p className="text-lg font-serif font-bold text-gray-900 mt-2">₹{product.price.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center">
             <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
             <h3 className="text-xl font-medium text-gray-900">No products found</h3>
             <button onClick={() => setActiveFilter("All")} className="mt-4 text-amber-600 font-bold underline">Clear Filters</button>
          </div>
        )}
      </div>

      {/* ... Compare Bar (Same as before) ... */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] animate-slide-up">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div>
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Compare</p>
                        <p className="text-lg font-serif font-bold text-gray-900">{compareList.length} / 3 Selected</p>
                    </div>
                    <div className="hidden md:flex gap-3 pl-6 border-l border-gray-200">
                        {compareList.map(item => (
                            <div key={item._id} className="relative group">
                                <div className="w-12 h-12 border border-gray-200 rounded-lg p-1 bg-white">
                                    <img src={item.image} alt="" className="w-full h-full object-contain" />
                                </div>
                                <button 
                                    onClick={(e) => toggleCompare(e, item)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => setCompareList([])} className="text-gray-500 text-sm font-medium hover:text-red-500 hover:underline transition-colors">
                        Remove All
                    </button>
                    <button onClick={() => alert("Navigate to /compare")} className="bg-black text-white px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors flex items-center gap-2 shadow-lg">
                        Compare Now <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}