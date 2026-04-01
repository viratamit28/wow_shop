import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoveRight, Layers, ArrowUpRight } from 'lucide-react'; 

// Assets
import Lshaped from '../assests/layouts/L-shaped.jpg';
import Ushaped from '../assests/layouts/U-shaped.jpg';
import Galley from '../assests/layouts/Galley-shaped.jpg';
import OneWall from '../assests/layouts/Onewall-shaped.jpg';
import Penisula from '../assests/layouts/Penisula-shaped.jpg';
import Island from '../assests/layouts/Island-shaped.jpeg';

const layouts = [
  { id: 1, title: "L-Shaped", stat: "Medium Space", tags: ["Family Friendly", "Dining"], image: Lshaped },
  { id: 2, title: "U-Shaped", stat: "Heavy Use", tags: ["Max Storage", "Pro Chef"], image: Ushaped },
  { id: 3, title: "Galley", stat: "Narrow Area", tags: ["Efficiency", "Compact"], image: Galley },
  { id: 4, title: "One Wall", stat: "Studio Apt", tags: ["Minimalist", "Space Saver"], image: OneWall },
  { id: 5, title: "Peninsula", stat: "Dining Combo", tags: ["Social", "Breakfast Bar"], image: Penisula },
  { id: 6, title: "Island", stat: "Open Plan", tags: ["Luxury", "Entertainment"], image: Island }
];

export default function KitchenDesign() {
  const navigate = useNavigate();
  // Default active layout (pehla wala bada dikhega)
  const [activeId, setActiveId] = useState(1);

  // Image Preloader to ensure smooth hover expansion
  useEffect(() => {
    layouts.forEach((layout) => {
      const img = new Image();
      img.src = layout.image;
    });
  }, []);

  // 🔥 SMART CLICK HANDLER (Mobile Users ke liye)
  const handleCardClick = (id) => {
    if (activeId === id) {
      // Agar card pehle se bada hai, tabhi navigate karo
      navigate(`/kitchen-layout/${id}`);
    } else {
      // Agar chhota hai, toh pehle usko bada karo (Expand)
      setActiveId(id);
    }
  };

  return (
    <section className="bg-[#FAFAFA] min-h-screen w-full relative font-sans text-gray-900 py-24 overflow-hidden border-t border-gray-200">
      
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10 flex flex-col h-full">
        
        {/* === HEADER (Clean & Direct) === */}
        <div className="flex flex-col items-center text-center mb-12">
            <div className="flex items-center gap-2 mb-4 bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">
               <Layers className="w-3.5 h-3.5 text-amber-600" />
               <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-600">The Architecture</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-gray-900 tracking-tight mb-6">
              Discover Your <span className="italic font-light text-gray-400">Layout.</span>
            </h2>
            <p className="text-gray-500 font-light max-w-xl text-sm md:text-base">
              Hover over the pillars to explore our master configurations. Click to dive into the exact specifications of your dream kitchen.
            </p>
        </div>

        {/* === THE CENTER OF ATTRACTION: EXPANDING ACCORDION === */}
        <div className="w-full h-[500px] md:h-[600px] flex gap-2 md:gap-4 mt-4">
          {layouts.map((item) => {
            const isActive = activeId === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveId(item.id)}
                onClick={() => handleCardClick(item.id)} // 🔥 Update here
                className={`relative h-full rounded-[2rem] overflow-hidden cursor-pointer transition-[flex,filter] duration-700 ease-out flex-col justify-end
                  ${isActive ? "flex-[5] md:flex-[4] filter-none shadow-2xl" : "flex-[1] md:flex-[0.5] grayscale-[50%] hover:grayscale-0"}
                `}
              >
                {/* Background Image */}
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out ${isActive ? "scale-105" : "scale-100"}`}
                />
                
                {/* Overlay Gradients */}
                <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${isActive ? 'from-black/90 via-black/20 to-transparent opacity-100' : 'from-black/80 to-black/20 opacity-70'}`} />

                {/* INACTIVE STATE CONTENT (Vertical Text) */}
                <div className={`absolute inset-0 flex flex-col items-center justify-end pb-10 transition-opacity duration-300 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <span className="text-white font-bold text-lg mb-6 transform -rotate-90 origin-bottom whitespace-nowrap tracking-widest">
                      {item.title}
                    </span>
                    <span className="text-amber-500 font-serif text-xl">0{item.id}</span>
                </div>

                {/* ACTIVE STATE CONTENT (The Big CTA Reveal) */}
                <div className={`absolute bottom-0 left-0 w-full p-8 md:p-12 transition-all duration-700 delay-100 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                  
                  {/* Keep text constrained so it doesn't wrap weirdly during animation */}
                  <div className="min-w-[250px] md:min-w-[400px]">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="h-[1px] w-10 bg-amber-500" />
                      <span className="text-amber-500 text-[10px] font-bold tracking-[0.3em] uppercase">0{item.id} • {item.stat}</span>
                    </div>
                    
                    <h3 className="text-4xl md:text-5xl text-white font-serif tracking-wide mb-3">
                      {item.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {item.tags.map((tag, i) => (
                        <span key={i} className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* The Strong CTA inside the card */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/kitchen-layout/${item.id}`); }}
                      className="group flex items-center gap-4 bg-white text-gray-900 px-6 py-3.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-amber-500 hover:text-white transition-colors"
                    >
                      Explore Layout
                      <div className="bg-gray-100 group-hover:bg-amber-400 w-6 h-6 rounded-full flex items-center justify-center transition-colors">
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* === GLOBAL BOTTOM CTA === */}
        <div className="mt-16 flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-6 font-light">Still not sure which layout fits your space?</p>
            <button 
              onClick={() => navigate('/quiz')}
              className="group flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Take the Kitchen Quiz
              <MoveRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
        </div>

      </div>
    </section>
  );
}