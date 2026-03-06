import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"; 
import { 
  ArrowLeft, Filter, X, ArrowRight, Check, Eye, Star, 
  ArrowRightLeft, ChevronDown, Sparkles
} from "lucide-react";

// 🔥 FIX 1: Deployment Ready Backend URL
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// 🔥 FIX 2: Exact Database Alignment
const SLUG_TO_DB_MAP = {
  "hoods": "chimneys", // UI me hoods, DB me chimneys
  // Baaki sabka slug aur DB category name same hai (ovens, hobs, washing, etc.)
};

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
  countertop: {
    title: "Countertop Essentials",
    subtitle: "Small but mighty essentials for daily prep.",
    banner: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?auto=format&fit=crop&q=80",
    filters: ["All", "Mixer", "Blender", "Toaster"]
  },
  washing: {
    title: "Washing Machines",
    subtitle: "Advanced fabric care for your clothes.",
    banner: "https://images.unsplash.com/photo-1626806749707-e44c82eed727?auto=format&fit=crop&q=80",
    filters: ["All", "Washing", "Dryer"] 
  }
};

// 🔥 FIX 3: Universal Image Helper (Handles arrays, absolute URLs, and local uploads gracefully)
const getImageUrl = (imgPath) => {
  if (!imgPath) return "https://placehold.co/400x300?text=No+Image";
  if (Array.isArray(imgPath)) imgPath = imgPath.length > 0 ? imgPath[0] : "";
  if (typeof imgPath !== 'string' || !imgPath) return "https://placehold.co/400x300?text=No+Image";
  if (imgPath.startsWith('http')) return imgPath;
  return `${BACKEND_URL}/${imgPath.replace(/\\/g, '/')}`;
};

