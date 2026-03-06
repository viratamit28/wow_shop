import React, { useState, useEffect } from "react";
import { X, ArrowRight, ArrowLeft, Check, Loader2, Scale, ChevronRight, ImageOff, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import refrigeratorImg from '../assests/r1.jpg';
import hobImg from '../assests/h1.jpg';
import chimneyImg from '../assests/c1.jpg';
import ovenImg from '../assests/o1.jpg';
import dishwasherImg from '../assests/d1.jpg';
import microwaveImg from '../assests/m1.jpg';
import sinkImg from '../assests/s1.jpg';
import washingImg from '../assests/w1.jpg';
import defaultImg from '../assests/dd1.jpg';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dcljdkqer/image/upload/";

const categoryImages = {
  "Refrigerators": refrigeratorImg,
  "Hobs": hobImg, 
  "Chimneys": chimneyImg, 
  "Ovens": ovenImg, 
  "Dishwashers": dishwasherImg, 
  "Microwaves": microwaveImg,
  "Sinks": sinkImg,
  "Washing Machines": washingImg,
  "default": defaultImg
};

const COMPARISON_SCHEMA = [
    {
        section: "Key Information",
        fields: [
            { label: "Brand", key: "brand" },
            { label: "Model Name", key: "name" }, 
            { label: "Appliance Type", key: "type" }, 
            { label: "Color / Finish", key: "color" }, 
        ]
    },
    {
        section: "Specifications",
        fields: [
            { label: "Capacity", key: "capacity" },
            { label: "Material", key: "material" },
            { label: "Control System", key: "controlType" }, 
            { label: "Power Output", key: "power" }, 
            { label: "Noise Level", key: "noiseLevel" },
            { label: "Energy Rating", key: "energyRating" },
        ]
    },
    {
        section: "Features & Support",
        fields: [
            { label: "Special Features", key: "autoFeature" },
            { label: "Connectivity", key: "connectivity" }, 
            { label: "General Warranty", key: "warrantyProduct" },
            { label: "Motor Warranty", key: "warrantyMotor" },
        ]
    }
];

const normalizeCategory = (rawCat) => {
    if (!rawCat) return "Others";
    const lower = rawCat.toLowerCase().trim();
    const mapping = {
        "hob": "Hobs", "hobs": "Hobs", "gas stove": "Hobs", "cooktop": "Hobs",
        "oven": "Ovens", "ovens": "Ovens", "microwave": "Microwaves",
        "refrigerator": "Refrigerators", "refrigerators": "Refrigerators", "fridge": "Refrigerators",
        "chimney": "Chimneys", "chimneys": "Chimneys", "hood": "Chimneys",
        "sink": "Sinks", "sinks": "Sinks",
        "dishwasher": "Dishwashers", "dishwashers": "Dishwashers",
        "washing machine": "Washing Machines", "washing": "Washing Machines"
    };
    return mapping[lower] || (lower.charAt(0).toUpperCase() + lower.slice(1));
};

const getImageUrl = (imgData) => {
    let img = imgData;
    if (Array.isArray(img)) img = img.length > 0 ? img[0] : "";
    if (!img) return null;
    if (img.startsWith('http')) return img;
    const cleanPath = typeof img === 'string' ? img.replace(/\\/g, '/') : '';
    return `${CLOUDINARY_BASE_URL}${cleanPath}`; 
};

const SafeImage = ({ src, alt, className }) => {
    const [error, setError] = useState(false);
    const finalUrl = getImageUrl(src);

    if (error || !finalUrl) {
        return (
            <div className={`bg-gray-50 border border-gray-200 flex flex-col items-center justify-center text-gray-400 rounded-lg ${className}`}>
                <ImageOff className="w-6 h-6 mb-2 opacity-50" />
                <span className="text-[10px] font-medium">No Image</span>
            </div>
        );
    }
    return <img src={finalUrl} alt={alt} className={className} onError={() => setError(true)} />;
};

export default function ComparisonBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [allProducts, setAllProducts] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selection, setSelection] = useState([]); 
  
  // NAYA STATE: Scroll track karne ke liye
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isOpen && allProducts.length === 0) {
      fetchData();
    }
  }, [isOpen, allProducts.length]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/products`);
      if (!res.ok) throw new Error("Failed to connect");
      const data = await res.json();
      
      if (!data || data.length === 0) throw new Error("No Data");

      setAllProducts(data);
      const uniqueCats = [...new Set(data.map(item => normalizeCategory(item.category)))].filter(Boolean);
      setCategories(uniqueCats);
    } catch (err) {
      console.error("Backend Error:", err);
      setAllProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

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
        } else {
            setSelection([selection[0], product]); // Replace second if trying to add a third
        }
    }
  };

  const removeProduct = (productId) => {
      setSelection(selection.filter(p => p._id !== productId));
  };

  const startComparison = () => {
      if (selection.length !== 2) return;
      setLoading(true);
      setTimeout(() => {
          setLoading(false);
          setStep(3);
          setIsScrolled(false); // Reset scroll state when entering step 3
      }, 500); 
  };

  const reset = () => {
      setIsOpen(false);
      setTimeout(() => {
          setStep(1); setSelection([]); setSelectedCategory(null); setIsScrolled(false);
      }, 500);
  };

  const getValue = (product, key) => {
      if (!product) return "N/A";
      if (product[key]) return product[key];
      if (product.specs && product.specs[key]) return product.specs[key];
      return "N/A";
  };

  // NAYA FUNCTION: Scroll handle karne ke liye
  const handleScroll = (e) => {
      if (e.target.scrollTop > 80) {
          setIsScrolled(true);
      } else {
          setIsScrolled(false);
      }
  };

  // =================== STEP 1: CATEGORIES ===================
  const renderCategories = () => (
    <div className="max-w-[1200px] mx-auto pb-10">
        <div className="text-center mb-12 pt-8">
            <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4">What would you like to compare?</h2>
            <p className="text-gray-500">Select an appliance category to begin the comparison process.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => {
                const bgImage = categoryImages[cat] || categoryImages["default"];
                const count = allProducts.filter(p => normalizeCategory(p.category) === cat).length;
                
                return (
                    <button
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className="group flex flex-col items-center bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-900 hover:shadow-lg transition-all duration-300"
                    >
                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 mb-4 relative">
                            <img src={bgImage} alt={cat} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h3 className="text-gray-900 font-bold text-lg mb-1">{cat}</h3>
                        <p className="text-gray-500 text-[11px] uppercase tracking-wider font-medium">{count} Products</p>
                    </button>
                )
            })}
        </div>
    </div>
  );

  // =================== STEP 2: PRODUCT SELECTION ===================
  const renderProductSelection = () => {
    const products = allProducts.filter(p => normalizeCategory(p.category) === selectedCategory);

    return (
        <div className="flex flex-col h-full bg-[#FAFAFA]">
            {/* Top Explicit "Tray" (Super Clear for User) */}
            <div className="bg-white border-b border-gray-200 py-6 px-6 md:px-12 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-1">Select two {selectedCategory.toLowerCase()}</h2>
                        <p className="text-sm text-gray-500">Click on the products below to add them to your comparison tray.</p>
                    </div>

                    {/* The Comparison Tray */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* Slot 1 */}
                        <div className="flex-1 md:w-64 h-20 bg-gray-50 border border-gray-200 rounded-xl flex items-center p-3 relative">
                            {selection[0] ? (
                                <>
                                    <SafeImage src={selection[0].image} className="w-14 h-14 object-contain mr-3 bg-white rounded-lg p-1 border border-gray-100" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold truncate">{selection[0].brand}</p>
                                        <p className="text-xs font-semibold text-gray-900 truncate">{selection[0].name}</p>
                                    </div>
                                    <button onClick={() => removeProduct(selection[0]._id)} className="absolute -top-2 -right-2 bg-white border border-gray-200 text-gray-500 hover:text-red-500 rounded-full p-1 shadow-sm"><X className="w-3 h-3"/></button>
                                </>
                            ) : (
                                <div className="w-full flex items-center justify-center text-gray-400 gap-2 text-xs font-medium border-2 border-dashed border-gray-200 h-full rounded-lg">
                                    <Plus className="w-4 h-4" /> Add Product 1
                                </div>
                            )}
                        </div>

                        <span className="text-gray-300 font-bold hidden md:block">VS</span>

                        {/* Slot 2 */}
                        <div className="flex-1 md:w-64 h-20 bg-gray-50 border border-gray-200 rounded-xl flex items-center p-3 relative">
                            {selection[1] ? (
                                <>
                                    <SafeImage src={selection[1].image} className="w-14 h-14 object-contain mr-3 bg-white rounded-lg p-1 border border-gray-100" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold truncate">{selection[1].brand}</p>
                                        <p className="text-xs font-semibold text-gray-900 truncate">{selection[1].name}</p>
                                    </div>
                                    <button onClick={() => removeProduct(selection[1]._id)} className="absolute -top-2 -right-2 bg-white border border-gray-200 text-gray-500 hover:text-red-500 rounded-full p-1 shadow-sm"><X className="w-3 h-3"/></button>
                                </>
                            ) : (
                                <div className="w-full flex items-center justify-center text-gray-400 gap-2 text-xs font-medium border-2 border-dashed border-gray-200 h-full rounded-lg">
                                    <Plus className="w-4 h-4" /> Add Product 2
                                </div>
                            )}
                        </div>

                        {/* Action Button */}
                        <button 
                            disabled={selection.length !== 2}
                            onClick={startComparison}
                            className={`hidden md:flex px-8 h-20 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all duration-300 items-center justify-center gap-2 ${
                                selection.length === 2 
                                ? "bg-gray-900 text-white hover:bg-amber-600 shadow-md" 
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            Compare Details <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Mobile Action Button */}
                    <button 
                        disabled={selection.length !== 2}
                        onClick={startComparison}
                        className={`md:hidden w-full py-4 mt-2 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all duration-300 flex items-center justify-center gap-2 ${
                            selection.length === 2 
                            ? "bg-gray-900 text-white hover:bg-amber-600 shadow-md" 
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        Compare Details <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto p-6 md:p-12">
                <div className="max-w-[1400px] mx-auto">
                    {products.length === 0 ? (
                        <div className="text-center text-gray-500 py-32 font-medium">No products found.</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                            {products.map((product) => {
                                const isSelected = selection.find(p => p._id === product._id);
                                return (
                                    <div 
                                        key={product._id}
                                        onClick={() => toggleProduct(product)}
                                        className={`cursor-pointer bg-white rounded-xl p-4 flex flex-col transition-all duration-200 border-2 ${
                                            isSelected ? "border-gray-900 shadow-lg relative" : "border-transparent border-gray-100 hover:border-gray-300 hover:shadow-md"
                                        }`}
                                    >
                                        {/* Selection Indicator */}
                                        {isSelected && (
                                            <div className="absolute top-3 left-3 bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center z-10">
                                                <Check className="w-3.5 h-3.5" />
                                            </div>
                                        )}

                                        <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center mb-4 p-4">
                                            <SafeImage src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{product.brand}</p>
                                        <h4 className="text-gray-900 font-semibold text-sm leading-snug line-clamp-2 mb-3 flex-1">{product.name}</h4>
                                        <p className="text-gray-900 font-bold">₹{product.price ? product.price.toLocaleString() : "N/A"}</p>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
  };

  // =================== STEP 3: COMPARISON REPORT ===================
  const renderComparison = () => {
      const [p1, p2] = selection;

      return (
          <div className="max-w-[1000px] mx-auto pb-20 pt-8 bg-white">
              
              {/* NAYA: Sticky Header with Scroll Tracking & Shrink Logic */}
              <div className={`grid grid-cols-2 gap-4 md:gap-8 sticky top-0 z-40 bg-white border-b border-gray-200 shadow-[0_10px_20px_rgba(0,0,0,0.02)] transition-all duration-300 ${isScrolled ? 'py-2' : 'py-6'}`}>
                
                {/* Product 1 Header */}
                <div className="flex flex-col items-center text-center px-2">
                    <div className={`w-full max-w-[200px] flex items-center justify-center transition-all duration-300 ${isScrolled ? 'h-12 md:h-16 mb-1' : 'h-32 md:h-40 mb-4'}`}>
                        <SafeImage src={p1.image} alt={p1.name} className="h-full object-contain mix-blend-multiply" />
                    </div>
                    {!isScrolled && <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1 transition-all">{p1.brand}</p>}
                    <h3 className={`font-bold text-gray-900 transition-all duration-300 ${isScrolled ? 'text-xs md:text-sm line-clamp-1 h-auto mb-1' : 'text-sm md:text-base line-clamp-2 mb-2 h-10 md:h-12'}`}>{p1.name}</h3>
                    <p className={`text-gray-900 font-bold transition-all duration-300 ${isScrolled ? 'text-sm mb-1' : 'text-xl mb-4'}`}>₹{p1.price ? p1.price.toLocaleString() : "N/A"}</p>
                </div>

                {/* Product 2 Header */}
                <div className="flex flex-col items-center text-center px-2 relative border-l border-gray-100">
                    <div className={`absolute bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 font-bold z-10 shadow-sm transition-all duration-300 ${isScrolled ? 'top-1/2 -translate-y-1/2 -left-3 md:-left-4 w-6 h-6 text-[8px]' : 'top-1/3 -left-4 md:-left-5 w-8 h-8 md:w-10 md:h-10 text-[10px] md:text-xs'}`}>
                        VS
                    </div>
                    <div className={`w-full max-w-[200px] flex items-center justify-center transition-all duration-300 ${isScrolled ? 'h-12 md:h-16 mb-1' : 'h-32 md:h-40 mb-4'}`}>
                        <SafeImage src={p2.image} alt={p2.name} className="h-full object-contain mix-blend-multiply" />
                    </div>
                    {!isScrolled && <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1 transition-all">{p2.brand}</p>}
                    <h3 className={`font-bold text-gray-900 transition-all duration-300 ${isScrolled ? 'text-xs md:text-sm line-clamp-1 h-auto mb-1' : 'text-sm md:text-base line-clamp-2 mb-2 h-10 md:h-12'}`}>{p2.name}</h3>
                    <p className={`text-gray-900 font-bold transition-all duration-300 ${isScrolled ? 'text-sm mb-1' : 'text-xl mb-4'}`}>₹{p2.price ? p2.price.toLocaleString() : "N/A"}</p>
                </div>
              </div>

              {/* Data Table (Spreadsheet Style) */}
              <div className="w-full">
                 {COMPARISON_SCHEMA.map((section, idx) => (
                    <div key={idx} className="mb-8">
                        {/* Section Title */}
                        <div className="bg-gray-50 px-4 py-3 border-y border-gray-200 mb-2">
                            <h4 className="font-bold text-gray-900 text-sm">{section.section}</h4>
                        </div>
                        
                        {/* Rows */}
                        <div className="flex flex-col">
                            {section.fields.map((field, fIdx) => {
                                const val1 = getValue(p1, field.key);
                                const val2 = getValue(p2, field.key);
                                const isDifferent = val1 !== val2 && val1 !== "N/A" && val2 !== "N/A";

                                return (
                                    <div key={fIdx} className={`grid grid-cols-2 relative border-b border-gray-100 py-4 ${isDifferent ? "bg-amber-50/40" : ""}`}>
                                        <div className="col-span-2 text-center md:text-left md:absolute md:left-4 md:top-1/2 md:-translate-y-1/2 w-full md:w-48 pb-2 md:pb-0 z-10">
                                            <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500 bg-white/80 md:bg-transparent px-2 md:px-0">
                                                {field.label}
                                            </span>
                                        </div>
                                        <div className="text-center px-4 md:pl-56 border-r border-gray-100">
                                            <span className={`text-sm ${isDifferent ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                {val1 === "N/A" ? <span className="text-gray-300 italic">-</span> : val1}
                                            </span>
                                        </div>
                                        <div className="text-center px-4 md:pr-12">
                                            <span className={`text-sm ${isDifferent ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                {val2 === "N/A" ? <span className="text-gray-300 italic">-</span> : val2}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                 ))}
              </div>

          </div>
      );
  };

  return (
    <>
      {/* TRIGGER BANNER (Main Page View) */}
      <section className="w-full bg-white py-20 md:py-28 relative font-sans border-y border-gray-200 overflow-hidden">
         <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12 bg-gray-50 p-10 md:p-16 rounded-[2rem] relative z-10">
             <div className="max-w-xl text-center md:text-left z-20">
                 <div className="inline-flex items-center gap-2 mb-6 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                     <Scale className="w-4 h-4 text-amber-600" />
                     <span className="text-gray-900 text-[10px] font-bold uppercase tracking-[0.2em]">Product Compare</span>
                 </div>
                 <h2 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-6">
                     Stuck between two models?
                 </h2>
                 <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
                     Use our side-by-side comparison tool to evaluate specifications, dimensions, and features clearly before making your decision.
                 </p>
                 <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold text-xs hover:bg-amber-600 transition-colors shadow-lg flex items-center gap-3 mx-auto md:mx-0"
                 >
                    Compare Products <ArrowRight className="w-4 h-4" />
                 </button>
             </div>
             
             {/* NAYA: Dynamic Visual Graphics Images replacing abstract ones */}
             <div className="flex flex-row items-center justify-center gap-2 md:gap-6 relative w-full max-w-sm z-10 mt-10 md:mt-0">
                 {/* Product 1 */}
                 <div className="w-32 h-40 md:w-44 md:h-56 bg-white border-4 border-white shadow-xl rounded-2xl flex flex-col items-center justify-center overflow-hidden transform -rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 z-10 relative">
                    {/* Yahan tum apne wow_shop ke Cloudinary images ka link direct daal sakte ho test karne ke liye */}
                    <img src={categoryImages["Refrigerators"]} alt="Option A" className="w-full h-full object-cover bg-gray-100" />
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2 md:p-3 pt-8">
                       <p className="text-white text-[8px] md:text-[10px] font-bold tracking-wider">OPTION A</p>
                    </div>
                 </div>
                 
                 {/* VS Badge */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-xs md:text-sm z-30 shadow-lg border-2 md:border-4 border-gray-50">
                     VS
                 </div>
                 
                 {/* Product 2 */}
                 <div className="w-32 h-40 md:w-44 md:h-56 bg-white border-4 border-white shadow-xl rounded-2xl flex flex-col items-center justify-center overflow-hidden transform rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 z-20 mt-8 md:mt-16 relative">
                    <img src={categoryImages["Chimneys"]} alt="Option B" className="w-full h-full object-cover bg-gray-100" />
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2 md:p-3 pt-8">
                       <p className="text-white text-[8px] md:text-[10px] font-bold tracking-wider">OPTION B</p>
                    </div>
                 </div>
             </div>
         </div>
      </section>
      
      {/* FULL SCREEN LIGHT MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col font-sans overflow-hidden"
          >
            {/* Minimal Header */}
            <div className="h-16 md:h-20 border-b border-gray-200 flex items-center justify-between px-4 md:px-8 bg-white shrink-0 z-50">
                <div className="flex items-center gap-4">
                    {step > 1 && (
                        <button onClick={() => setStep(step - 1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    <span className="text-gray-900 font-bold text-lg md:text-xl">Compare</span>
                </div>
                
                {/* Progress Indicator */}
                <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span className={step >= 1 ? "text-gray-900" : ""}>1. Category</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className={step >= 2 ? "text-gray-900" : ""}>2. Products</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className={step === 3 ? "text-gray-900" : ""}>3. Results</span>
                </div>

                <button onClick={reset} className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Scrollable Body - NAYA: yahan onScroll={handleScroll} add kiya hai */}
            <div className="flex-1 overflow-y-auto hide-scrollbar relative" onScroll={handleScroll}>
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Loader2 className="w-10 h-10 text-gray-900 animate-spin mb-4" />
                        <p className="text-gray-500 text-sm font-medium">Preparing comparison...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                            {step === 1 && renderCategories()}
                            {step === 2 && renderProductSelection()}
                            {step === 3 && renderComparison()}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}