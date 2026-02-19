import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoveLeft, ArrowUp, ArrowRight, Check, Sparkles, ChevronRight } from 'lucide-react'; 
import { motion, AnimatePresence } from "framer-motion";

// Images Import (Images wahi hain)
import Lshaped from '../assests/layouts/L-shaped.jpg';
import Ushaped from '../assests/layouts/U-shaped.jpg';
import Galley from '../assests/layouts/Galley-shaped.jpg';
import OneWall from '../assests/layouts/Onewall-shaped.jpg';
import Penisula from '../assests/layouts/Penisula-shaped.jpg';
import Island from '../assests/layouts/Island-shaped.jpeg';

const layouts = [
  {
    id: 1,
    title: "L-Shaped",
    subtitle: "Corner Efficiency",
    description: "Opens up the floor for dining while keeping appliances within reach. Best for medium-sized families.",
    image: Lshaped,
    stat: "Medium Space",
    tags: ["Family Friendly", "Dining Space"] 
  },
  {
    id: 2,
    title: "U-Shaped",
    subtitle: "The Command Center",
    description: "Surrounds the chef on three sides. The absolute best choice for serious cooking and maximum storage.",
    image: Ushaped,
    stat: "Heavy Use",
    tags: ["Max Storage", "Pro Chef"]
  },
  {
    id: 3,
    title: "Galley",
    subtitle: "Chef's Corridor",
    description: "Modeled after ship kitchens. Two parallel counters ensure zero wasted movement for the efficient cook.",
    image: Galley,
    stat: "Narrow Area",
    tags: ["High Efficiency", "Compact"]
  },
  {
    id: 4,
    title: "One Wall",
    subtitle: "Invisible Luxury",
    description: "All cabinets on a single wall. Perfect for blending into living spaces or studio apartments.",
    image: OneWall,
    stat: "Studio Apt",
    tags: ["Minimalist", "Space Saver"]
  },
  {
    id: 5,
    title: "Peninsula",
    subtitle: "The Divider",
    description: "Acts as a perfect physical barrier between kitchen and dining zones without closing off the space.",
    image: Penisula,
    stat: "Dining Combo",
    tags: ["Social", "Breakfast Bar"]
  },
  {
    id: 6,
    title: "Island",
    subtitle: "The Estate",
    description: "A dedicated zone for prep and entertainment in the center of the room. The symbol of luxury.",
    image: Island,
    stat: "Open Plan",
    tags: ["Luxury", "Entertainment"]
  }
];

