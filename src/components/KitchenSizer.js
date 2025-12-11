import React, { useState } from "react";
import { Ruler, Check, ArrowRight, Sparkles, ChevronRight, RefreshCcw } from "lucide-react";

// ==================== DATA CONFIGURATION ====================

// 1. LAYOUTS (Linked to Real Background Images)
const layoutOptions = [
  { 
    id: 'l-shaped', 
    name: "L-Shaped", 
    icon: "L", 
    bgImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80" 
  },
  { 
    id: 'u-shaped', 
    name: "U-Shaped", 
    icon: "U", 
    bgImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80" 
  },
  { 
    id: 'parallel', 
    name: "Parallel", 
    icon: "||", 
    bgImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80" 
  },
  { 
    id: 'island', 
    name: "Island", 
    icon: "□", 
    bgImage: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&q=80" 
  },
];

// 2. SIZES
const sizeOptions = [
  { id: 'compact', label: "Compact", area: "60-90 sq.ft", desc: "Studio / 1BHK" },
  { id: 'standard', label: "Standard", area: "90-150 sq.ft", desc: "2BHK / 3BHK" },
  { id: 'grand', label: "Grand", area: "150+ sq.ft", desc: "Luxury Villa" },
];

// 3. RECOMMENDATIONS (Logic)
const recommendations = {
  compact: [
    { name: "2-Burner Hob", image: "https://m.media-amazon.com/images/I/61k2Xq4sJEL._SX679_.jpg", price: "₹12,000" },
    { name: "60cm Slim Chimney", image: "https://cdn.shopify.com/s/files/1/0932/4816/0107/files/BASE-BF-60-BLK-4.webp?v=1758783107", price: "₹15,000" },
    { name: "Solo Microwave", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_0NNCrSNnlITAX8xJj1wnARsfwpNaUEEXpg&s", price: "₹8,000" }
  ],
  standard: [
    { name: "3-Burner Hob", image: "https://m.media-amazon.com/images/I/61+y5y-wLdL._SX679_.jpg", price: "₹18,000" },
    { name: "Auto-Clean Chimney", image: "https://m.media-amazon.com/images/I/61N+x+u+w+L._SX679_.jpg", price: "₹22,000" },
    { name: "Built-in Oven", image: "https://media.croma.com/image/upload/v1708669460/Croma%20Assets/Large%20Appliances/Microwave%20Oven/Images/214300_0_s7g6yq.png", price: "₹35,000" },
    { name: "Dishwasher", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8YyffXyCMh8Jv03toAJyyYp6tNBqP8LFFng&s", price: "₹40,000" }
  ],
  grand: [
    { name: "5-Burner Island Hob", image: "https://dzrf1tezfwb3j.cloudfront.net/uploads/images/AImages/14625/dynamic_gr366-2019-08-28-01-32-36.png", price: "₹45,000" },
    { name: "Island Chimney", image: "https://m.media-amazon.com/images/I/61N+x+u+w+L._SX679_.jpg", price: "₹55,000" },
    { name: "Combi-Oven", image: "https://m.media-amazon.com/images/I/61ai3dnm5AL.jpg", price: "₹65,000" },
    { name: "French Door Fridge", image: "https://images.samsung.com/is/image/samsung/p6pim/in/rs78cg8543s9hl/energylabel/in-energylabel-product-rs78cg8543s9hl-549428104", price: "₹1,20,000" }
  ]
};

export function KitchenSizer() {
  const [step, setStep] = useState(1);
  const [selectedLayout, setSelectedLayout] = useState(layoutOptions[0]); // Default to first
  const [selectedSize, setSelectedSize] = useState(null);

  // Background Image Logic
  const currentBg = selectedLayout.bgImage;

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2 && selectedSize) setStep(3);
  };

  const reset = () => {
    setStep(1);
    setSelectedSize(null);
  };

  return (
    <section className="relative w-full h-[850px] overflow-hidden bg-black text-white font-sans">
      
      {/* === 1. DYNAMIC BACKGROUND (The "Real Feel" Factor) === */}
      <div className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out">
        <img 
          src={currentBg} 
          alt="Kitchen Background" 
          className="w-full h-full object-cover opacity-60 scale-105" // Slight zoom and opacity
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
      </div>

      {/* === 2. MAIN CONTENT CONTAINER === */}
      <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <div className="w-full max-w-xl">
          
          {/* Header */}
          <div className="mb-10">
            <span className="text-amber-500 font-bold tracking-[0.2em] text-xs uppercase mb-2 block flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Configurator
            </span>
            <h2 className="text-5xl font-serif leading-tight mb-4">
              Design Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">Dream Kitchen</span>
            </h2>
            <p className="text-gray-400 text-lg">
              {step === 1 && "Select your layout shape to match your home."}
              {step === 2 && "How big is your cooking space?"}
              {step === 3 && "Based on your inputs, here is the curated selection."}
            </p>
          </div>

          {/* === STEP 1: LAYOUT === */}
          {step === 1 && (
            <div className="animate-fade-in-right">
              <div className="grid grid-cols-2 gap-4 mb-8">
                {layoutOptions.map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => setSelectedLayout(layout)}
                    className={`p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 text-left ${
                      selectedLayout.id === layout.id
                        ? "bg-white text-black border-white shadow-xl transform scale-105"
                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      selectedLayout.id === layout.id ? "bg-amber-500 text-black" : "bg-white/10"
                    }`}>
                      {layout.icon}
                    </div>
                    <span className="font-semibold">{layout.name}</span>
                  </button>
                ))}
              </div>
              <button onClick={handleNext} className="group flex items-center gap-2 bg-amber-500 text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-amber-400 transition-all">
                Next Step <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* === STEP 2: SIZE === */}
          {step === 2 && (
            <div className="animate-fade-in-right">
              <div className="space-y-4 mb-8">
                {sizeOptions.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`w-full p-5 rounded-xl border transition-all duration-300 flex justify-between items-center ${
                      selectedSize === size.id
                        ? "bg-amber-500 border-amber-500 text-black shadow-lg"
                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-left">
                      <h4 className="font-bold text-lg">{size.label}</h4>
                      <p className={`text-xs ${selectedSize === size.id ? "text-black/70" : "text-gray-500"}`}>{size.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold">{size.area}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="px-6 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/10">
                  Back
                </button>
                <button 
                  onClick={handleNext} 
                  disabled={!selectedSize}
                  className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all ${
                    selectedSize ? "bg-white text-black hover:bg-gray-200" : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  View Recommendations
                </button>
              </div>
            </div>
          )}

          {/* === STEP 3: RESULTS === */}
          {step === 3 && (
            <div className="animate-fade-in-up">
              
              {/* Summary Chip */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 text-sm text-amber-400">
                <Check className="w-4 h-4" />
                <span>{selectedLayout.name} Layout</span>
                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                <span>{selectedSize} Size</span>
              </div>

              {/* Product List (Scrollable) */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {recommendations[selectedSize].map((item, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 flex gap-3 items-center hover:bg-white/20 transition-colors group">
                    <div className="w-16 h-16 bg-white rounded-lg p-1 shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight mb-1">{item.name}</h4>
                      <p className="text-amber-400 text-xs font-mono">{item.price}</p>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={reset} className="px-4 py-3 rounded-full border border-white/20 hover:bg-white/10">
                  <RefreshCcw className="w-5 h-5" />
                </button>
                <button className="flex-1 bg-amber-500 text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                  Save Configuration
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 p-10 opacity-20 hidden lg:block pointer-events-none">
        <Ruler className="w-64 h-64 text-white" strokeWidth={0.5} />
      </div>
    </section>
  );
}