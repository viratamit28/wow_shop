import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // 👇 Navigation ke liye

// Brands Data (Logos ke liye URL use kar raha hu placeholder ke liye)
const brands = [
  { name: "Bosch", slug: "bosch", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Bosch-Logo.svg/2560px-Bosch-Logo.svg.png" },
  { name: "Siemens", slug: "siemens", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Siemens_AG_logo.svg/2560px-Siemens_AG_logo.svg.png" },
  { name: "Hafele", slug: "hafele", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/H%C3%A4fele_Logo.svg/1200px-H%C3%A4fele_Logo.svg.png" },
  { name: "Smeg", slug: "smeg", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Smeg_logo.svg/2560px-Smeg_logo.svg.png" },
  { name: "Kaff", slug: "kaff", logo: "https://www.kaff.in/media/logo/stores/1/kaff_logo_1.png" }, // Example URL
  { name: "Faber", slug: "faber", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Faber_S.p.A._logo.svg/1200px-Faber_S.p.A._logo.svg.png" },
  { name: "Elica", slug: "elica", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Elica_Logo.svg/2560px-Elica_Logo.svg.png" },
  { name: "Whirlpool", slug: "whirlpool", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Whirlpool_Corporation_Logo.svg/2560px-Whirlpool_Corporation_Logo.svg.png" },
  // ... aur add kar sakte ho
];

export function BrandPartners() {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef(null);
  
  // Duplicated for infinite scroll
  const duplicatedBrands = [...brands, ...brands, ...brands];

  // Animation Logic (Same as before)
  useEffect(() => {
    const slider = sliderRef.current;
    let animationFrame;
    let position = 0;
    const speed = 0.8;

    const animate = () => {
      if (!isPaused && slider) {
        position -= speed;
        const singleSetWidth = slider.scrollWidth / 3;
        if (Math.abs(position) >= singleSetWidth) position = 0;
        slider.style.transform = `translate3d(${position}px, 0, 0)`;
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused]);

  return (
    <div className="relative w-full bg-white border-b border-gray-100 py-10 overflow-hidden">
      <div className="text-center mb-12">
        <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">Global Partners</p>
        <h3 className="text-2xl font-serif text-gray-900">Premium Brands We Trust</h3>
      </div>

      <div 
        className="relative w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div ref={sliderRef} className="flex items-center w-max">
          {duplicatedBrands.map((brand, index) => (
            <div
              key={`${brand.slug}-${index}`}
              onClick={() => navigate(`/brand/${brand.slug}`)} // 👈 Click Event
              className="flex-shrink-0 px-10 md:px-16 cursor-pointer group grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100 transform hover:scale-110"
            >
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="h-8 md:h-12 object-contain" // Height control for uniformity
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}