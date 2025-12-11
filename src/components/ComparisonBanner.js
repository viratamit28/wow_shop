import React, { useState } from "react";
import { X, ChevronRight, Check, ShoppingCart, Star, ArrowRightLeft } from "lucide-react";

// ==================== KITCHEN APPLIANCE DATABASE (Tumhare Project ke hisaab se) ====================
const productDatabase = {
  Refrigerators: {
    icon: "❄️",
    specs: ["Capacity", "Energy Rating", "Cooling Tech", "Compressor", "Warranty"],
    brands: {
      Samsung: {
        name: "Samsung French Door 650L",
        image: "https://images.samsung.com/is/image/samsung/p6pim/in/rs76cg8003s9hl/gallery/in-side-by-side-refrigerator-rs76cg8003s9hl-front-silver-537463567?$684_547_PNG$",
        price: 85990,
        rating: 4.8,
        data: {
          Capacity: "650 Litres",
          "Energy Rating": "5 Star AI Mode",
          "Cooling Tech": "Twin Cooling Plus",
          Compressor: "Digital Inverter",
          Warranty: "20 Years (Compressor)"
        }
      },
      LG: {
        name: "LG InstaView Door-in-Door",
        image: "https://www.lg.com/in/images/refrigerators/md07542358/gallery/GC-X257CQES-Refrigerators-Front-View-DZ-01.jpg",
        price: 154990,
        rating: 4.9,
        data: {
          Capacity: "674 Litres",
          "Energy Rating": "4 Star",
          "Cooling Tech": "DoorCooling+™",
          Compressor: "Smart Inverter",
          Warranty: "10 Years (Compressor)"
        }
      }
    }
  },
  Hob: {
    icon: "🔥",
    specs: ["Burners", "Material", "Ignition Type", "Dimensions", "Warranty"],
    brands: {
      Elica: {
        name: "Elica 4 Burner Glass Hob",
        image: "https://m.media-amazon.com/images/I/61k2Xq4sJEL._SX679_.jpg",
        price: 12999,
        rating: 4.6,
        data: {
          Burners: "4 Brass Burners",
          Material: "Premium Black Glass",
          "Ignition Type": "Auto Ignition",
          Dimensions: "70cm x 52cm",
          Warranty: "5 Years on Glass"
        }
      },
      Faber: {
        name: "Faber 3 Brass Burner",
        image: "https://m.media-amazon.com/images/I/61+y5y-wLdL._SX679_.jpg",
        price: 8990,
        rating: 4.5,
        data: {
          Burners: "3 Heavy Brass",
          Material: "Toughened Glass",
          "Ignition Type": "Manual/Auto Hybrid",
          Dimensions: "65cm x 50cm",
          Warranty: "2 Years Comprehensive"
        }
      }
    }
  },
  Chimney: {
    icon: "💨",
    specs: ["Suction Power", "Filter Type", "Control", "Auto Clean", "Size"],
    brands: {
      Faber: {
        name: "Faber Hood Zenith",
        image: "https://m.media-amazon.com/images/I/61N+x+u+w+L._SX679_.jpg",
        price: 18990,
        rating: 4.7,
        data: {
          "Suction Power": "1350 m³/hr",
          "Filter Type": "Filterless Technology",
          Control: "Touch + Gesture",
          "Auto Clean": "Thermal Auto Clean",
          Size: "90 cm"
        }
      },
      Hindware: {
        name: "Hindware Nadia",
        image: "https://m.media-amazon.com/images/I/51w+z+s+u+L._SX679_.jpg",
        price: 11500,
        rating: 4.4,
        data: {
          "Suction Power": "1200 m³/hr",
          "Filter Type": "Baffle Filter",
          Control: "Touch Control",
          "Auto Clean": "Heating Auto Clean",
          Size: "60 cm"
        }
      }
    }
  },
  Oven: {
    icon: "🥘",
    specs: ["Capacity", "Type", "Cavity", "Modes", "Features"],
    brands: {
      Samsung: {
        name: "Samsung Slim Fry Oven",
        image: "https://images.samsung.com/is/image/samsung/in-microwave-oven-convection-mc28h5025vk-mc28h5025vk-tl-frontblack-228337583?$650_519_PNG$",
        price: 16500,
        rating: 4.7,
        data: {
          Capacity: "28 Litres",
          Type: "Convection",
          Cavity: "Ceramic Enamel",
          Modes: "Slim Fry, Baking, Grilling",
          Features: "Tandoor Tech"
        }
      },
      LG: {
        name: "LG Charcoal Convection",
        image: "https://www.lg.com/in/images/microwave-ovens/md07546681/gallery/MJEN326PK-Microwave-ovens-Front-View-DZ-01.jpg",
        price: 22990,
        rating: 4.8,
        data: {
          Capacity: "32 Litres",
          Type: "Charcoal Convection",
          Cavity: "Stainless Steel",
          Modes: "360° Rotisserie",
          Features: "Diet Fry, Pasteurize Milk"
        }
      }
    }
  }
};

