import { useState, useEffect, useRef } from "react";

// Updated data with specific brand colors for the hover effect
const brands = [
  { name: "Bosch", label: "BOSCH", hoverColor: "hover:text-red-600" },
  { name: "Siemens", label: "SIEMENS", hoverColor: "hover:text-teal-600" },
  { name: "Hafele", label: "HÄFELE", hoverColor: "hover:text-red-700" },
  { name: "Smeg", label: "SMEG", hoverColor: "hover:text-neutral-800" },
  { name: "Kaff", label: "KAFF", hoverColor: "hover:text-orange-600" },
  { name: "Electrolux", label: "Electrolux", hoverColor: "hover:text-blue-900" },
  { name: "Faber", label: "FABER", hoverColor: "hover:text-red-600" },
  { name: "Elica", label: "elica", hoverColor: "hover:text-neutral-800" },
  { name: "Carysil", label: "CARYSIL", hoverColor: "hover:text-red-600" },
  { name: "Hindware", label: "hindware", hoverColor: "hover:text-red-600" },
  { name: "Blaupunkt", label: "BLAUPUNKT", hoverColor: "hover:text-blue-600" },
  { name: "Samsung", label: "SAMSUNG", hoverColor: "hover:text-blue-700" },
  { name: "LG", label: "LG", hoverColor: "hover:text-pink-600" },
  { name: "Whirlpool", label: "Whirlpool", hoverColor: "hover:text-yellow-500" },
  { name: "IFB", label: "IFB", hoverColor: "hover:text-red-600" },
  { name: "Miele", label: "Miele", hoverColor: "hover:text-red-700" },
];

export function BrandPartners() {
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  // Triple duplication ensures smooth infinite scroll even on large screens
  const duplicatedBrands = [...brands, ...brands, ...brands];

  useEffect(() => {
    if (!sliderRef.current || !containerRef.current) return;

    const slider = sliderRef.current;
    const container = containerRef.current;
    let animationFrame;
    let position = 0;
    const speed = 0.6; // Slightly faster for a modern feel

    const animate = () => {
      if (!isPaused) {
        position -= speed;

        // Reset logic: seamless loop
        const singleSetWidth = slider.scrollWidth / 3;
        if (Math.abs(position) >= singleSetWidth) {
          position = 0;
        }

        slider.style.transform = `translate3d(${position}px, 0, 0)`;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationRef.current = animationFrame;
    animate();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isPaused]);

  return (
    <div className="relative w-full bg-white border-b border-gray-100">
      
      {/* Optional: A subtle top shadow to separate from Hero Section */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

      <div className="max-w-[1920px] mx-auto px-4 py-10 md:py-14">
        
        {/* Section Header - Minimalist & centered */}
        <div className="text-center mb-10">
          <p className="text-xs md:text-sm font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">
            Trusted by Global Leaders
          </p>
          <h3 className="text-xl md:text-2xl font-light text-gray-900">
            Our Premium <span className="font-semibold">Brand Partners</span>
          </h3>
        </div>

        {/* Slider Area with Fade Masks */}
        <div 
          className="relative w-full overflow-hidden"
          ref={containerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left Fade Mask */}
          <div className="absolute top-0 left-0 h-full w-24 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          
          {/* Right Fade Mask */}
          <div className="absolute top-0 right-0 h-full w-24 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {/* The Track */}
          <div 
            ref={sliderRef} 
            className="flex items-center w-max"
            style={{ willChange: "transform" }}
          >
            {duplicatedBrands.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex-shrink-0 px-8 md:px-12 group cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center space-y-3 transition-all duration-500 hover:-translate-y-1">
                  
                  {/* Logo Simulation */}
                  {/* In a real app, replace this text with <img src={brand.logoUrl} /> */}
                  <span 
                    className={`
                      text-3xl md:text-4xl font-bold tracking-tight 
                      text-gray-300 transition-colors duration-500 
                      ${brand.hoverColor} 
                      font-sans
                    `}
                    style={{ fontFamily: 'Arial, sans-serif' }} // Placeholder for logo font
                  >
                    {brand.label}
                  </span>

                  {/* Optional: Small Dot on Hover */}
                  <div className="h-1 w-1 rounded-full bg-transparent group-hover:bg-gray-800 transition-colors duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}