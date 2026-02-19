import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"; 
import { 
  ArrowLeft, Filter, X, ArrowRight, Check, Eye, Star, 
  ArrowRightLeft, ChevronDown, Sparkles
} from "lucide-react";

// 🔥 CLOUDINARY CONFIG
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dcljdkqer/image/upload/";

// 🔥 AUTOMATION MAP
const SLUG_TO_DB_MAP = {
  "countertop": "small-appliances",
  "washing": "washing",
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

// ✨ Premium Image Component
const ProductImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#FAFAFA]">
      <div className={`absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-700 ${loaded ? 'opacity-0' : 'opacity-100'}`} />
      <img 
        src={src} 
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-contain p-8 transition-all duration-700 ease-out 
          ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} 
          group-hover:scale-110 mix-blend-multiply`}
        onError={(e) => { e.target.src = "https://placehold.co/400x500?text=No+Image" }}
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
        const res = await axios.get(`http://localhost:5000/api/products?category=${dbCategory}`);
        
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

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
      
      {/* =========================================================================
          SECTION 1: HERO HEADER (FIXED: Starts from TOP 0)
      ========================================================================= */}
      
      <div className="relative h-[70vh] w-full overflow-hidden"> 
        {/* ✅ FIXED: Removed mt-[80px] to let image go behind header */}
        
        <motion.div 
          style={{ y: yRange }} // Parallax Effect
          className="absolute inset-0 w-full h-full"
        >
            <img src={config.banner} alt={config.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" /> {/* Dark Overlay for text visibility */}
        </motion.div>

        {/* Text Content (Centered & Padded from Top) */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10 pt-20"> 
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-4"
            >
               <Sparkles className="w-4 h-4 text-[#D4AF37]" />
               <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">The Collection</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-wide drop-shadow-2xl"
            >
               {config.title}
            </motion.h1>

            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-[2px] bg-white/50 mb-6"
            />

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/90 text-sm md:text-lg font-light tracking-wide max-w-xl drop-shadow-md"
            >
               {config.subtitle}
            </motion.p>
        </div>

        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="absolute top-24 left-8 flex items-center gap-3 text-white text-xs uppercase tracking-widest z-20 group hover:opacity-80">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all">
                <ArrowLeft className="w-4 h-4" /> 
            </div>
            <span>Back</span>
        </button>
      </div>

      {/* =========================================================================
          SECTION 2: STICKY FILTER BAR
      ========================================================================= */}
      <div className="sticky top-[80px] z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Filters */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 w-full md:w-auto pb-2 md:pb-0">
            {config.filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 border ${
                  activeFilter === filter 
                    ? "bg-black text-white border-black shadow-lg" 
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-black"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3 border-l border-gray-200 pl-6 h-full">
             <div className="relative group flex items-center gap-2 cursor-pointer">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">Sort</span>
                 <select 
                    className="appearance-none bg-transparent text-sm font-bold text-gray-900 focus:outline-none cursor-pointer pr-4 hover:text-[#D4AF37] transition-colors"
                    onChange={(e) => setSortBy(e.target.value)}
                 >
                    <option>Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                 </select>
                 <ChevronDown className="w-3 h-3 text-black" />
             </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: PRODUCT GRID
      ========================================================================= */}
      <div className="container mx-auto px-6 py-16 pb-40 min-h-[60vh]">
        {loading ? (
           <div className="text-center py-24 text-gray-400 flex flex-col items-center">
              <div className="w-12 h-12 border-2 border-gray-100 border-t-black rounded-full animate-spin mb-4"/>
              <p className="tracking-[0.2em] text-xs uppercase font-medium">Loading Products...</p>
           </div>
        ) : visibleProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
            <AnimatePresence>
            {visibleProducts.map((product, index) => {
              const isComparing = compareList.some(c => c._id === product._id);
              
              let displayImage = product.image;
              if (Array.isArray(displayImage)) {
                  displayImage = displayImage.length > 0 ? displayImage[0] : "";
              }
              const fullImageUrl = displayImage && displayImage.startsWith('http')
                ? displayImage 
                : `${CLOUDINARY_BASE_URL}${displayImage}.jpg`;

              return (
                <motion.div 
                    key={product._id} 
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    onClick={() => handleProductClick(product._id)}
                    className="group relative cursor-pointer"
                >
                  {/* Card Image Container */}
                  <div className={`relative aspect-[3/4] bg-white rounded-xl overflow-hidden mb-5 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2
                      ${isComparing ? "ring-2 ring-[#D4AF37] ring-offset-2" : "border border-gray-100"}`}>
                      
                      {/* Floating Badges */}
                      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                          {product.tag && (
                            <span className="bg-black text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest rounded-md shadow-md">
                                {product.tag}
                            </span>
                          )}
                          {product.rating >= 4.5 && (
                            <span className="bg-white/90 backdrop-blur text-gray-900 text-[9px] font-bold px-3 py-1 uppercase tracking-widest rounded-md shadow-sm border border-gray-200">
                                Top Rated
                            </span>
                          )}
                      </div>

                      {/* Image */}
                      <ProductImage src={fullImageUrl} alt={product.name} />

                      {/* 🔥 HOVER ACTIONS (Side-by-Side Buttons) */}
                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 backdrop-blur-sm border-t border-gray-100">
                          <div className="flex gap-3">
                              <button 
                                className="flex-1 bg-black text-white py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                              >
                                 <Eye className="w-3 h-3" /> View
                              </button>
                              
                              <button 
                                onClick={(e) => toggleCompare(e, product)}
                                className={`flex-1 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-lg border transition-all flex items-center justify-center gap-2
                                    ${isComparing 
                                        ? "bg-[#D4AF37] text-white border-[#D4AF37]" 
                                        : "bg-white text-black border-gray-200 hover:bg-gray-50"}`}
                              >
                                 {isComparing ? <Check className="w-3 h-3" /> : <ArrowRightLeft className="w-3 h-3" />} 
                                 {isComparing ? "Added" : "Compare"}
                              </button>
                          </div>
                      </div>
                  </div>

                  {/* Product Details */}
                  <div className="px-2">
                      <div className="flex justify-between items-center mb-2">
                          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{product.brand}</p>
                          {product.rating >= 4.0 && (
                             <div className="flex items-center gap-1 text-[#D4AF37]">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-xs font-bold text-black">{product.rating}</span>
                             </div>
                          )}
                      </div>
                      <h3 className="text-base font-medium text-gray-900 leading-snug group-hover:text-[#D4AF37] transition-colors line-clamp-2 mb-3 min-h-[44px]">
                          {product.name}
                      </h3>
                      <div className="flex items-baseline gap-3">
                          <p className="text-xl font-serif font-medium text-gray-900">₹{product.price.toLocaleString()}</p>
                          <p className="text-xs text-gray-400 line-through decoration-gray-300">₹{(product.price * 1.2).toFixed(0)}</p>
                      </div>
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-24 text-center flex flex-col items-center justify-center opacity-60">
              <Filter className="w-8 h-8 text-gray-400 mb-4" />
              <h3 className="text-xl font-serif text-gray-900 mb-2">No matching products</h3>
              <button onClick={() => setActiveFilter("All")} className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">
                  Reset Filters
              </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          SECTION 4: COMPARE FLOATING BAR
      ========================================================================= */}
      <AnimatePresence>
      {compareList.length > 0 && (
        <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl"
        >
            <div className="bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4 pr-6 flex items-center justify-between text-white">
                <div className="flex items-center gap-6">
                    <div className="hidden sm:block pl-2">
                        <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-1">Compare Mode</p>
                        <p className="text-sm font-bold">{compareList.length} <span className="font-normal text-gray-400">of 3 items</span></p>
                    </div>
                    <div className="flex gap-3">
                        {compareList.map(item => {
                            let compImg = Array.isArray(item.image) ? item.image[0] : item.image;
                            const url = compImg && compImg.startsWith('http') ? compImg : `${CLOUDINARY_BASE_URL}${compImg}.jpg`;
                            return (
                                <div key={item._id} className="relative w-12 h-12 bg-white rounded-lg p-1 shadow-md">
                                    <img src={url} alt="" className="w-full h-full object-contain" />
                                    <button onClick={(e) => toggleCompare(e, item)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-[3px] hover:scale-110 transition-transform shadow-md"><X className="w-2 h-2" /></button>
                                </div>
                            );
                        })}
                        {/* Empty Slots */}
                        {[...Array(3 - compareList.length)].map((_, i) => (
                            <div key={i} className="w-12 h-12 border border-dashed border-white/20 rounded-lg flex items-center justify-center">
                                <span className="text-white/20 text-xs font-bold">{i + 1 + compareList.length}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => setCompareList([])} className="text-xs font-bold text-gray-400 hover:text-white transition-colors">Clear</button>
                    <button onClick={() => navigate('/compare', { state: { products: compareList } })} className="bg-white text-black px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all shadow-lg flex items-center gap-2 group">
                        Compare <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}