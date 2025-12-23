import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoveRight, Layers, Maximize2, Columns, LayoutTemplate, Box } from 'lucide-react'; 

// Images Import
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
    subtitle: "The Corner Suite",
    note: "Maximizes corner efficiency.",
    description: "Ideal for medium-sized families. It opens up the floor for a dining table while keeping appliances within reach.",
    image: Lshaped,
    icon: <LayoutTemplate className="w-5 h-5" />,
    stats: "Ideal for: Medium Families"
  },
  {

    id: 2,
    title: "U-Shaped",
    subtitle: "The Command Center",
    note: "Golden triangle perfection.",
    description: "Surrounds the chef on three sides with continuous countertops. The absolute best choice for serious cooking enthusiasts.",
    image: Ushaped,
    icon: <Maximize2 className="w-5 h-5" />,
    stats: "Ideal for: Heavy Cooking"
  },
  {

    id: 3,
    title: "Galley",
    subtitle: "The Corridor",
    note: "Chef-grade efficiency.",
    description: "Modeled after ship kitchens. Two parallel counters ensure everything is just a step away. Zero wasted movement.",
    image: Galley,
    icon: <Columns className="w-5 h-5" />,
    stats: "Ideal for: Narrow Spaces"
  },
  {

    id: 4,
    title: "One Wall",
    subtitle: "The Minimalist",
    note: "Invisible luxury.",
    description: "All cabinets and appliances on a single wall. Perfect for studios where you want the kitchen to blend into the living room.",
    image: OneWall,
    icon: <Box className="w-5 h-5" />,
    stats: "Ideal for: Studio Apts"
  },
  {
    
    id: 5,
    title: "Peninsula",
    subtitle: "The Divider",
    note: "Social cooking hub.",
    description: "Functions like an island but is attached to one wall. It acts as a perfect physical barrier between kitchen and dining.",
    image: Penisula,
    icon: <Layers className="w-5 h-5" />,
    stats: "Ideal for: Dining Combo"
  },
  {
    id: 6,
    title: "Island",
    subtitle: "The Estate",
    note: "The ultimate centerpiece.",
    description: "Requires a large footprint. It provides a dedicated zone for prep and entertainment in the center of the room.",
    image: Island,
    icon: <Box className="w-5 h-5" />,
    stats: "Ideal for: Open Plans"
  }
];

export default function KitchenDesign() {
  const navigate = useNavigate();

  return (
    <>
      {/* --- STEP 1: LOAD FONTS --- */}
      <style>
        {`
          /* 1. Main Title Font (Royal/Elegant) */
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,500&display=swap');
          
          /* 2. Subtitle & UI Font (Clean/Technical) */
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');
          
          /* 3. Description Body Font (Easy to Read) */
          @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400&display=swap');

          /* 4. Handwritten Note Font */
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500&display=swap');
          
          .font-royal { font-family: 'Cormorant Garamond', serif; }
          .font-tech { font-family: 'Montserrat', sans-serif; }
          .font-body { font-family: 'Lato', sans-serif; }
          .font-script { font-family: 'Caveat', cursive; }
        `}
      </style>

      <div className="bg-[#050505] min-h-screen py-24 px-4 sm:px-8 relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-900/10 blur-[150px] pointer-events-none rounded-full" />

        <div className="max-w-[1600px] mx-auto relative z-10">
          
          {/* Header */}
          <div className="text-center mb-24 space-y-6">
            <span className="text-orange-500 text-xs tracking-[0.3em] uppercase font-tech font-semibold">
                The Layout Collection
            </span>
            <h1 className="text-5xl md:text-8xl text-white font-serif-display italic">
              Design by <span className="font-serif text-transparent bg-clip-text bg-gradient-to-b from-orange-600 to-white/40">Geometry</span>
            </h1>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {layouts.map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => navigate(`/kitchen-layout/${item.id}`)}
                className="group relative cursor-pointer"
              >
                {/* Image Section */}
                <div className="relative h-[550px] w-full overflow-hidden bg-neutral-900 border-t border-white/10 group-hover:border-orange-600/50 transition-colors duration-700">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="h-full w-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.2s] ease-in-out filter grayscale-[30%] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
                  
                  {/* Big Number */}
                  <div className="absolute top-6 right-6 mix-blend-overlay">
                    <span className="text-7xl font-royal text-white/20">0{idx + 1}</span>
                  </div>
                </div>

                {/* Text Section (Typography Mix) */}
                <div className="pt-8 relative px-2">
                    
                    {/* Orange Line Animation */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10 overflow-hidden">
                        <div className="w-full h-full bg-orange-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
                    </div>

                    {/* 1. SUBTITLE (Technical Font) */}
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-orange-500/80 text-[10px] uppercase tracking-[0.2em] font-tech font-bold">
                            {item.subtitle}
                        </p>
                        <div className="text-white/30 group-hover:text-orange-500 transition-colors">{item.icon}</div>
                    </div>

                    {/* 2. MAIN TITLE (Royal Serif Font) */}
                    <h3 className="text-4xl text-white font-royal font-light tracking-wide group-hover:text-orange-500 transition-colors duration-300 mb-4">
                        {item.title}
                    </h3>

                    {/* 3. BODY DESCRIPTION (Clean Sans Font) */}
                    {/* Ye font simple aur clean hai taaki padhne me easy ho */}
                    <p className="text-neutral-400 font-body text-sm leading-6 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                        {item.description}
                    </p>

                    {/* 4. HANDWRITTEN NOTE (Script Font) */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                         <span className="font-script text-xl text-white/60 -rotate-1">
                            "{item.note}"
                         </span>
                         
                         {/* Button */}
                         <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-orange-600 group-hover:border-orange-600 transition-all">
                            <MoveRight className="w-4 h-4 text-white" />
                         </div>
                    </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}