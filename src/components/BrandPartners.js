import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import { Star, Globe, Award, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Assets
import logo1 from "../assests/Bosch.png";
import logo3 from "../assests/Hafele.png"; 
import logo4 from "../assests/Smeg.png";
import logo5 from "../assests/Blaupunkt.png";
import logo7 from "../assests/Kaff.png";

// 🔥 FIX 1: Production URL
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const brandLogoMap = {
  "bosch": logo1,
  "siemens": "https://download.logo.wine/logo/Siemens/Siemens-Logo.wine.png",
  "hafele": logo3,
  "smeg": logo4,
  "blaupunkt": logo5,
  "kaff": logo7,
  "elica": "https://upload.wikimedia.org/wikipedia/commons/c/c6/Kitchenaid_logo.svg", // Keep your external links if they work well
  "faber": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Faber_Industrie_logo.svg/2560px-Faber_Industrie_logo.svg.png"
};

export function BrandPartners() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandsFromProducts = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/products`);
        const products = res.data;

        // 🔥 FIX: p.brand ki jagah p.Brand (Excel Schema)
        const uniqueBrands = [...new Set(products.map(p => p.Brand).filter(Boolean))];

        const formattedBrands = uniqueBrands.map((brandName, index) => {
            const normalizedName = brandName.toLowerCase().trim();
            return {
                id: index,
                name: brandName,
                slug: normalizedName,
                logo: brandLogoMap[normalizedName] || null, 
            };
        });

        setBrands(formattedBrands);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandsFromProducts();
  }, []);

  // Tripling the array for smooth infinite scroll (CSS 33.33% trick)
  const seamlessBrands = [...brands, ...brands, ...brands];

  if (loading) {
    return (
        <div className="w-full h-[300px] bg-[#FAFAFA] flex flex-col items-center justify-center border-t border-gray-100">
            <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Loading Partners...</span>
        </div>
    );
  }

  if (brands.length === 0) return null; 

  return (
    <section className="relative w-full bg-[#FAFAFA] py-24 md:py-32 overflow-hidden font-sans border-y border-gray-100">
      
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '64px 64px' }} 
      />
    
      <div className="relative z-10 w-full">
        
        {/* HEADER */}
        <div className="text-center mb-16 md:mb-20 px-6">
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
             className="inline-flex items-center gap-2.5 mb-6 bg-white px-5 py-2 rounded-full shadow-sm border border-gray-100"
           >
              <Globe className="w-4 h-4 text-amber-600" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600">Authorized Partners</span>
           </motion.div>
           
           <motion.h3 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
             className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 tracking-tight leading-tight"
           >
              Global <span className="italic text-gray-400 font-light">Excellence.</span>
           </motion.h3>
        </div>

        {/* INFINITE SCROLL MARQUEE */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative w-full group/slider bg-white shadow-[0_0_40px_rgba(0,0,0,0.02)] border-y border-gray-100"
        >
           {/* Fade Edges for smooth entry/exit */}
           <div className="absolute top-0 left-0 h-full w-24 md:w-56 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
           <div className="absolute top-0 right-0 h-full w-24 md:w-56 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

           <div className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused]">
             {seamlessBrands.map((brand, index) => (
               <div 
                 key={`${brand.slug}-${index}`}
                 onClick={() => navigate(`/products?brand=${brand.name}`)}
                 className="group relative w-64 md:w-80 h-40 flex flex-col items-center justify-center border-r border-gray-100 cursor-pointer bg-white hover:bg-[#F9FAFB] transition-colors duration-500"
               >
                  {brand.logo ? (
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="max-w-[140px] max-h-[50px] object-contain filter grayscale opacity-40 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105" 
                      />
                  ) : (
                      <span className="text-2xl font-serif font-bold text-gray-300 group-hover:text-gray-900 transition-colors duration-500">{brand.name}</span>
                  )}
                  
                  {/* Hover Explore Pill */}
                  <div className="absolute bottom-5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                      <span className="text-[9px] uppercase tracking-[0.2em] font-bold">Explore</span>
                      <ArrowRight className="w-3 h-3" />
                  </div>

                  {/* Top Border Highlight */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
               </div>
             ))}
           </div>
        </motion.div>

        {/* TRUST BADGES */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 md:mt-20 flex flex-wrap justify-center items-center gap-8 md:gap-16 px-6"
        >
            <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-default">
                <ShieldCheck className="w-5 h-5 text-gray-800" />
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600">100% Genuine Warranty</span>
            </div>
            <div className="hidden md:block w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-default">
                <Star className="w-5 h-5 text-gray-800" />
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600">Premium Installation</span>
            </div>
            <div className="hidden md:block w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-default">
                <Award className="w-5 h-5 text-gray-800" />
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600">Authorized Dealer</span>
            </div>
        </motion.div>

      </div>

      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.33%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 45s linear infinite;
        }
      `}</style>

    </section>
  );
}