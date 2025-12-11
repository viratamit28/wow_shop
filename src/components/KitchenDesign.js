import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react'; 

// Images import same rahenge
import Lshaped from '../assests/layouts/L-shaped.jpg'
import Ushaped from '../assests/layouts/U-shaped.jpg'
import Galley from '../assests/layouts/Galley-shaped.jpg'
import OneWall from '../assests/layouts/Onewall-shaped.jpg'
import Penisula from '../assests/layouts/Penisula-shaped.jpg'
import Island from '../assests/layouts/Island-shaped.jpeg'

const kitchenLayouts = [
  {
    id: 1,
    name: 'L-Shaped',
    fancyName: 'Corner Masterpiece',
    description: 'Efficient workflow tailored for modern corner spaces.',
    image: Lshaped
  },
  {
    id: 2,
    name: 'U-Shaped',
    fancyName: 'The Golden Triangle',
    description: 'Maximum storage and counter space on three walls.',
    image: Ushaped
  },
  {
    id: 3,
    name: 'Galley',
    fancyName: 'Chef\'s Corridor',
    description: 'A professional parallel layout for serious cooks.',
    image: Galley
  },
  {
    id: 4,
    name: 'One Wall',
    fancyName: 'Urban Minimalist',
    description: 'Sleek, linear efficiency for compact luxury.',
    image: OneWall
  },
  {
    id: 5,
    name: 'Peninsula',
    fancyName: 'Social Connector',
    description: 'The perfect blend of dining and preparation space.',
    image: Penisula
  },
  {
    id: 6,
    name: 'Island',
    fancyName: 'Entertainer\'s Dream',
    description: 'A centralized masterpiece for open-plan living.',
    image: Island
  }
];

function KitchenDesign() {
  const navigate = useNavigate();

  const handleLayoutSelect = (layout) => {
    navigate(`/kitchen-layout/${layout.id}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-24 px-4 sm:px-6 lg:px-8 font-sans selection:bg-amber-500 selection:text-black">
      <div className="max-w-[1400px] mx-auto">
        
        {/* === HEADER SECTION === */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/70">World Class Designs</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-serif text-white leading-tight">
            Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700">Kitchens</span>
          </h1>
          <p className="text-white/40 max-w-xl mx-auto text-lg font-light leading-relaxed">
            Discover layouts designed not just for cooking, but for living. Architecture meets culinary art.
          </p>
        </div>

        {/* === LAYOUT GRID === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {kitchenLayouts.map((layout, index) => (
            <div 
              key={layout.id}
              onClick={() => handleLayoutSelect(layout)}
              className="group relative h-[600px] w-full cursor-pointer overflow-hidden rounded-md"
            >
              {/* Background Image with Slow Zoom */}
              <div className="absolute inset-0 bg-gray-900">
                <img
                  src={layout.image}
                  alt={layout.name}
                  className="h-full w-full object-cover opacity-80 transition-transform duration-[1500ms] ease-out group-hover:scale-110 group-hover:opacity-100"
                />
              </div>

              {/* Dark Gradient Overlay (Always visible but changes on hover) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-60" />

              {/* Number Watermark (Background) */}
              <div className="absolute top-4 right-6 text-9xl font-serif text-white/5 font-black z-0 pointer-events-none transition-transform duration-700 group-hover:translate-x-4">
                0{index + 1}
              </div>

              {/* Content Container */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                
                {/* Text Content */}
                <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                  <div className="overflow-hidden mb-2">
                    <span className="text-amber-500 font-bold tracking-widest text-xs uppercase block transform translate-y-full transition-transform duration-500 delay-100 group-hover:translate-y-0">
                      {layout.fancyName}
                    </span>
                  </div>
                  
                  <h3 className="text-4xl font-serif text-white mb-4 leading-none">
                    {layout.name}
                  </h3>
                  
                  {/* Expandable Description */}
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out">
                    <div className="overflow-hidden">
                      <p className="text-gray-300 font-light text-sm leading-relaxed border-l border-amber-500 pl-4 mb-6">
                        {layout.description}
                      </p>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="flex items-center gap-4 text-white group/btn">
                    <div className="h-[1px] w-8 bg-white/30 transition-all duration-300 group-hover/btn:w-16 group-hover/btn:bg-amber-500"></div>
                    <span className="text-xs font-bold uppercase tracking-widest group-hover/btn:text-amber-500 transition-colors">Explore Layout</span>
                    <ArrowRight className="w-4 h-4 transform -translate-x-2 opacity-0 transition-all duration-300 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 text-amber-500" />
                  </div>
                </div>
              </div>

              {/* Glassmorphism Border Effect on Hover */}
              <div className="absolute inset-0 border border-white/0 transition-colors duration-500 group-hover:border-white/10 rounded-md pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default KitchenDesign;