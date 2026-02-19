import React, { useState, useEffect } from "react";
import { 
  X, ChevronRight, ArrowRightLeft, 
  CheckCircle2, Loader2, ChevronLeft, Scale, Info, ImageOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ==================== CONFIGURATION ====================
const API_BASE_URL = "http://localhost:5000/api"; 

// --- 1. RELIABLE CATEGORY IMAGES ---
const categoryImages = {
  "Refrigerators": "https://images.unsplash.com/photo-1571175443880-49e1d58b95da?q=80&w=800&auto=format&fit=crop",
  "Hobs": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop", 
  "Chimneys": "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=800&auto=format&fit=crop", 
  "Ovens": "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=800&auto=format&fit=crop", 
  "Dishwashers": "https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?q=80&w=800&auto=format&fit=crop", 
  "Microwaves": "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?q=80&w=800&auto=format&fit=crop",
  "Sinks": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
  "Washing Machines": "https://images.unsplash.com/photo-1626806749707-e44c82eed727?q=80&w=800&auto=format&fit=crop",
  "default": "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=800&auto=format&fit=crop"
};

// --- HELPER: STANDARD SPECIFICATION SCHEMA ---
const COMPARISON_SCHEMA = [
    {
        section: "General Information",
        fields: [
            { label: "Brand", key: "brand" },
            { label: "Model Name", key: "name" }, 
            { label: "Type", key: "type" }, 
            { label: "Finish / Color", key: "color" }, 
        ]
    },
    {
        section: "Technical Specifications",
        fields: [
            { label: "Capacity / Size", key: "capacity" },
            { label: "Material", key: "material" },
            { label: "Control Type", key: "controlType" }, 
            { label: "Power / Suction", key: "power" }, 
            { label: "Noise Level", key: "noiseLevel" },
            { label: "Energy Rating", key: "energyRating" },
        ]
    },
    {
        section: "Features & Warranty",
        fields: [
            { label: "Auto Clean / Defrost", key: "autoFeature" },
            { label: "Smart Connectivity", key: "connectivity" }, 
            { label: "Product Warranty", key: "warrantyProduct" },
            { label: "Motor Warranty", key: "warrantyMotor" },
        ]
    }
];

// --- HELPER: CATEGORY CLEANER ---
const normalizeCategory = (rawCat) => {
    if (!rawCat) return "Others";
    const lower = rawCat.toLowerCase().trim();
    const mapping = {
        "hob": "Hobs", "hobs": "Hobs", "gas stove": "Hobs",
        "oven": "Ovens", "ovens": "Ovens", "microwave": "Microwaves",
        "refrigerator": "Refrigerators", "refrigerators": "Refrigerators", "fridge": "Refrigerators",
        "chimney": "Chimneys", "chimneys": "Chimneys", "hood": "Chimneys",
        "sink": "Sinks", "sinks": "Sinks",
        "dishwasher": "Dishwashers", "dishwashers": "Dishwashers",
    };
    return mapping[lower] || (lower.charAt(0).toUpperCase() + lower.slice(1));
};

export default function ComparisonBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [allProducts, setAllProducts] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selection, setSelection] = useState([]); 

  // --- FETCH DATA ---
  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      if (!res.ok) throw new Error("Failed to connect");
      const data = await res.json();
      
      if (!data || data.length === 0) throw new Error("No Data");

      setAllProducts(data);
      const uniqueCats = [...new Set(data.map(item => normalizeCategory(item.category)))];
      setCategories(uniqueCats);

    } catch (err) {
      console.error("Backend Error:", err);
      setAllProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleCategorySelect = (cleanCat) => {
    setSelectedCategory(cleanCat);
    setSelection([]); 
    setStep(2);
  };

  const toggleProduct = (product) => {
    const isSelected = selection.find(p => p._id === product._id);
    if (isSelected) {
        setSelection(selection.filter(p => p._id !== product._id));
    } else {
        if (selection.length < 2) {
            setSelection([...selection, product]);
        }
    }
  };

  const startComparison = () => {
      setLoading(true);
      setTimeout(() => {
          setLoading(false);
          setStep(3);
      }, 800); 
  };

  const reset = () => {
      setIsOpen(false);
      setTimeout(() => {
          setStep(1); setSelection([]); setSelectedCategory(null);
      }, 500);
  };

  const getProductsForCategory = () => {
      return allProducts.filter(p => normalizeCategory(p.category) === selectedCategory);
  };

  const getValue = (product, key) => {
      if (!product) return "N/A";
      if (product[key]) return product[key];
      if (product.specs && product.specs[key]) return product.specs[key];
      return "N/A";
  };

  // --- REFINED: SAFE IMAGE COMPONENT ---
  const SafeImage = ({ src, alt, className }) => {
    const [error, setError] = useState(false);
    
    // FIX: Extract single image if an array is passed
    const imgUrl = Array.isArray(src) ? src[0] : src;

    if (error || !imgUrl) {
        return (
            <div className={`bg-gray-100 flex flex-col items-center justify-center text-gray-300 rounded-lg ${className}`}>
                <ImageOff className="w-8 h-8 mb-2" />
                <span className="text-[10px] uppercase tracking-widest">No Image</span>
            </div>
        );
    }

    return (
        <img 
            src={imgUrl} 
            alt={alt} 
            className={className} 
            onError={() => setError(true)} 
        />
    );
  };

  // --- RENDERERS ---

  // STEP 1: CATEGORIES
  const renderCategories = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {categories.map((cat, i) => {
            const bgImage = categoryImages[cat] || categoryImages["default"];
            
            return (
                <motion.button
                    key={cat}
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleCategorySelect(cat)}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-gray-900"
                >
                    <img 
                        src={bgImage} 
                        alt={cat}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-30"
                        onError={(e) => {e.target.src = categoryImages["default"]}} 
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 p-8 text-left">
                        <h3 className="text-white font-serif text-3xl tracking-wide mb-2 group-hover:text-amber-400 transition-colors">{cat}</h3>
                        <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest group-hover:text-white">
                            <span>Explore Models</span> <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                </motion.button>
            )
        })}
    </div>
  );

  // STEP 2: PRODUCT SELECTION (REFINED UI)
  const renderProductSelection = () => {
    const products = getProductsForCategory();

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 sticky top-0 z-20 bg-[#F5F5F7]/95 backdrop-blur-md py-6 border-b border-gray-200">
                <div>
                    <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">Category</p>
                    <h3 className="text-4xl font-serif text-amber-600 font-bold">{selectedCategory}</h3>
                </div>
                <div className="flex flex-col items-end gap-3 mt-4 md:mt-0">
                    <span className="text-gray-900 text-sm font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                        <span className="text-amber-600 text-lg mr-1">{selection.length}</span> / 2 Selected
                    </span>
                    <button 
                        disabled={selection.length !== 2}
                        onClick={startComparison}
                        className={`px-10 py-4 font-bold uppercase tracking-widest text-sm transition-all flex items-center gap-3 rounded-xl shadow-lg ${
                            selection.length === 2 
                            ? "bg-gray-900 text-white hover:bg-amber-600 hover:-translate-y-1" 
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        Start Comparison <ArrowRightLeft className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="text-center text-gray-400 py-32">No products found in this category.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const isSelected = selection.find(p => p._id === product._id);
                        return (
                            <motion.div 
                                key={product._id}
                                onClick={() => toggleProduct(product)}
                                whileHover={{ y: -5 }}
                                className={`relative p-5 cursor-pointer transition-all duration-300 rounded-2xl bg-white flex flex-col group h-full ${
                                    isSelected 
                                    ? "ring-2 ring-amber-500 shadow-xl shadow-amber-500/10 bg-amber-50/10" 
                                    : "border border-gray-100 hover:border-amber-200 hover:shadow-xl"
                                }`}
                            >
                                {/* Selection Checkbox Indicator */}
                                <div className={`absolute top-4 right-4 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors z-10 ${
                                    isSelected ? "bg-amber-500 border-amber-500 text-white shadow-md" : "border-gray-200 text-transparent group-hover:border-amber-300"
                                }`}>
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>

                                {/* Beautiful Image Container */}
                                <div className="h-48 w-full flex items-center justify-center mb-5 p-4 bg-[#F8F8FA] rounded-xl group-hover:bg-amber-50/50 transition-colors">
                                    <SafeImage 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="h-full w-full object-contain mix-blend-multiply transform group-hover:scale-110 transition-transform duration-500" 
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex flex-col flex-1">
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{product.brand || "Brand"}</p>
                                    <h4 className="text-gray-900 font-bold text-base mb-3 leading-snug line-clamp-2">{product.name}</h4>
                                    
                                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                                        <p className="text-gray-900 font-black text-lg">₹{product.price ? product.price.toLocaleString() : "N/A"}</p>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-amber-600' : 'text-gray-400 group-hover:text-amber-600'}`}>
                                            {isSelected ? "Selected" : "Compare"}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    );
  };

  // STEP 3: COMPARISON TABLE
  const renderComparison = () => {
      const [p1, p2] = selection;

      return (
          <div className="max-w-7xl mx-auto pb-20">
              
              <div className="grid grid-cols-2 gap-4 md:gap-8 mb-10 sticky top-0 z-20 bg-[#F5F5F7]/95 backdrop-blur-md py-4 border-b border-gray-200">
                <div className="text-center">
                    <div className="h-32 mb-2 flex items-center justify-center">
                        <SafeImage src={p1.image} alt={p1.name} className="h-full object-contain mix-blend-multiply" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{p1.name}</h3>
                    <p className="text-xl text-amber-700 font-light">₹{p1.price ? p1.price.toLocaleString() : "N/A"}</p>
                </div>
                <div className="text-center relative">
                    <div className="absolute top-1/2 -left-4 md:-left-8 -translate-y-1/2 w-8 h-8 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center text-amber-600 font-black italic text-xs md:text-xl shadow-lg border border-gray-200 z-30">VS</div>
                    <div className="h-32 mb-2 flex items-center justify-center">
                        <SafeImage src={p2.image} alt={p2.name} className="h-full object-contain mix-blend-multiply" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{p2.name}</h3>
                    <p className="text-xl text-amber-700 font-light">₹{p2.price ? p2.price.toLocaleString() : "N/A"}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                 {COMPARISON_SCHEMA.map((section, idx) => (
                    <div key={idx} className="border-b border-gray-100 last:border-0">
                        <div className="bg-gray-100 px-6 py-3 border-y border-gray-200">
                            <h4 className="font-bold text-gray-800 uppercase tracking-widest text-xs flex items-center gap-2">
                                <Info className="w-4 h-4" /> {section.section}
                            </h4>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {section.fields.map((field, fIdx) => {
                                const val1 = getValue(p1, field.key);
                                const val2 = getValue(p2, field.key);
                                const isDifferent = val1 !== val2 && val1 !== "N/A" && val2 !== "N/A";

                                return (
                                    <div key={fIdx} className={`grid grid-cols-3 text-sm group ${isDifferent ? "bg-amber-50/40" : "hover:bg-gray-50"}`}>
                                        <div className="p-4 md:p-6 text-gray-500 font-semibold border-r border-gray-100 flex items-center">
                                            {field.label}
                                        </div>
                                        <div className="p-4 md:p-6 text-gray-900 border-r border-gray-100 flex items-center">
                                            {val1 === "N/A" ? <span className="text-gray-300 italic">N/A</span> : val1}
                                        </div>
                                        <div className="p-4 md:p-6 text-gray-900 flex items-center">
                                            {val2 === "N/A" ? <span className="text-gray-300 italic">N/A</span> : val2}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                 ))}
              </div>

              <div className="mt-12 text-center">
                 <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">* Specifications are based on available data.</p>
                 <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-lg">
                    Request Detailed Quote
                 </button>
              </div>
          </div>
      );
  };

  return (
    <>
      {/* TRIGGER BANNER */}
      <section className="w-full bg-white border-y border-gray-200 py-24 relative overflow-hidden group">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-80 " />
         <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
         
         <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
             <div className="max-w-2xl">
                 <div className="flex items-center gap-3 mb-6">
                     <span className="h-px w-12 bg-amber-600" />
                     <span className="text-amber-600 text-sm font-bold uppercase tracking-[0.3em]">Decision Studio</span>
                 </div>
                 <h2 className="text-5xl md:text-7xl font-serif text-gray-900 leading-none mb-8">
                     Compare.<br/> Decide <span className="text-amber-600 italic">Own.</span>
                 </h2>
                 <p className="text-gray-600 text-xl font-light leading-relaxed mb-10 max-w-lg">
                     Stuck between two masterpieces? Use our studio to compare them side-by-side and make the right choice.
                 </p>
                 <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-gray-900 text-white px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-amber-600 hover:shadow-2xl transition-all duration-300 flex items-center gap-4 rounded-xl"
                 >
                    Open Studio <ArrowRightLeft className="w-5 h-5" />
                 </button>
             </div>
             <div className="hidden md:flex relative w-1/2 justify-end">
                 <Scale className="w-64 h-64 text-gray-200 drop-shadow-lg" strokeWidth={1} />
             </div>
         </div>
      </section>
      
      {/* FULL SCREEN MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-[#F5F5F7] flex flex-col"
          >
            {/* Header */}
            <div className="h-24 border-b border-gray-200 flex items-center justify-between px-10 bg-white shadow-sm shrink-0">
                <div className="flex items-center gap-6">
                    <span className="text-gray-900 font-black text-2xl tracking-tighter">WOW<span className="text-amber-600">STUDIO</span></span>
                    <div className="h-8 w-px bg-gray-200" />
                    <span className="text-gray-400 text-sm uppercase tracking-widest font-medium">
                        {step === 1 ? "Select Category" : step === 2 ? "Select Products" : "Comparison View"}
                    </span>
                </div>
                <button onClick={reset} className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-full transition-all transform hover:rotate-90">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 md:p-16 relative">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[60vh]">
                        <Loader2 className="w-16 h-16 text-amber-600 animate-spin mb-6" />
                        <p className="text-gray-900 text-lg font-medium tracking-wider">Loading Data...</p>
                    </div>
                ) : (
                    <>
                        {step === 1 && renderCategories()}
                        {step === 2 && renderProductSelection()}
                        {step === 3 && renderComparison()}
                    </>
                )}
            </div>

            {/* Footer Navigation */}
            {step > 1 && !loading && (
                <div className="h-20 border-t border-gray-200 bg-white flex items-center px-10 shrink-0">
                    <button onClick={() => setStep(step - 1)} className="text-gray-500 hover:text-gray-900 flex items-center gap-3 text-sm font-bold uppercase tracking-widest transition-colors group">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back
                    </button>
                </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}