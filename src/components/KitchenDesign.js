import React from 'react';
import { useNavigate } from 'react-router-dom';
import Lshaped from '../assests/layouts/L-shaped.jpg'
import Ushaped from '../assests/layouts/U-shaped.jpg'
import Galley from '../assests/layouts/Galley-shaped.jpg'
import OneWall from '../assests/layouts/Onewall-shaped.jpg'
import Penisula from '../assests/layouts/Penisula-shaped.jpg'
import Island from '../assests/layouts/Island-shaped.jpeg'

const kitchenLayouts = [
  {
    id: 1,
    name: 'L-Shaped Kitchen',
    fancyName: 'The Corner Masterpiece',
    description: 'Perfect for corner spaces with efficient workflow',
    image: Lshaped
  },
  {
    id: 2,
    name: 'U-Shaped Kitchen',
    fancyName: 'The Ultimate Triangle',
    description: 'Three walls of cabinets providing ample storage',
    image: Ushaped
  },
  {
    id: 3,
    name: 'Galley Kitchen',
    fancyName: 'The Efficient Corridor',
    description: 'Two parallel countertops ideal for narrow spaces',
    image: Galley
  },
  {
    id: 4,
    name: 'One Wall Kitchen',
    fancyName: 'The Sleek Minimalist',
    description: 'All appliances and cabinets on a single wall',
    image: OneWall
  },
  {
    id: 5,
    name: 'Peninsula Kitchen',
    fancyName: 'The Social Connector',
    description: 'Connected countertop extending from wall or cabinetry',
    image: Penisula
  },
  {
    id: 6,
    name: 'Island Kitchen',
    fancyName: 'The Entertainer\'s Dream',
    description: 'Freestanding countertop in the center of the kitchen',
    image: Island
  }
];

function KitchenDesign() {
  const navigate = useNavigate();

  const handleLayoutSelect = (layout) => {
    navigate(`/kitchen-layout/${layout.id}`);
  };

  return (
    <div className="min-h-screen bg-white py-6">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-semibold mb-6">
            Choose Your <span className="font-bold bg-gradient-to-r from-orange-500 to-orange-800 bg-clip-text text-transparent">Kitchen Layout Designs</span>
          </h1>
          {/* <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select from our variety of kitchen layouts to find the perfect design for your space
          </p> */}
        </div>

        {/* Layout Grid - No Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {kitchenLayouts.map((layout) => (
            <div 
              key={layout.id}
              className="group cursor-pointer"
              onClick={() => handleLayoutSelect(layout)}
            >
             {/* Image Container with Hover Effects */}
<div className="relative overflow-hidden mb-4">
  <img
    src={layout.image}
    alt={layout.name}
    className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
  />

  {/* Bottom-right View Design Button */}
  <div className="absolute bottom-4 right-4">
    <button
      type="button"
      className="px-4 py-1.5  bg-orange-500 text-white text-xs font-semibold shadow-md 
                 hover:bg-orange-600 transition-colors duration-300 flex items-center gap-1.5"
    >
      <span>View Design</span>
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>

  {/* Fancy Name Badge */}
  <div className="absolute top-4 left-4">
    <span className="bg-silver/80 backdrop-blur-sm px-3 py-1  text-xs font-bold text-gray-100">
      * {layout.fancyName}
    </span>
  </div>
</div>

              
              {/* Content */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {layout.name}
                </h3>
              
                
                {/* Arrow Indicator */}
                <div className="flex items-center justify-center text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                  <span className="text-sm font-medium">Explore Design</span>
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default KitchenDesign;