export default function KitchenDesign() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(1);
  const activeLayout = layouts.find(l => l.id === activeId) || layouts[0];

  // Auto-rotate logic (Optional: agar user interact na kare toh slide badle)
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //      setActiveId(prev => prev === 6 ? 1 : prev + 1);
  //   }, 5000);
  //   return () => clearInterval(timer);
  // }, []);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Montserrat:wght@200;300;400;500;600&display=swap');
          .font-lux-title { font-family: 'Cinzel', serif; }
          .font-lux-body { font-family: 'Montserrat', sans-serif; }
          /* Custom Scrollbar hide */
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      {/* Main Container */}
      <div className="bg-[#F5F5F7] min-h-screen w-full flex flex-col lg:flex-row overflow-hidden relative font-lux-body text-gray-900">
        
        {/* --- PART 1: LEFT SIDE (Immersive Visuals) --- */}
        <div className="w-full lg:w-[65%] h-[45vh] lg:h-screen relative overflow-hidden bg-gray-900 order-1">
            
            {/* Animated Image Layer (Ken Burns Effect) */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeId}
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }} // Slower transition for luxury feel
                    className="absolute inset-0 w-full h-full"
                >
                    <div className="absolute inset-0 bg-black/20 z-10" /> {/* Slight dark tint */}
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#F5F5F7]" />
                    
                    <motion.img 
                        src={activeLayout.image} 
                        alt={activeLayout.title} 
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.05 }} // Subtle Zoom Effect
                        transition={{ duration: 10, ease: "linear" }}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Floating Glass Card (Details) */}
            <div className="absolute bottom-6 left-6 lg:bottom-16 lg:left-16 z-30 max-w-lg">
                 <div className="relative"> 
                      {/* Big Number Watermark */}
                      <h3 className="text-[8rem] lg:text-[10rem] text-white/10 font-lux-title leading-none absolute -top-24 -left-10 pointer-events-none select-none">
                        0{activeLayout.id}
                      </h3>
                      
                      <AnimatePresence mode='wait'>
                        <motion.div 
                          key={activeId}
                          initial={{ opacity: 0, y: 20 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          transition={{ duration: 0.5, delay: 0.2 }}
                          // Glassmorphism Box
                          className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-lg shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="h-[1px] w-8 bg-[#D4AF37]"></span>
                                <span className="text-[#D4AF37] text-xs uppercase tracking-[0.2em] font-bold">{activeLayout.stat}</span>
                            </div>

                            <h4 className="text-3xl lg:text-5xl text-white font-lux-title mb-3 tracking-wide">
                              {activeLayout.subtitle}
                            </h4>
                            <p className="text-gray-200 font-light text-sm leading-relaxed max-w-sm">
                              {activeLayout.description}
                            </p>

                            {/* Mobile Only Tags */}
                            <div className="flex gap-2 mt-4 lg:hidden">
                                {activeLayout.tags?.map((tag, i) => (
                                    <span key={i} className="text-[10px] bg-white/20 text-white px-2 py-1 rounded-sm">{tag}</span>
                                ))}
                            </div>
                        </motion.div>
                      </AnimatePresence>
                 </div>
            </div>

            {/* Desktop Tags (Floating Bottom Right) */}
            <div className="absolute bottom-10 right-32 z-30 hidden lg:flex flex-col gap-2 items-end">
                {activeLayout.tags?.map((tag, idx) => (
                    <motion.div 
                        key={`${activeId}-${idx}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + (idx * 0.1) }}
                        className="bg-white px-4 py-2 rounded-l-full shadow-lg flex items-center gap-2"
                    >
                        <Check className="w-4 h-4 text-[#D4AF37]" /> 
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-800">{tag}</span>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* --- PART 2: RIGHT SIDE (Interactive Navigation) --- */}
        <div className="w-full lg:w-[35%] h-auto lg:h-screen relative z-20 flex flex-col bg-[#F5F5F7] order-2">
            
            {/* Top Header Section */}
            <div className="px-8 lg:px-12 pt-12 lg:pt-20 pb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />
                    <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">
                        Design Studio
                    </span>
                </div>
                <h1 className="text-4xl lg:text-5xl text-gray-900 font-lux-title leading-tight">
                    Select Your <br/> <span className="italic text-gray-400 font-serif">Layout</span>
                </h1>
                
                {/* Progress Bar */}
                <div className="flex items-center gap-4 mt-8">
                    <span className="text-xs font-bold text-gray-900">0{activeId}</span>
                    <div className="h-[2px] w-full bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-[#D4AF37]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(activeId / 6) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <span className="text-xs font-bold text-gray-400">06</span>
                </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-8 lg:px-12 pb-20 space-y-2">
                {layouts.map((item) => (
                    <div 
                        key={item.id}
                        onMouseEnter={() => setActiveId(item.id)}
                        onClick={() => { setActiveId(item.id); navigate(`/kitchen-layout/${item.id}`); }}
                        className={`group cursor-pointer transition-all duration-300 rounded-xl border border-transparent p-4 flex items-center justify-between ${
                            activeId === item.id 
                            ? 'bg-white shadow-xl shadow-gray-200 border-gray-100 scale-105' 
                            : 'hover:bg-white/50 hover:pl-6'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            {/* Small Image Thumbnail for Active Item */}
                            <div className={`w-12 h-12 rounded-lg overflow-hidden transition-all duration-300 ${activeId === item.id ? 'w-16 h-16' : 'w-0 opacity-0'}`}>
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                            </div>

                            <div>
                                <h2 className={`text-lg font-lux-title transition-colors duration-300 ${
                                    activeId === item.id ? 'text-gray-900 font-bold' : 'text-gray-400 group-hover:text-gray-600'
                                }`}>
                                    {item.title}
                                </h2>
                                {activeId === item.id && (
                                    <motion.p 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-bold mt-1"
                                    >
                                        Explore Design
                                    </motion.p>
                                )}
                            </div>
                        </div>

                        {/* Interactive Arrow */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                            activeId === item.id ? 'bg-[#D4AF37] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                        }`}>
                             <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Bottom Footer Area */}
            <div className="p-6 text-center border-t border-gray-200 lg:bg-white/50 bg-[#F5F5F7]">
                 <p className="text-xs text-gray-400 font-medium">
                    Not sure? <span className="text-[#D4AF37] underline cursor-pointer hover:text-black transition-colors">Take the Kitchen Quiz</span>
                 </p>
            </div>
        </div>

      </div>
    </>
  );
}