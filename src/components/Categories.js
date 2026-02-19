import React, { useState } from "react";
import { ArrowUpRight, Sparkles, MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Local Images (Ensure paths are correct)
import img1 from '../assests/oven.jpg';
import img3 from '../assests/chemni.jpg';
import img4 from '../assests/refrigarator.jpg';
import img6 from '../assests/countertop.jpg';
import img7 from '../assests/laundry.jpg';

const categoriesData = [
  {
    id: "ovens",
    name: "Built-in Ovens",
    className: "md:col-span-2 md:row-span-2", 
    image: img1,
    subtitle: "The Heart of Baking",
    count: "12 Models"
  },
  {
    id: "hobs",
    name: "Premium Hobs",
    className: "md:col-span-2 md:row-span-1", 
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800", // Optimized width
    subtitle: "Precision Flame Technology",
    count: "8 Models"
  },
  {
    id: "hoods",
    name: "Chimneys",
    className: "md:col-span-1 md:row-span-2", 
    image: img3,
    subtitle: "Silent Suction",
    count: "15 Models"
  },
  {
    id: "refrigerators",
    name: "Refrigerators",
    className: "md:col-span-1 md:row-span-1",
    image: img4,
    subtitle: "Preserve Freshness",
    count: "6 Models"
  },
  {
    id: "dishwashers",
    name: "Dishwashers",
    className: "md:col-span-1 md:row-span-1",
    image: "https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?auto=format&fit=crop&q=80&w=600",
    subtitle: "Hygiene Perfected",
    count: "5 Models"
  },
  {
    id: "countertop", // Fixed ID matching (check your DB/Route)
    name: "Countertop",
    className: "md:col-span-2 md:row-span-1", 
    image: img6,
    subtitle: "Daily Essentials",
    count: "20+ Items"
  },
  {
    id: "washing",
    name: "Washing Machines",
    className: "md:col-span-1 md:row-span-1",
    image: img7,
    subtitle: "Fabric Care",
    count: "4 Models"
  }
];

// 🔥 High-Performance Image Component
const LazyImage = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100">
      {/* 1. Shimmer/Pulse Placeholder */}
      <div 
        className={`absolute inset-0 bg-gray-200 animate-pulse z-10 transition-opacity duration-700 ${loaded ? 'opacity-0' : 'opacity-100'}`} 
      />
      
      {/* 2. Actual Image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async" // Browser ko render block karne se rokta hai
        onLoad={() => setLoaded(true)}
        className={`${className} transition-all duration-1000 ease-out will-change-transform ${
          loaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-sm"
        }`}
      />
    </div>
  );
};

export function Categories() {
  const navigate = useNavigate(); 

  return (
    <section className="py-24 md:py-32 bg-[#F5F5F7] relative font-sans overflow-hidden">
      
      {/* Subtle Grain Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.3] z-0 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        
        {/* === HEADER === */}
        <div className="flex flex-col items-center text-center mb-16">
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/50 border border-gray-200 backdrop-blur-sm"
           >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span className="text-amber-700 text-[10px] font-bold tracking-[0.2em] uppercase">
                 The Curated Edit
              </span>
           </motion.div>
           
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             viewport={{ once: true }}
             className="text-4xl md:text-6xl lg:text-7xl text-gray-900 font-serif font-light leading-tight tracking-tight"
           >
             Our <span className="italic font-serif text-gray-400">Collections</span>
           </motion.h2>
           
           <motion.div 
             initial={{ width: 0 }}
             whileInView={{ width: 80 }}
             transition={{ delay: 0.3, duration: 0.8 }}
             viewport={{ once: true }}
             className="h-[2px] bg-amber-500 mt-6"
           />
        </div>

        {/* === BENTO GRID === */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[280px] md:auto-rows-[320px] gap-3 md:gap-4"> 
          
          {categoriesData.map((cat, index) => (
            <motion.div 
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true, margin: "-50px" }}
              onClick={() => navigate(`/category/${cat.id}`)}
              className={`group relative overflow-hidden rounded-xl cursor-pointer bg-white shadow-sm hover:shadow-2xl transition-shadow duration-500 ${cat.className}`}
            >
              
              {/* Image Layer */}
              <div className="absolute inset-0">
                <LazyImage 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transform transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                />
              </div>
              
              {/* Gradient Overlay (Darker at bottom for text visibility) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-500" />

              {/* Border Effect */}
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-500 rounded-xl z-20 pointer-events-none" />

              {/* Content Layer */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between z-20">
                
                {/* Top Badge */}
                <div className="flex justify-between items-start">
                   <span className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-wider text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0">
                      {cat.count}
                   </span>
                   <div className="bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100">
                      <ArrowUpRight className="w-4 h-4" />
                   </div>
                </div>

                {/* Bottom Text */}
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                   <p className="text-amber-400 text-[10px] tracking-[0.2em] uppercase mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {cat.subtitle}
                   </p>
                   <h3 className="text-2xl text-white font-serif font-light leading-none tracking-wide group-hover:text-white/90 transition-colors">
                     {cat.name}
                   </h3>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* === FOOTER BUTTON === */}
        <div className="flex justify-center mt-16">
           <button 
             onClick={() => navigate('/catalogue')}
             className="group flex items-center gap-3 px-8 py-4 bg-white border border-gray-200 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-gray-900 hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg"
           >
             View Full Catalogue
             <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
           </button>
        </div>

      </div>
    </section>
  );
}