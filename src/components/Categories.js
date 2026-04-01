import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios"; 

// Assets
import img1 from '../assests/oven.jpg';
import img3 from '../assests/chemni.jpg';
import img4 from '../assests/refrigarator.jpg';
import img6 from '../assests/countertop.jpg';
import img7 from '../assests/laundry.jpg';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// 🔥 FIX 1: Naye descriptions add kiye aur dbMatch ko Excel data ke exact format me rakha
const initialCategories = [
  {
    id: "Oven",
    name: "Built-in Ovens",
    image: img1,
    subtitle: "The Heart of Baking",
    dbMatch: "Oven", 
    description: "Experience precision baking and roasting. Includes convection, microwave, and steam variations for professional results.",
    count: 0
  },
  {
    id: "Hob",
    name: "Premium Hobs",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800",
    subtitle: "Precision Flame",
    dbMatch: "Hob",
    description: "Seamlessly integrated gas, induction, and ceramic cooktops designed for maximum heat control and safety.",
    count: 0
  },
  {
    id: "Hood",
    name: "Designer Hoods",
    image: img3,
    subtitle: "Silent Extraction",
    dbMatch: "Hood", // Excel me Chimneys ko 'Hood' likha gaya hai
    description: "Whisper-quiet chimneys and island hoods that eliminate smoke and odor while adding a striking visual centerpiece.",
    count: 0
  },
  {
    id: "Refrigerator",
    name: "Refrigerators",
    image: img4,
    subtitle: "Preserve Freshness",
    dbMatch: "Refrigerator",
    description: "Advanced cooling systems including French doors, built-in freezers, and smart temperature zones for ultimate freshness.",
    count: 0
  },
  {
    id: "Dishwasher", 
    name: "Dishwashers",
    image: img6, // Change this image to a dishwasher image if you have one
    subtitle: "Daily Excellence",
    dbMatch: "Dishwasher", 
    description: "Energy-efficient and silent dishwashing solutions that guarantee sparkling clean glassware and heavy pots alike.",
    count: 0
  },
  {
    id: "Washing", 
    name: "Laundry Care",
    image: img7,
    subtitle: "Fabric Care",
    dbMatch: "Washing", 
    description: "State-of-the-art washing machines and dryers ensuring gentle yet thorough fabric care with smart cycle technology.",
    count: 0
  }
];

// =======================================================================
// NEW EDITORIAL CARD COMPONENT 
// =======================================================================
const EditorialCategoryCard = ({ cat, navigate, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }} 
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer flex flex-col h-full"
      onClick={() => navigate(`/products?category=${cat.id}`)}
    >
      <div className="relative w-full aspect-[4/5] bg-[#F5F5F7] overflow-hidden rounded-xl mb-6 will-change-transform flex-shrink-0">
        
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        <img 
          src={cat.image} 
          alt={cat.name} 
          onLoad={() => setImageLoaded(true)}
          loading="lazy" 
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out z-10">
           <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 whitespace-nowrap">
             Explore Series <ArrowRight className="w-3.5 h-3.5" />
           </div>
        </div>
      </div>

      {/* TYPOGRAPHY BLOCK */}
      <div className="flex flex-col flex-grow pr-2">
         <div className="flex justify-between items-start mb-2">
             <p className="text-amber-600 text-[10px] font-bold tracking-[0.25em] uppercase">
                {cat.subtitle}
             </p>
             <span className="inline-block border border-gray-200 text-gray-500 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-gray-50">
                {cat.count > 0 ? `${cat.count} Items` : "New"}
             </span>
         </div>
         
         <h3 className="text-2xl md:text-3xl text-gray-900 font-serif font-medium tracking-tight group-hover:text-amber-600 transition-colors duration-300 mb-3">
            {cat.name}
         </h3>
         
         {/* 🔥 FIX 2: Naya Description section yahan add kiya jo beautifully render hoga */}
         <p className="text-sm text-gray-500 font-light leading-relaxed line-clamp-3">
            {cat.description}
         </p>
      </div>
    </motion.div>
  );
};

// =======================================================================
// MAIN COMPONENT
// =======================================================================
export function Categories() {
  const navigate = useNavigate(); 
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/products`);
        const allProducts = res.data;
        
        const counts = {};
        allProducts.forEach(product => {
          // 🔥 FIX 3: Naye Database Schema ke hisaab se 'Category' use kiya
          if (product.Category) {
            const catName = product.Category.trim().toLowerCase();
            counts[catName] = (counts[catName] || 0) + 1;
          }
        });

        setCategories(prev => prev.map(cat => ({
          ...cat,
          // Convert dbMatch to lowercase to match the counts object perfectly
          count: counts[cat.dbMatch.toLowerCase()] || 0 
        })));

      } catch (error) {
        console.error("Failed to fetch product counts:", error);
      }
    };

    fetchCategoryCounts();
  }, []);

  return (
    <section className="py-24 md:py-32 bg-white relative font-sans border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
           <div className="max-w-3xl">
               <motion.div 
                 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                 className="flex items-center gap-3 mb-6"
               >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500">
                     Architectural Solutions
                  </span>
               </motion.div>
               <motion.h2 
                 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                 className="text-5xl md:text-6xl lg:text-7xl font-serif text-gray-900 tracking-tight leading-[1.1]"
               >
                 Exquisite <span className="italic font-light text-gray-400">Masterpieces.</span>
               </motion.h2>
           </div>

           <motion.div 
             initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
             className="flex"
           >
             <button 
               onClick={() => navigate('/products')} 
               className="group flex items-center gap-4 px-8 py-4 bg-gray-900 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-amber-600 hover:shadow-xl transition-all duration-300"
             >
               View Full Catalogue
               <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                 <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
               </div>
             </button>
           </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"> 
          {categories.map((cat, index) => (
            <EditorialCategoryCard key={cat.id} cat={cat} navigate={navigate} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}