// ✨ Premium Image Component
const ProductImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#FAFAFA] flex items-center justify-center">
      <div className={`absolute inset-0 bg-gray-100 animate-pulse transition-opacity duration-700 ${loaded ? 'opacity-0' : 'opacity-100'}`} />
      <img 
        src={src} 
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-contain p-8 transition-all duration-1000 ease-out 
          ${loaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-sm'} 
          group-hover:scale-110 mix-blend-multiply`}
        onError={(e) => { e.target.src = "https://placehold.co/400x300?text=Image+Not+Found" }}
      />
    </div>
  );
};

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]); 
  const [visibleProducts, setVisibleProducts] = useState([]); 
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Recommended");
  const [loading, setLoading] = useState(true);
  const [compareList, setCompareList] = useState([]); 

  const config = categoryConfig[slug] || categoryConfig['ovens'];

  // Scroll Parallax Effect
  const { scrollY } = useScroll();
  const yRange = useTransform(scrollY, [0, 500], [0, 200]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const dbCategory = SLUG_TO_DB_MAP[slug] || slug;
        const res = await axios.get(`${BACKEND_URL}/api/products?category=${encodeURIComponent(dbCategory)}`);
        
        let data = [];
        if (Array.isArray(res.data)) data = res.data;
        else if (res.data && res.data.products) data = res.data.products;

        setProducts(data);
        setVisibleProducts(data);
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
        filtered = filtered.filter(p => {
            const search = activeFilter.toLowerCase();
            return (p.name?.toLowerCase().includes(search) || p.type?.toLowerCase() === search || p.category?.toLowerCase().includes(search));
        });
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
        if (compareList.length >= 3) return alert("You can only compare 3 items.");
        setCompareList([...compareList, product]);
    }
  };

  const handleProductClick = (id) => navigate(`/product-details/${id}`);

  const customEase = [0.16, 1, 0.3, 1];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-amber-500 selection:text-white pb-20">
      
      {/* =========================================================================
          SECTION 1: HERO HEADER (IMMERSIVE)
      ========================================================================= */}
      <div className="relative h-[65vh] md:h-[70vh] w-full overflow-hidden bg-gray-900"> 
        <motion.div 
          style={{ y: yRange }} 
          className="absolute inset-0 w-full h-full"
        >
            <img src={config.banner} alt={config.title} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" /> 
        </motion.div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 z-10 pt-24"> 
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: customEase }}
              className="flex items-center gap-2 mb-4 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10"
            >
               <Sparkles className="w-3.5 h-3.5 text-amber-400" />
               <span className="text-amber-400 text-[10px] font-bold tracking-[0.3em] uppercase">The Collection</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: customEase }}
              className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tight drop-shadow-lg"
            >
               {config.title}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: customEase }}
              className="text-gray-300 text-sm md:text-lg font-light tracking-wide max-w-xl"
            >
               {config.subtitle}
            </motion.p>
        </div>

        <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onClick={() => navigate(-1)} 
            className="absolute top-28 left-6 md:left-12 flex items-center gap-3 text-white text-[10px] font-bold uppercase tracking-widest z-20 group hover:text-amber-400 transition-colors"
        >
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all group-hover:border-amber-400/50 group-hover:bg-amber-500/10">
                <ArrowLeft className="w-4 h-4" /> 
            </div>
            <span className="hidden md:block">Go Back</span>
        </motion.button>
      </div>

      {/* =========================================================================
          SECTION 2: STICKY FILTER BAR
      ========================================================================= */}
      <div className="sticky top-[70px] md:top-[80px] z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex overflow-x-auto hide-scrollbar gap-2 w-full md:w-auto pb-2 md:pb-0">
            {config.filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-300 border whitespace-nowrap ${
                  activeFilter === filter 
                    ? "bg-gray-900 text-white border-gray-900 shadow-md" 
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 border-l border-gray-200 pl-6 h-full">
             <div className="relative group flex items-center gap-2 cursor-pointer">
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-gray-900 transition-colors">Sort</span>
                 <select 
                    className="appearance-none bg-transparent text-sm font-bold text-gray-900 focus:outline-none cursor-pointer pr-5 hover:text-amber-600 transition-colors outline-none"
                    onChange={(e) => setSortBy(e.target.value)}
                 >
                    <option>Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                 </select>
                 <ChevronDown className="absolute right-0 w-3.5 h-3.5 text-gray-900 pointer-events-none" strokeWidth={3} />
             </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: PRODUCT GRID
      ========================================================================= */}
      <div className="container mx-auto px-6 py-16 min-h-[60vh]">
        {loading ? (
           <div className="text-center py-32 text-gray-400 flex flex-col items-center">
              <div className="w-12 h-12 border-2 border-gray-100 border-t-amber-500 rounded-full animate-spin mb-6"/>
              <p className="tracking-[0.3em] text-[10px] uppercase font-bold text-gray-500 animate-pulse">Curating Selection...</p>
           </div>
        ) : visibleProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            <AnimatePresence>
            {visibleProducts.map((product, index) => {
              const isComparing = compareList.some(c => c._id === product._id);
              const fullImageUrl = getImageUrl(product.image);

              return (
                <motion.div 
                    key={product._id} 
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05, ease: customEase }}
                    onClick={() => handleProductClick(product._id)}
                    className="group relative cursor-pointer flex flex-col h-full"
                >
                  <div className={`relative aspect-[3/4] bg-[#FAFAFA] rounded-2xl overflow-hidden mb-5 transition-all duration-500 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]
                      ${isComparing ? "ring-2 ring-amber-500 ring-offset-2" : "border border-gray-100"}`}>
                      
                      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                          {product.tag && (
                            <span className="bg-gray-900 text-white text-[9px] font-bold px-3 py-1.5 uppercase tracking-widest rounded shadow-md">
                                {product.tag}
                            </span>
                          )}
                          {product.rating >= 4.5 && (
                            <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[9px] font-bold px-3 py-1.5 uppercase tracking-widest rounded shadow-sm border border-gray-200 flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Top Rated
                            </span>
                          )}
                      </div>

                      <ProductImage src={fullImageUrl} alt={product.name} />

                      <div className="absolute inset-x-2 bottom-2 p-2 translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out bg-white/80 backdrop-blur-md border border-white rounded-xl shadow-lg z-20">
                          <div className="flex gap-2">
                              <button 
                                className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                              >
                                 <Eye className="w-3.5 h-3.5" /> View
                              </button>
                              
                              <button 
                                onClick={(e) => toggleCompare(e, product)}
                                className={`flex-1 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2
                                    ${isComparing 
                                        ? "bg-amber-500 text-white shadow-inner" 
                                        : "bg-white text-gray-900 border border-gray-200 hover:border-gray-900"}`}
                              >
                                 {isComparing ? <Check className="w-3.5 h-3.5" /> : <ArrowRightLeft className="w-3.5 h-3.5" />} 
                                 {isComparing ? "Added" : "Compare"}
                              </button>
                          </div>
                      </div>
                  </div>

                  <div className="px-2 flex-1 flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                          <p className="text-gray-400 text-[9px] font-bold uppercase tracking-[0.2em]">{product.brand || "Luxury Brand"}</p>
                          {product.rating && product.rating < 4.5 && (
                             <div className="flex items-center gap-1 text-gray-500">
                                <Star className="w-3 h-3 fill-gray-300 text-gray-300" />
                                <span className="text-[10px] font-bold">{product.rating}</span>
                             </div>
                          )}
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2 mb-3">
                          {product.name}
                      </h3>
                      <div className="mt-auto flex items-baseline gap-3">
                          <p className="text-lg font-serif font-medium text-gray-900">₹{product.price ? product.price.toLocaleString() : "N/A"}</p>
                          {product.price && <p className="text-xs text-gray-400 line-through decoration-gray-300">₹{(product.price * 1.2).toFixed(0)}</p>}
                      </div>
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Filter className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-2xl font-serif text-gray-900 mb-3">No models found</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-sm font-light">Try adjusting your filters to discover more premium appliances.</p>
              <button onClick={() => setActiveFilter("All")} className="text-[10px] font-bold text-white bg-gray-900 px-6 py-3 rounded-full uppercase tracking-widest hover:bg-amber-600 transition-colors">
                  Clear All Filters
              </button>
          </motion.div>
        )}
      </div>

      {/* =========================================================================
          SECTION 4: COMPARE FLOATING BAR
      ========================================================================= */}
      <AnimatePresence>
      {compareList.length > 0 && (
        <motion.div 
            initial={{ y: 150, opacity: 0, x: "-50%" }}
            animate={{ y: 0, opacity: 1, x: "-50%" }}
            exit={{ y: 150, opacity: 0, x: "-50%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-8 left-1/2 z-50 w-[95%] max-w-3xl"
        >
            <div className="bg-neutral-900/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl p-4 md:pr-6 flex flex-col md:flex-row items-center justify-between text-white gap-4 md:gap-0">
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
                    <div className="pl-2">
                        <p className="text-[9px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-1">Compare Mode</p>
                        <p className="text-xs font-bold tracking-wider">{compareList.length} <span className="font-light text-gray-400">/ 3 Items</span></p>
                    </div>
                    <div className="flex gap-2.5">
                        {compareList.map(item => {
                            const url = getImageUrl(item.image); // 🔥 FIX applied here
                            return (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} key={item._id} className="relative w-12 h-12 bg-white rounded-lg p-1.5 shadow-inner group/item">
                                    <img src={url} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                    <button onClick={(e) => toggleCompare(e, item)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-[3px] opacity-0 group-hover/item:opacity-100 hover:scale-110 transition-all shadow-md"><X className="w-2.5 h-2.5" strokeWidth={3}/></button>
                                </motion.div>
                            );
                        })}
                        {/* Empty Slots */}
                        {[...Array(3 - compareList.length)].map((_, i) => (
                            <div key={i} className="w-12 h-12 border border-dashed border-white/20 rounded-lg flex items-center justify-center bg-white/5">
                                <span className="text-white/20 text-[10px] font-bold">{i + 1 + compareList.length}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-6 w-full md:w-auto justify-end">
                    <button onClick={() => setCompareList([])} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Clear All</button>
                    <button 
                      disabled={compareList.length < 2}
                      onClick={() => navigate('/compare', { state: { products: compareList } })} 
                      className="bg-white text-gray-900 px-6 py-3.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-lg flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Compare <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}