import React, { useState, useEffect } from "react";
import { 
  Check, ArrowRight, Sparkles, ChevronRight, 
  RefreshCcw, Info, X, ZoomIn, Map
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // 👇 Import Navigate

// ==================== DATA CONFIGURATION ====================

// Mapping for Routing (Display Name -> URL Slug)
const categorySlugs = {
  "Hobs": "hobs",
  "Chimneys": "hoods",
  "Ovens": "ovens",
  "Microwaves": "ovens", // Mapping microwave to ovens page for now
  "Refrigerators": "refrigerators",
  "Small Appliances": "small-appliances",
  "Dishwashers": "dishwashers"
};

const layoutOptions = [
  { id: 'l-shaped', name: "L-Shaped", desc: "Best for corners", bgImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80" },
  { id: 'u-shaped', name: "U-Shaped", desc: "Maximize storage", bgImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80" },
  { id: 'parallel', name: "Parallel", desc: "Chef's choice", bgImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80" },
  { id: 'island', name: "Island", desc: "Open living", bgImage: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&q=80" },
];

const sizeOptions = [
  { id: 'compact', label: "Compact", area: "60-90 sq.ft", desc: "Studio / 1BHK", blueprint: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80" },
  { id: 'standard', label: "Standard", area: "90-150 sq.ft", desc: "2BHK / 3BHK", blueprint: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80" },
  { id: 'grand', label: "Grand", area: "150+ sq.ft", desc: "Luxury Villa", blueprint: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80" },
];

// Simplified Database just to get Category Names
const database = {
  compact: [
    { category: "Hobs", image: "https://m.media-amazon.com/images/I/61k2Xq4sJEL._SX679_.jpg" },
    { category: "Chimneys", image: "https://cdn.shopify.com/s/files/1/0932/4816/0107/files/BASE-BF-60-BLK-4.webp?v=1758783107" },
    { category: "Microwaves", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_0NNCrSNnlITAX8xJj1wnARsfwpNaUEEXpg&s" },
  ],
  standard: [
    { category: "Hobs", image: "https://m.media-amazon.com/images/I/61k2Xq4sJEL._SX679_.jpg" },
    { category: "Chimneys", image: "https://cdn.shopify.com/s/files/1/0932/4816/0107/files/BASE-BF-60-BLK-4.webp?v=1758783107" },
    { category: "Ovens", image: "https://media.croma.com/image/upload/v1708669460/Croma%20Assets/Large%20Appliances/Microwave%20Oven/Images/214300_0_s7g6yq.png" },
    { category: "Refrigerators", image: "https://images.samsung.com/is/image/samsung/p6pim/in/rs78cg8543s9hl/energylabel/in-energylabel-product-rs78cg8543s9hl-549428104" },
    { category: "Small Appliances", image: "https://m.media-amazon.com/images/I/61XW7irIqIL._SX679_.jpg" },
  ],
  grand: [
    { category: "Hobs", image: "https://m.media-amazon.com/images/I/61k2Xq4sJEL._SX679_.jpg" },
    { category: "Chimneys", image: "https://cdn.shopify.com/s/files/1/0932/4816/0107/files/BASE-BF-60-BLK-4.webp?v=1758783107" },
    { category: "Refrigerators", image: "https://images.samsung.com/is/image/samsung/p6pim/in/rs78cg8543s9hl/energylabel/in-energylabel-product-rs78cg8543s9hl-549428104" },
    { category: "Ovens", image: "https://media.croma.com/image/upload/v1708669460/Croma%20Assets/Large%20Appliances/Microwave%20Oven/Images/214300_0_s7g6yq.png" },
    { category: "Dishwashers", image: "https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?auto=format&fit=crop&q=80" }
  ]
};

export function KitchenSizer() {
  const navigate = useNavigate(); // Hook for navigation

  // --- STATE WITH PERSISTENCE LOGIC ---
  const [step, setStep] = useState(1);
  const [selectedLayout, setSelectedLayout] = useState(layoutOptions[0]); 
  const [selectedSize, setSelectedSize] = useState(null);
  
  // Right Panel Logic
  const [showBlueprint, setShowBlueprint] = useState(false); 
  const [isBlueprintZoomed, setIsBlueprintZoomed] = useState(false);

  // 1. Load State on Mount (Taaki Back aane par sab waisa hi mile)
  useEffect(() => {
    const savedState = sessionStorage.getItem("kitchenSizerState");
    if (savedState) {
        const parsed = JSON.parse(savedState);
        setStep(parsed.step);
        setSelectedLayout(parsed.selectedLayout);
        setSelectedSize(parsed.selectedSize);
    }
  }, []);

  // 2. Save State on Change
  useEffect(() => {
    const stateToSave = { step, selectedLayout, selectedSize };
    sessionStorage.setItem("kitchenSizerState", JSON.stringify(stateToSave));
  }, [step, selectedLayout, selectedSize]);


  const currentBg = selectedLayout.bgImage;
  const currentProducts = database[selectedSize?.id] || [];
  
  // Extract unique categories
  const categories = [...new Set(currentProducts.map(item => item.category))];

  // --- HANDLERS ---

  const handleLayoutSelect = (layout) => {
    setSelectedLayout(layout);
    setStep(2);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setShowBlueprint(true);
  };

  const handleFindAppliances = () => {
    setStep(3);
    setShowBlueprint(false);
  };

  // 👇 UPDATED: Navigate to Category Page instead of opening side panel
  const handleCategoryClick = (categoryName) => {
    const slug = categorySlugs[categoryName] || categoryName.toLowerCase();
    // Navigate to the category page (e.g., /category/hobs)
    navigate(`/category/${slug}`);
  };

  const reset = () => {
    setStep(1);
    setSelectedSize(null);
    setShowBlueprint(false);
    setIsBlueprintZoomed(false);
    sessionStorage.removeItem("kitchenSizerState"); // Clear saved state
  };

  // Right Panel is Open only for Blueprint now
  const isPanelOpen = showBlueprint;

  return (
    <section className="relative w-full h-[850px] overflow-hidden bg-neutral-900 text-white font-sans selection:bg-amber-500 selection:text-black">
      
      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 bg-black/70 z-10 transition-colors duration-500 ${isPanelOpen ? "bg-black/80" : ""}`} /> 
        <img src={currentBg} alt="Background" className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-[20s] ease-linear" />
      </div>

      {/* ================= LEFT MAIN CONTAINER ================= */}
      <div className="relative z-20 container mx-auto px-6 h-full flex items-center justify-center lg:justify-start">
        
        <div className={`w-full max-w-xl animate-fade-in-right transition-all duration-500 ${isPanelOpen ? 'opacity-40 blur-[1px]' : 'opacity-100'}`}>
            
            {/* Header */}
            <div className="mb-8">
              <span className="text-amber-500 font-bold tracking-[0.2em] text-xs uppercase mb-2 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> AI Configurator
              </span>
              <h2 className="text-5xl font-serif leading-tight mb-4 text-white">
                {step === 1 && "Choose Layout"}
                {step === 2 && "Define Space"}
                {step === 3 && "Reference Categories"}
              </h2>
              <div className="h-1 w-20 bg-amber-500 rounded-full mb-4"></div>
            </div>

            {/* === STEP 1: LAYOUT === */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                {layoutOptions.map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => handleLayoutSelect(layout)}
                    className={`group p-5 rounded-2xl border bg-white/5 border-white/10 text-left hover:bg-white/10 hover:border-amber-500/50 transition-all ${selectedLayout.id === layout.id ? 'border-amber-500/50 bg-white/10' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <span className="font-bold text-lg group-hover:text-amber-500 transition-colors">{layout.name}</span>
                       <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-amber-500"/>
                    </div>
                    <p className="text-xs text-gray-500">{layout.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {/* === STEP 2: SIZE === */}
            {step === 2 && (
              <div className="space-y-4">
                {sizeOptions.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => handleSizeSelect(size)}
                    className={`w-full p-5 rounded-2xl border transition-all text-left flex justify-between items-center ${
                      selectedSize?.id === size.id
                        ? "bg-amber-500 border-amber-500 text-black shadow-lg"
                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-lg">{size.label}</h4>
                      <p className={`text-xs ${selectedSize?.id === size.id ? "text-black/70" : "text-gray-500"}`}>{size.area}</p>
                    </div>
                    {selectedSize?.id === size.id ? <Check className="w-5 h-5"/> : <Info className="w-5 h-5 opacity-50"/>}
                  </button>
                ))}

                <div className="pt-6 flex gap-4">
                   <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10">Back</button>
                   <button 
                     disabled={!selectedSize}
                     onClick={handleFindAppliances}
                     className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-widest transition-all ${
                       selectedSize ? "bg-white text-black hover:bg-gray-200" : "bg-neutral-800 text-gray-600 cursor-not-allowed"
                     }`}
                   >
                     Show Categories <ArrowRight className="inline w-4 h-4 ml-2"/>
                   </button>
                </div>
              </div>
            )}

            {/* === STEP 3: CATEGORY SLIDER (Navigates to Page) === */}
            {step === 3 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-400 text-sm">Select a category to view full collection</p>
                    <button onClick={reset} className="text-xs text-amber-500 hover:underline flex items-center gap-1"><RefreshCcw className="w-3 h-3"/> Restart</button>
                </div>

                {/* Horizontal Category Slider */}
                <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar snap-x">
                  {categories.map((cat, index) => {
                    const repProduct = currentProducts.find(p => p.category === cat);
                    return (
                        <div 
                        key={index} 
                        onClick={() => handleCategoryClick(cat)} // 👈 Triggers Navigation
                        className="snap-start shrink-0 w-40 h-48 bg-white rounded-xl overflow-hidden relative cursor-pointer group transition-all duration-300 border border-white/10 hover:opacity-100 opacity-90 hover:ring-2 hover:ring-amber-500"
                        >
                        {/* Image */}
                        <div className="w-full h-full bg-white flex items-center justify-center relative">
                            <img src={repProduct?.image} alt={cat} className="w-full h-full object-contain p-2" />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent pointer-events-none" />
                        </div>
                        
                        {/* Text Overlay */}
                        <div className="absolute top-0 left-0 w-full p-3 z-10">
                            <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-0.5 shadow-black drop-shadow-md">
                                Explore
                            </p>
                            <p className="text-lg text-white font-serif leading-tight shadow-black drop-shadow-md">
                                {cat}
                            </p>
                        </div>

                        <div className="absolute bottom-2 right-2 bg-amber-500 p-1.5 rounded-full text-black opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                            <ChevronRight className="w-3 h-3"/>
                        </div>
                        </div>
                    );
                  })}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* ================= RIGHT SIDE PANEL (Only for Blueprint now) ================= */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full md:w-[450px] bg-neutral-900 border-l border-white/10 shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${
          showBlueprint ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedSize && (
            <>
              <div className="p-6 border-b border-white/10 bg-neutral-900 flex justify-between items-center">
                 <h3 className="text-lg font-serif text-white flex items-center gap-2">
                    <Map className="w-5 h-5 text-amber-500"/> Layout Preview
                 </h3>
                 <button onClick={() => setShowBlueprint(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                 <div className="group w-full aspect-square bg-neutral-800 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden mb-6 relative hover:border-amber-500/50 transition-colors">
                    <img src={selectedSize.blueprint} alt="Blueprint" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <button 
                            onClick={() => setIsBlueprintZoomed(true)}
                            className="bg-white text-black px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                        >
                            <ZoomIn className="w-4 h-4" /> Zoom View
                        </button>
                    </div>
                 </div>
                 <h4 className="text-xl font-bold text-white mb-2">{selectedSize.label} Configuration</h4>
                 <p className="text-sm text-gray-400 max-w-xs mb-6">
                    This layout is optimized for {selectedSize.desc}.
                 </p>
                 <button 
                    onClick={handleFindAppliances} 
                    className="w-full py-3 bg-amber-500 text-black rounded-xl font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors"
                 >
                    Confirm & View Appliances
                 </button>
              </div>
            </>
        )}
      </div>

      {/* ================= ZOOM MODAL ================= */}
      {isBlueprintZoomed && selectedSize && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fade-in">
            <button onClick={() => setIsBlueprintZoomed(false)} className="absolute top-6 right-6 text-white hover:text-amber-500 transition-colors bg-white/10 p-2 rounded-full">
                <X className="w-8 h-8" />
            </button>
            <div className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
                <h2 className="text-2xl font-serif text-white mb-4">{selectedSize.label} Blueprint</h2>
                <div className="relative w-full h-full border border-white/20 rounded-xl overflow-hidden bg-neutral-800">
                    <img src={selectedSize.blueprint} alt="Full Blueprint" className="w-full h-full object-contain" />
                </div>
            </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </section>
  );
}