export default function ComparisonBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Category, 2: Brand 1, 3: Brand 2, 4: Result
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [brand1, setBrand1] = useState(null);
  const [brand2, setBrand2] = useState(null);

  const resetFlow = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep(1);
      setSelectedCategory(null);
      setBrand1(null);
      setBrand2(null);
    }, 300);
  };

  // ==================== RENDER STEP 1: CHOOSE CATEGORY ====================
  const renderCategories = () => (
    <div className="grid grid-cols-2 gap-4">
      {Object.keys(productDatabase).map((cat) => (
        <button
          key={cat}
          onClick={() => { setSelectedCategory(cat); setStep(2); }}
          className="p-6 bg-neutral-800 border border-white/10 rounded-xl hover:border-amber-500 hover:bg-neutral-700 transition flex flex-col items-center gap-3 group"
        >
          <div className="w-14 h-14 rounded-full bg-neutral-900 flex items-center justify-center text-3xl group-hover:scale-110 transition shadow-inner">
             {productDatabase[cat].icon}
          </div>
          <span className="text-white font-bold text-lg tracking-wide">{cat}</span>
        </button>
      ))}
    </div>
  );

  // ==================== RENDER STEP 2 & 3: CHOOSE BRANDS ====================
  const renderBrands = (isSecondBrand = false) => {
    const brands = productDatabase[selectedCategory].brands;
    const existingSelection = isSecondBrand ? brand1 : null;

    return (
      <div className="flex flex-col gap-3">
        <h4 className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">
            {isSecondBrand ? `Compare ${brand1} with...` : "Select First Brand"}
        </h4>
        {Object.keys(brands).map((brandKey) => (
          <button
            key={brandKey}
            disabled={brandKey === existingSelection}
            onClick={() => {
              if (isSecondBrand) {
                setBrand2(brandKey);
                setStep(4);
              } else {
                setBrand1(brandKey);
                setStep(3);
              }
            }}
            className={`p-4 rounded-lg border flex items-center justify-between transition ${
              brandKey === existingSelection 
                ? "bg-neutral-900 border-white/5 opacity-50 cursor-not-allowed" 
                : "bg-neutral-800 border-white/10 hover:border-amber-500 hover:bg-neutral-700"
            }`}
          >
            <div className="flex items-center gap-3">
                <img src={brands[brandKey].image} alt="" className="w-10 h-10 object-contain rounded bg-white p-1" />
                <span className="text-white font-medium text-lg">{brandKey}</span>
            </div>
            {brandKey !== existingSelection && <ChevronRight className="text-gray-500" />}
          </button>
        ))}
      </div>
    );
  };

  // ==================== RENDER STEP 4: FINAL COMPARISON TABLE ====================
  const renderComparisonTable = () => {
    const categoryData = productDatabase[selectedCategory];
    const b1Data = categoryData.brands[brand1];
    const b2Data = categoryData.brands[brand2];

    return (
      <div className="animate-fade-in pb-4">
        {/* Comparison Header */}
        <div className="flex justify-between items-center gap-2 mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
           <div className="text-center w-[45%]">
              <h3 className="text-white font-bold text-lg truncate">{brand1}</h3>
           </div>
           <div className="bg-amber-500 text-black font-black rounded-full w-8 h-8 flex items-center justify-center text-xs shrink-0 z-10 shadow-lg glow-amber">VS</div>
           <div className="text-center w-[45%]">
              <h3 className="text-white font-bold text-lg truncate">{brand2}</h3>
           </div>
        </div>

        {/* Product Images & Add Buttons */}
        <div className="flex gap-4 mb-8">
           {/* Product 1 */}
           <div className="w-1/2 flex flex-col gap-3">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 h-40 flex items-center justify-center">
                 <img src={b1Data.image} alt={brand1} className="w-full h-full object-contain" />
              </div>
              <div className="px-1">
                 <h4 className="text-white text-xs font-medium h-8 line-clamp-2 mb-1">{b1Data.name}</h4>
                 <p className="text-amber-500 font-bold text-lg">₹{b1Data.price.toLocaleString()}</p>
                 <button className="mt-2 w-full bg-white text-black hover:bg-amber-500 hover:text-black font-bold py-2 rounded text-[10px] uppercase tracking-wider transition flex items-center justify-center gap-2">
                    <ShoppingCart className="w-3 h-3" /> Add to Cart
                 </button>
              </div>
           </div>

           {/* Product 2 */}
           <div className="w-1/2 flex flex-col gap-3">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 h-40 flex items-center justify-center">
                 <img src={b2Data.image} alt={brand2} className="w-full h-full object-contain" />
              </div>
              <div className="px-1">
                 <h4 className="text-white text-xs font-medium h-8 line-clamp-2 mb-1">{b2Data.name}</h4>
                 <p className="text-amber-500 font-bold text-lg">₹{b2Data.price.toLocaleString()}</p>
                 <button className="mt-2 w-full bg-white text-black hover:bg-amber-500 hover:text-black font-bold py-2 rounded text-[10px] uppercase tracking-wider transition flex items-center justify-center gap-2">
                    <ShoppingCart className="w-3 h-3" /> Add to Cart
                 </button>
              </div>
           </div>
        </div>

        {/* Specification Table */}
        <div className="bg-neutral-900 rounded-xl overflow-hidden border border-white/10">
           <div className="bg-black/40 p-3 border-b border-white/10">
              <h4 className="text-amber-500 text-xs font-bold uppercase tracking-widest">Technical Specifications</h4>
           </div>
           {categoryData.specs.map((spec, index) => (
             <div key={spec} className={`flex text-sm border-b border-white/5 last:border-0 ${index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`}>
                <div className="w-1/3 p-3 text-gray-400 text-xs font-bold uppercase flex items-center border-r border-white/5">{spec}</div>
                <div className="w-1/3 p-3 text-white border-r border-white/5 font-medium text-xs leading-relaxed">{b1Data.data[spec]}</div>
                <div className="w-1/3 p-3 text-white font-medium text-xs leading-relaxed">{b2Data.data[spec]}</div>
             </div>
           ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ==================== THE PREMIUM BANNER (Click Entry) ==================== */}
      <div 
        onClick={() => setIsOpen(true)}
        className="cursor-pointer relative w-full h-56 md:h-72  overflow-hidden group shadow-2xl border border-white/10 hover:border-amber-500/50 transition-all duration-500 my-12"
      >
        {/* Dark Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-900"></div>
        
        {/* Animated Mesh Grid */}
        <div className="absolute inset-0 opacity-20" 
             style={{backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex items-center justify-between px-10 md:px-20">
           
           {/* Text Content */}
           <div className="z-10 max-w-xl space-y-4">
              <div className="flex items-center gap-3">
                 <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">New Feature</span>
                 <span className="text-gray-400 text-xs uppercase tracking-widest font-bold">Smart Comparison Tool</span>
              </div>
              
              <h2 className="text-3xl md:text-6xl font-serif text-white leading-tight">
                 Confused? <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">Compare & Decide.</span>
              </h2>
              
              <div className="flex items-center gap-4 pt-2">
                 <button className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all transform group-hover:translate-x-2">
                    Start Comparing Now
                 </button>
                 <div className="hidden md:flex -space-x-2">
                    {/* Tiny Brand Logos for Trust */}
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border-2 border-black z-30"><span className="text-black text-[8px] font-bold">LG</span></div>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border-2 border-black z-20"><span className="text-black text-[8px] font-bold">Sam</span></div>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border-2 border-black z-10"><span className="text-black text-[8px] font-bold">Fab</span></div>
                 </div>
              </div>
           </div>
           
           {/* Visual Graphic (Right Side) */}
           <div className="hidden md:flex relative items-center gap-8 opacity-80 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-105">
              {/* Floating Card 1 */}
              <div className="w-32 h-40 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-2 transform rotate-[-12deg] shadow-2xl">
                 <div className="w-full h-24 bg-black/50 rounded-lg mb-2 overflow-hidden">
                    <img src={productDatabase.Refrigerators.brands.Samsung.image} className="w-full h-full object-contain" alt="" />
                 </div>
                 <div className="h-2 w-16 bg-white/20 rounded mb-1"></div>
                 <div className="h-2 w-10 bg-amber-500/50 rounded"></div>
              </div>

              {/* VS Badge */}
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.6)] z-20 animate-pulse-slow">
                 <ArrowRightLeft className="text-black w-8 h-8" />
              </div>

              {/* Floating Card 2 */}
              <div className="w-32 h-40 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-2 transform rotate-[12deg] shadow-2xl">
                 <div className="w-full h-24 bg-black/50 rounded-lg mb-2 overflow-hidden">
                    <img src={productDatabase.Refrigerators.brands.LG.image} className="w-full h-full object-contain" alt="" />
                 </div>
                 <div className="h-2 w-16 bg-white/20 rounded mb-1"></div>
                 <div className="h-2 w-10 bg-amber-500/50 rounded"></div>
              </div>
           </div>
        </div>
      </div>

      {/* ==================== THE MODAL (Comparison Logic) ==================== */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-neutral-950 w-full max-w-2xl max-h-[90vh] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-neutral-900 to-neutral-950">
               <div>
                  <h3 className="text-white font-serif text-2xl tracking-wide">
                    {step === 1 && "Choose Category"}
                    {step === 2 && "Select Brand 1"}
                    {step === 3 && "Select Brand 2"}
                    {step === 4 && "Comparison Result"}
                  </h3>
                  <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mt-1">Step {step} of 4</p>
               </div>
               <button onClick={resetFlow} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white text-gray-400 hover:text-black flex items-center justify-center transition"><X /></button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-neutral-950">
               {step === 1 && renderCategories()}
               {step === 2 && renderBrands(false)}
               {step === 3 && renderBrands(true)}
               {step === 4 && renderComparisonTable()}
            </div>

            {/* Modal Footer */}
            {step < 4 && (
               <div className="p-6 bg-neutral-900 border-t border-white/10 flex justify-between items-center">
                  <button 
                    onClick={() => step > 1 ? setStep(step - 1) : resetFlow()}
                    className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-white transition"
                  >
                    {step === 1 ? "Cancel" : "← Back"}
                  </button>
                  <div className="flex gap-1">
                     {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i <= step ? "w-8 bg-amber-500" : "w-2 bg-white/10"}`}></div>
                     ))}
                  </div>
               </div>
            )}
            {step === 4 && (
               <div className="p-6 bg-neutral-900 border-t border-white/10 flex gap-4">
                  <button onClick={() => { setStep(1); setBrand1(null); setBrand2(null); }} className="flex-1 py-4 border border-white/20 rounded-xl text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition">
                     Compare More
                  </button>
                  <button onClick={resetFlow} className="flex-1 py-4 bg-amber-500 text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-400 shadow-lg transition">
                     Close
                  </button>
               </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}