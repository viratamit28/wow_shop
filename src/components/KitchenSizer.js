import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Check, Maximize2, Info, Loader2, ShoppingCart, ArrowRight } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Cart update karne ke liye
import LShapes from "../assests/L-shape.jpg";
// ==================== STATIC ASSETS (Room Images) ====================
const layouts = {
  "L-Shaped": {
    id: "layout_l",
    image:LShapes,
    slots: {
      hob: { top: "58%", left: "45%", width: "12%" }, 
      chimney: { top: "25%", left: "44%", width: "14%" }, 
      oven: { top: "55%", left: "75%", width: "8%" } 
    }
  },
  "Island": {
    id: "layout_island",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80",
    slots: {
      hob: { top: "60%", left: "50%", width: "15%" },
      chimney: { top: "10%", left: "48%", width: "18%" },
      oven: { top: "50%", left: "20%", width: "10%" }
    }
  }
};

export default function KitchenSizer() {
  const navigate = useNavigate();
  const { token, refreshCart } = useContext(AuthContext);

  // --- STATES ---
  const [step, setStep] = useState(1); // 1: Input Area, 2: Visualizer
  const [areaInput, setAreaInput] = useState(100); 
  const [selectedLayout, setSelectedLayout] = useState("L-Shaped");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Database Data States
  const [products, setProducts] = useState({ hobs: [], chimneys: [], ovens: [] });
  
  // Selected Configuration
  const [configuration, setConfiguration] = useState({
    hob: null,
    chimney: null,
    oven: null
  });

  const [activeSlot, setActiveSlot] = useState(null); // Which slot is user editing?

  // --- 1. FETCH FROM DATABASE ---
  useEffect(() => {
    const fetchFromDatabase = async () => {
      setLoading(true);
      try {
        // Fetch ALL products
        const res = await axios.get("http://localhost:5000/api/products");
        const allProducts = res.data;

        // Filter Categories (Case insensitive check)
        const hobs = allProducts.filter(p => p.category.toLowerCase().includes('hob'));
        const chimneys = allProducts.filter(p => p.category.toLowerCase().includes('chimney') || p.category.toLowerCase().includes('hood'));
        const ovens = allProducts.filter(p => p.category.toLowerCase().includes('oven') || p.category.toLowerCase().includes('microwave'));

        setProducts({ hobs, chimneys, ovens });

        // Auto-select first items if available
        setConfiguration({
            hob: hobs[0] || null,
            chimney: chimneys[0] || null,
            oven: ovens[0] || null
        });

      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFromDatabase();
  }, []);

  // --- 2. SAVE CONFIGURATION TO CART ---
  const handleSaveConfiguration = async () => {
    if (!token) {
        alert("Please login to save this configuration.");
        return;
    }
    setSaving(true);
    
    try {
        // Create an array of selected product IDs
        const itemsToAdd = [
            configuration.hob, 
            configuration.chimney, 
            configuration.oven
        ].filter(item => item !== null); // Remove nulls if any slot is empty

        // Add each item to cart (Looping requests)
        // Note: Better approach would be a bulk-add API, but loop works for now
        for (const item of itemsToAdd) {
            await axios.post('http://localhost:5000/api/cart/add', 
                { productId: item._id, quantity: 1 }, 
                { headers: { 'auth-token': token } }
            );
        }

        refreshCart(); // Update global cart count
        // Redirect to Cart
        navigate('/cart');

    } catch (error) {
        console.error("Error saving config:", error);
        alert("Could not save configuration.");
    } finally {
        setSaving(false);
    }
  };


  // --- LOGIC: AREA RECOMMENDATION ---
  const getRecommendation = () => {
    if (areaInput < 80) return "Compact Series (Space Saving)";
    if (areaInput < 150) return "Standard Series (Family Fit)";
    return "Grand Series (Chef's Luxury)";
  };

  return (
    <section className="min-h-screen w-full bg-[#F5F5F7] font-luxury-sans text-gray-900 flex flex-col pt-20">
      
      {/* ================= HEADER ================= */}
      <div className="bg-white border-b border-gray-200 px-6 md:px-8 py-4 flex justify-between items-center z-40 sticky top-20 shadow-sm">
        <div>
          <h2 className="text-xl font-luxury-serif font-bold">Kitchen Studio <span className="text-[#D4AF37]">Live</span></h2>
          <p className="text-xs text-gray-500">Photorealistic Configurator</p>
        </div>
        
        {step === 2 && (
             <div className="hidden md:flex gap-6 text-sm">
                <div>
                    <span className="text-gray-400 text-xs uppercase block">Layout</span>
                    <span className="font-bold">{selectedLayout}</span>
                </div>
                <div>
                    <span className="text-gray-400 text-xs uppercase block">Area</span>
                    <span className="font-bold">{areaInput} sq.ft</span>
                </div>
                <div>
                    <span className="text-gray-400 text-xs uppercase block">Recommendation</span>
                    <span className="font-bold text-[#D4AF37]">{getRecommendation()}</span>
                </div>
             </div>
        )}

        {step === 2 && (
             <button onClick={() => setStep(1)} className="text-xs uppercase tracking-widest border-b border-gray-300 pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37]">
                Start Over
             </button>
        )}
      </div>

      {/* ================= STEP 1: INPUT (CONSULTATION PHASE) ================= */}
      {step === 1 && (
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-3xl w-full text-center border border-gray-100"
          >
            <h1 className="text-4xl md:text-5xl font-luxury-serif mb-4 text-gray-900">Visualize Your Space.</h1>
            <p className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
                Enter your kitchen details. Our system will recommend the perfect appliance sizes and visualize them in a real environment.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-10">
                {/* Layout Selector */}
                <div>
                    <label className="text-xs font-bold uppercase tracking-widest block mb-3 text-gray-400">Select Layout</label>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.keys(layouts).map(layout => (
                            <button 
                                key={layout}
                                onClick={() => setSelectedLayout(layout)}
                                className={`p-4 border text-center transition-all rounded-sm ${
                                    selectedLayout === layout 
                                    ? 'border-[#D4AF37] bg-gray-900 text-white shadow-lg' 
                                    : 'border-gray-200 hover:border-gray-400 bg-gray-50'
                                }`}
                            >
                                {layout}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Area Slider */}
                <div>
                    <label className="text-xs font-bold uppercase tracking-widest block mb-3 text-gray-400">Kitchen Area (Sq. Ft)</label>
                    <div className="bg-gray-50 p-6 rounded-sm border border-gray-100">
                        <div className="flex justify-between mb-4">
                             <span className="text-3xl font-serif text-gray-900">{areaInput}</span>
                             <span className="text-gray-400 self-end mb-1">sq.ft</span>
                        </div>
                        <input 
                            type="range" min="50" max="300" 
                            value={areaInput} 
                            onChange={(e) => setAreaInput(e.target.value)}
                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                        />
                        <div className="mt-4 flex items-start gap-2 text-xs text-[#D4AF37] bg-amber-50 p-2 rounded">
                             <Info className="w-4 h-4 flex-shrink-0" />
                             <span>Based on size, we suggest: <b>{getRecommendation()}</b>.</span>
                        </div>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => setStep(2)}
                disabled={loading}
                className="bg-gray-900 text-white px-12 py-4 uppercase tracking-[0.2em] text-sm font-bold hover:bg-[#D4AF37] hover:text-black transition-all shadow-xl disabled:opacity-50"
            >
                {loading ? <div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Loading Products...</div> : "Generate My Kitchen"}
            </button>
          </motion.div>
        </div>
      )}

      {/* ================= STEP 2: REAL-TIME VISUALIZER (THE WOW FACTOR) ================= */}
      {step === 2 && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-140px)]">
            
            {/* --- LEFT: THE STAGE (Realistic Image) --- */}
            <div className="flex-1 relative bg-gray-100 overflow-hidden group">
                
                {/* 1. Base Real Kitchen Image */}
                <motion.div 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="w-full h-full"
                >
                    <img 
                        src={layouts[selectedLayout].image} 
                        alt="Kitchen Base" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                </motion.div>

                {/* 2. PRODUCT OVERLAYS (Now using Real DB Data) */}
                
                {/* Hob Layer */}
                {configuration.hob && (
                    <motion.img 
                        key={configuration.hob._id}
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        src={configuration.hob.image} // Using real DB image field
                        alt="Hob"
                        style={{ 
                            position: 'absolute', 
                            ...layouts[selectedLayout].slots.hob,
                            filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.5))' 
                        }}
                        className={`z-10 object-contain transition-transform cursor-pointer mix-blend-multiply ${activeSlot === 'hob' ? 'scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'hover:scale-105'}`}
                        onClick={() => setActiveSlot('hob')}
                    />
                )}

                {/* Chimney Layer */}
                {configuration.chimney && (
                    <motion.img 
                        key={configuration.chimney._id}
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        src={configuration.chimney.image}
                        alt="Chimney"
                        style={{ 
                            position: 'absolute', 
                            ...layouts[selectedLayout].slots.chimney,
                            filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.6))' 
                        }}
                        className={`z-10 object-contain transition-transform cursor-pointer mix-blend-multiply ${activeSlot === 'chimney' ? 'scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'hover:scale-105'}`}
                        onClick={() => setActiveSlot('chimney')}
                    />
                )}

                {/* Oven Layer */}
                {configuration.oven && (
                     <motion.img 
                        key={configuration.oven._id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        src={configuration.oven.image}
                        alt="Oven"
                        style={{ 
                            position: 'absolute', 
                            ...layouts[selectedLayout].slots.oven,
                        }}
                        className={`z-10 object-contain transition-transform cursor-pointer mix-blend-multiply ${activeSlot === 'oven' ? 'scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'hover:scale-105'}`}
                        onClick={() => setActiveSlot('oven')}
                    />
                )}


                {/* 3. INTERACTIVE TAGS (Click to Edit) */}
                {Object.entries(layouts[selectedLayout].slots).map(([key, pos]) => (
                    <button
                        key={key}
                        style={{ top: pos.top, left: pos.left, marginLeft: '5%' }}
                        onClick={() => setActiveSlot(key === activeSlot ? null : key)}
                        className={`absolute z-20 w-8 h-8 rounded-full border border-white/50 flex items-center justify-center transition-all shadow-lg ${
                            activeSlot === key ? 'bg-[#D4AF37] scale-110' : 'bg-white/20 backdrop-blur-md hover:bg-[#D4AF37]'
                        }`}
                    >
                        {activeSlot === key ? <Check className="w-4 h-4 text-black" /> : <div className="w-2 h-2 bg-white rounded-full animate-ping" />}
                    </button>
                ))}

            </div>

            {/* --- RIGHT: THE PRODUCT SELECTOR (Floating Drawer) --- */}
            <div className="w-full lg:w-[400px] bg-white border-l border-gray-200 z-30 flex flex-col shadow-2xl relative">
                
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Customization</h3>
                    <h2 className="text-2xl font-luxury-serif text-gray-900">
                        {activeSlot ? `Select ${activeSlot.charAt(0).toUpperCase() + activeSlot.slice(1)}` : "Select an Appliance"}
                    </h2>
                    <p className="text-xs text-gray-500 mt-2">
                         {activeSlot ? "Real-time preview enabled" : "Click on the glowing dots on the image to edit."}
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {activeSlot ? (
                        // Show Options from DB for Active Slot
                        <div className="space-y-4">
                            {products[activeSlot + 's']?.length > 0 ? (
                                products[activeSlot + 's']?.map((product) => (
                                <div 
                                    key={product._id}
                                    onClick={() => setConfiguration({...configuration, [activeSlot]: product})}
                                    className={`group cursor-pointer p-4 border rounded-lg flex items-center gap-4 transition-all ${
                                        configuration[activeSlot]?._id === product._id
                                        ? 'border-[#D4AF37] bg-amber-50 shadow-md ring-1 ring-[#D4AF37]'
                                        : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
                                    }`}
                                >
                                    <div className="w-20 h-20 bg-white border border-gray-100 p-2 flex items-center justify-center rounded-md">
                                        <img src={product.image} className="max-h-full max-w-full object-contain mix-blend-multiply" alt={product.name} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-gray-900 line-clamp-2">{product.name}</h4>
                                        <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                                            {configuration[activeSlot]?._id === product._id && <Check className="w-5 h-5 text-[#D4AF37]" />}
                                        </div>
                                    </div>
                                </div>
                            ))) : (
                                <div className="text-center py-10 text-gray-400">
                                    No products found for this category.
                                </div>
                            )}
                        </div>
                    ) : (
                        // Default View (Guidance)
                        <div className="text-center py-20 opacity-60">
                            <Maximize2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-sm text-gray-500 font-medium">Select any hotspot on the image <br/> to swap appliances instantly.</p>
                        </div>
                    )}
                </div>

                {/* Footer Total */}
                <div className="p-6 border-t border-gray-200 bg-gray-900 text-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xs uppercase tracking-widest text-gray-400">Estimated Total</span>
                        <span className="text-3xl font-luxury-serif text-[#D4AF37]">
                            ₹{((configuration.hob?.price || 0) + (configuration.chimney?.price || 0) + (configuration.oven?.price || 0)).toLocaleString()}
                        </span>
                    </div>
                    <button 
                        onClick={handleSaveConfiguration}
                        disabled={saving}
                        className="w-full py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-colors rounded-sm shadow-lg flex items-center justify-center gap-2"
                    >
                        {saving ? <Loader2 className="animate-spin w-4 h-4"/> : <ShoppingCart className="w-4 h-4"/>}
                        {saving ? "Saving..." : "Add to Cart & Finalize"}
                    </button>
                </div>

            </div>
        </div>
      )}
    </section>
  );
}