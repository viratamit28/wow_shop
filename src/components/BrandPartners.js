import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 1. Axios Import
import { Star, Globe, Award, ShieldCheck, Loader2, ArrowRight } from "lucide-react";

// Images Import
import logo1 from "../assests/Bosch.png";
import logo3 from "../assests/Hafele.png"; 
import logo4 from "../assests/Smeg.png";
import logo5 from "../assests/Blaupunkt.png";
import logo7 from "../assests/Kaff.png";

// 2. LOGO MAPPING (Database Name -> Local Image)
// Database me agar brand "Bosch" hai, to wo yahan se logo uthayega
const brandLogoMap = {
  "bosch": logo1,
  "siemens": "https://download.logo.wine/logo/Siemens/Siemens-Logo.wine.png",
  "hafele": logo3,
  "smeg": logo4,
  "blaupunkt": logo5,
  "kaff": logo7,
  "elica": "https://upload.wikimedia.org/wikipedia/commons/c/c6/Kitchenaid_logo.svg", // Fallback example
  "faber": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Faber_Industrie_logo.svg/2560px-Faber_Industrie_logo.svg.png"
};

export function BrandPartners() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==================== 3. FETCH REAL DATA ====================
  useEffect(() => {
    const fetchBrandsFromProducts = async () => {
      try {
        // Saare products mangwao
        const res = await axios.get("http://localhost:5000/api/products");
        const products = res.data;

        // Unique Brands Extract karo
        const uniqueBrands = [...new Set(products.map(p => p.brand))];

        // Format data for UI
        const formattedBrands = uniqueBrands.map((brandName, index) => {
            const normalizedName = brandName.toLowerCase().trim();
            return {
                id: index,
                name: brandName,
                slug: normalizedName, // URL ke liye
                // Map se logo dhundo, nahi to default text dikhao
                logo: brandLogoMap[normalizedName] || null, 
                origin: "Authorized" // You can create a map for origin too if needed
            };
        });

        setBrands(formattedBrands);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setLoading(false);
      }
    };

    fetchBrandsFromProducts();
  }, []);

  // Triple the array for smooth infinite scroll
  const seamlessBrands = [...brands, ...brands, ...brands];

  if (loading) {
    return (
        <div className="w-full h-40 bg-[#F5F5F7] flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
    );
  }

  // Agar koi brand nahi hai DB me
  if (brands.length === 0) return null; 

  return (
    <section className="relative w-full bg-[#F5F5F7] py-24 overflow-hidden border-t border-gray-200 font-luxury-sans">
      
      {/* BACKGROUND TEXTURE */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
      />
    
      <div className="container mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-16">
           <div className="inline-flex items-center gap-3 mb-4 bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100">
              <Globe className="w-3 h-3 text-amber-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Authorized Partners</span>
           </div>
           
           <h3 className="text-3xl md:text-5xl font-luxury-serif text-gray-900 mb-4 tracking-tight">
             Global <span className="italic text-gray-400 font-serif">Excellence</span>
           </h3>
        </div>

        {/* INFINITE SCROLL GALLERY */}
        <div className="relative w-full group/slider">
           
           {/* Fade Masks */}
           <div className="absolute top-0 left-0 h-full w-24 md:w-40 bg-gradient-to-r from-[#F5F5F7] to-transparent z-20 pointer-events-none" />
           <div className="absolute top-0 right-0 h-full w-24 md:w-40 bg-gradient-to-l from-[#F5F5F7] to-transparent z-20 pointer-events-none" />

           {/* Track */}
           <div className="flex w-max animate-infinite-scroll group-hover/slider:pause">
             {seamlessBrands.map((brand, index) => (
               <div 
                 key={`${brand.slug}-${index}`}
                 onClick={() => navigate(`/brand/${brand.name}`)} // Passing real name
                 className="group relative w-72 h-48 flex flex-col items-center justify-center border-r border-gray-200 cursor-pointer bg-transparent hover:bg-white transition-all duration-500"
               >
                  {/* LOGO */}
                  {brand.logo ? (
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="max-w-[140px] max-h-[60px] object-contain 
                                   filter grayscale opacity-60 
                                   transition-all duration-500 
                                   group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110" 
                      />
                  ) : (
                      <span className="text-2xl font-serif font-bold text-gray-400 group-hover:text-black transition-colors">{brand.name}</span>
                  )}
                  
                  {/* Hover Action */}
                  <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 flex items-center gap-2 text-amber-600">
                      <span className="text-[10px] uppercase tracking-widest font-bold">View Products</span>
                      <ArrowRight className="w-3 h-3" />
                  </div>

                  {/* Top Gold Line */}
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
               </div>
             ))}
           </div>
        </div>

        {/* TRUST BADGES */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 border-t border-gray-200 pt-8 opacity-60">
            <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gray-800" />
                <span className="text-xs uppercase tracking-wider text-gray-600">100% Genuine Warranty</span>
            </div>
            <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-gray-800" />
                <span className="text-xs uppercase tracking-wider text-gray-600">Premium Installation</span>
            </div>
            <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gray-800" />
                <span className="text-xs uppercase tracking-wider text-gray-600">Authorized Dealer</span>
            </div>
        </div>

      </div>

      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.33%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
        }
        .pause {
          animation-play-state: paused;
        }
      `}</style>

    </section>
  );
}