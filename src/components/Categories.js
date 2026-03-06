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

// Removed complex grid spans, keeping a uniform editorial size
const initialCategories = [
  {
    id: "Ovens",
    name: "Built-in Ovens",
    image: img1,
    subtitle: "The Heart of Baking",
    dbMatch: "Ovens", 
    count: 0
  },
  {
    id: "Hobs",
    name: "Premium Hobs",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800",
    subtitle: "Precision Flame",
    dbMatch: "Hobs",
    count: 0
  },
  {
    id: "Chimneys",
    name: "Designer Chimneys",
    image: img3,
    subtitle: "Silent Extraction",
    dbMatch: "Chimneys",
    count: 0
  },
  {
    id: "Refrigerators",
    name: "Refrigerators",
    image: img4,
    subtitle: "Preserve Freshness",
    dbMatch: "Refrigerators",
    count: 0
  },
  {
    id: "Countertop", 
    name: "Countertop",
    image: img6,
    subtitle: "Daily Excellence",
    dbMatch: "Countertop", 
    count: 0
  },
  {
    id: "washing", 
    name: "Washing Machines",
    image: img7,
    subtitle: "Fabric Care",
    dbMatch: "washing", 
    count: 0
  }
];

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// =======================================================================
// NEW EDITORIAL CARD COMPONENT (Clean White Space & Typography)
// =======================================================================
const EditorialCategoryCard = ({ cat, navigate, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }} 
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer flex flex-col"
      onClick={() => navigate(`/products?category=${cat.id}`)}
    >
      {/* IMAGE FRAME (Clean, No Dark Overlays) */}
      <div className="relative w-full aspect-[4/5] bg-[#F5F5F7] overflow-hidden rounded-xl mb-6 will-change-transform">
        
        {/* Skeleton Loader */}
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

        {/* Subtle hover overlay for depth */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        
        {/* Quick Explore Action Pill */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out z-10">
           <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2">
             Explore Series <ArrowRight className="w-3.5 h-3.5" />
           </div>
        </div>
      </div>

      {/* TYPOGRAPHY BLOCK (Outside the image for a clean look) */}
      <div className="flex justify-between items-start pr-2">
         <div>
            <p className="text-amber-600 text-[10px] font-bold tracking-[0.25em] uppercase mb-2">
               {cat.subtitle}
            </p>
            <h3 className="text-2xl md:text-3xl text-gray-900 font-serif font-medium tracking-tight group-hover:text-amber-600 transition-colors duration-300">
               {cat.name}
            </h3>
         </div>
         <div className="text-right">
            <span className="inline-block border border-gray-200 text-gray-500 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">
               {cat.count > 0 ? `${cat.count} Items` : "New"}
            </span>
         </div>
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
          if (product.category) {
            const catName = product.category.trim();
            counts[catName] = (counts[catName] || 0) + 1;
          }
        });

        setCategories(prev => prev.map(cat => ({
          ...cat,
          count: counts[cat.dbMatch] || 0 
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
        
        {/* === HEADER: MINIMALIST EDITORIAL === */}
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

        {/* === THE EDITORIAL GRID === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"> 
          {categories.map((cat, index) => (
            <EditorialCategoryCard key={cat.id} cat={cat} navigate={navigate} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}