import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const brands = [
  { name: "Bosch", logo: "BOSCH", color: "from-red-600 to-red-700" },
  { name: "Siemens", logo: "SIEMENS", color: "from-teal-600 to-teal-700" },
  { name: "Hafele", logo: "HÄFELE", color: "from-gray-700 to-gray-800" },
  { name: "Smeg", logo: "SMEG", color: "from-blue-600 to-blue-700" },
  { name: "Kaff", logo: "KAFF", color: "from-orange-600 to-orange-700" },
  { name: "Electrolux", logo: "ELECTROLUX", color: "from-indigo-600 to-indigo-700" },
  { name: "Faber", logo: "FABER", color: "from-purple-600 to-purple-700" },
  { name: "Elica", logo: "ELICA", color: "from-green-600 to-green-700" },
  { name: "Carasyl", logo: "CARASYL", color: "from-cyan-600 to-cyan-700" },
  { name: "Hindware", logo: "HINDWARE", color: "from-amber-600 to-amber-700" },
  { name: "Blaupunkt", logo: "BLAUPUNKT", color: "from-blue-800 to-blue-900" },
  { name: "Samsung", logo: "SAMSUNG", color: "from-blue-500 to-blue-600" },
  { name: "LG", logo: "LG", color: "from-red-500 to-red-600" },
  { name: "Whirlpool", logo: "WHIRLPOOL", color: "from-green-500 to-green-600" },
  { name: "IFB", logo: "IFB", color: "from-purple-500 to-purple-600" },
  { name: "Miele", logo: "MIELE", color: "from-gray-600 to-gray-700" },
];

export function BrandPartners() {
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  // Duplicate brands for seamless loop
  const duplicatedBrands = [...brands, ...brands, ...brands];

  useEffect(() => {
    if (!sliderRef.current || !containerRef.current) return;

    const slider = sliderRef.current;
    const container = containerRef.current;
    let animationFrame;
    let position = 0;
    const speed = 0.5; // pixels per frame - adjust for speed

    const animate = () => {
      if (!isPaused) {
        position -= speed;
        
        // Reset position when scrolled completely through one set of duplicated brands
        const singleSetWidth = container.scrollWidth / 3;
        if (Math.abs(position) >= singleSetWidth) {
          position = 0;
        }

        slider.style.transform = `translateX(${position}px)`;
      }
      
      animationFrame = requestAnimationFrame(animate);
    };

    animationRef.current = animationFrame;
    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPaused]);

  // Manual navigation functions
  const nextSlide = () => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      const currentTransform = slider.style.transform;
      const currentX = currentTransform ? parseInt(currentTransform.match(/translateX\(([-\d.]+)px\)/)?.[1] || '0') : 0;
      const slideAmount = 200; // Adjust this value based on your card width
      
      slider.style.transition = 'transform 0.5s ease-in-out';
      slider.style.transform = `translateX(${currentX - slideAmount}px)`;
      
      setTimeout(() => {
        slider.style.transition = '';
      }, 500);
    }
  };

  const prevSlide = () => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      const currentTransform = slider.style.transform;
      const currentX = currentTransform ? parseInt(currentTransform.match(/translateX\(([-\d.]+)px\)/)?.[1] || '0') : 0;
      const slideAmount = 200; // Adjust this value based on your card width
      
      slider.style.transition = 'transform 0.5s ease-in-out';
      slider.style.transform = `translateX(${currentX + slideAmount}px)`;
      
      setTimeout(() => {
        slider.style.transition = '';
      }, 500);
    }
  };

  return (
    <section className="py-8 bg-gradient-to-br from-gray-50 to-white overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,teal_1px,transparent_0)] bg-[length:40px_40px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-semibold mb-6 text-gray-900">
            Premium <span className="font-bold bg-gradient-to-r from-orange-600 to-pink-900 bg-clip-text text-transparent">Partner Brands</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Experience world-class German engineering, Italian design, and premium Indian brands — all under one roof
          </p>
        </div>

        {/* Slider Container */}
        <div 
          className="relative mb-12 overflow-visible"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          ref={containerRef}
        >
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 group"
            aria-label="Previous brands"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700 group-hover:text-teal-600 transition-colors" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 group"
            aria-label="Next brands"
          >
            <ChevronRight className="h-6 w-6 text-gray-700 group-hover:text-teal-600 transition-colors" />
          </button>

          {/* Infinite Slider Track */}
          <div className="overflow-visible">
            <div 
              ref={sliderRef}
              className="flex gap-6 w-max"
            >
              {duplicatedBrands.map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className="flex-shrink-0 w-48" // Fixed width for consistent sliding
                >
                  <div className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border-2 border-gray-200 hover:border-teal-300 bg-white rounded-2xl overflow-hidden relative">
                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-blue-500/0 group-hover:from-teal-500/5 group-hover:to-blue-500/5 transition-all duration-300 rounded-2xl" />
                    
                    <div className="p-6 text-center relative z-10">
                      {/* Brand Logo Container */}
                      <div className={`h-20 flex items-center justify-center bg-gradient-to-br ${brand.color} rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300 shadow-lg group-hover:shadow-xl`}>
                        <span className="text-white font-bold tracking-wider text-sm">
                          {brand.logo}
                        </span>
                      </div>
                      
                      {/* Brand Name */}
                      <div className="text-base font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                        {brand.name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* CTA Section */}
        <div className="text-center">
            <a 
              href="#" 
              className="bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg hover:from-orange-600 hover:via-pink-600 hover:to-rose-600 hover:shadow-rose-500/40 transition inline-flex items-center gap-3 group shadow-lg hover:shadow-xl flex-shrink-0"
            >
              Compare All Brands Appliances
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
        </div>
      </div>
    </section>
  );
}