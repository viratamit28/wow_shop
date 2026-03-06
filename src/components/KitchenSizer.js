import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Info, Loader2, ShoppingCart, Plus, Layers, SlidersHorizontal, ArrowRight, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 

// ==================== ASSETS ====================
import Lshaped from '../assests/layouts/L-shaped.jpg';
import Ushaped from '../assests/layouts/U-shaped.jpg';
import Galley from '../assests/layouts/Galley-shaped.jpg';
import OneWall from '../assests/layouts/Onewall-shaped.jpg';
import Penisula from '../assests/layouts/Penisula-shaped.jpg';
import Island from '../assests/layouts/Island-shaped.jpeg';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dcljdkqer/image/upload/";

// 🔥 CRASH-PROOF LAYOUT DATA WITH EXACT HOTSPOT COORDINATES
const layouts = {
  "L-Shaped": { image: Lshaped, slots: { hob: { top: "58%", left: "45%" }, chimney: { top: "25%", left: "45%" }, oven: { top: "55%", left: "75%" } } },
  "U-Shaped": { image: Ushaped, slots: { hob: { top: "55%", left: "50%" }, chimney: { top: "20%", left: "50%" }, oven: { top: "50%", left: "80%" } } },
  "Galley": { image: Galley, slots: { hob: { top: "60%", left: "30%" }, chimney: { top: "25%", left: "30%" }, oven: { top: "55%", left: "70%" } } },
  "One Wall": { image: OneWall, slots: { hob: { top: "58%", left: "50%" }, chimney: { top: "25%", left: "50%" }, oven: { top: "60%", left: "75%" } } },
  "Peninsula": { image: Penisula, slots: { hob: { top: "55%", left: "40%" }, chimney: { top: "20%", left: "40%" }, oven: { top: "50%", left: "70%" } } },
  "Island": { image: Island, slots: { hob: { top: "60%", left: "50%" }, chimney: { top: "10%", left: "50%" }, oven: { top: "50%", left: "20%" } } }
};

export default function KitchenSizer() {
  const navigate = useNavigate();
  const { token, refreshCart } = useContext(AuthContext);

  const [step, setStep] = useState(1); 
  const [areaInput, setAreaInput] = useState(120); 
  const [selectedLayout, setSelectedLayout] = useState("L-Shaped");
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Database Products
  const [products, setProducts] = useState({ hob: [], chimney: [], oven: [] });
  // User's Selections
  const [configuration, setConfiguration] = useState({ hob: null, chimney: null, oven: null });
  // Currently Open Hotspot Panel
  const [activeSlot, setActiveSlot] = useState(null); 

  // Image Helper
  const getImageUrl = (imgData) => {
    let img = imgData;
    if (Array.isArray(img)) img = img.length > 0 ? img[0] : "";
    if (!img) return "https://placehold.co/300?text=No+Img";
    if (img.startsWith('http')) return img;
    const cleanPath = typeof img === 'string' ? img.replace(/\\/g, '/') : '';
    return `${CLOUDINARY_BASE_URL}${cleanPath}`; 
  };

  useEffect(() => {
    const fetchFromDatabase = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/products`);
        const allProducts = res.data;

        const hob = allProducts.filter(p => p.category?.toLowerCase().includes('hob') || p.category?.toLowerCase().includes('cooktop'));
        const chimney = allProducts.filter(p => p.category?.toLowerCase().includes('chimney') || p.category?.toLowerCase().includes('hood'));
        const oven = allProducts.filter(p => p.category?.toLowerCase().includes('oven') || p.category?.toLowerCase().includes('microwave'));

        setProducts({ hob, chimney, oven });
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFromDatabase();
  }, []);

  const handleSaveConfiguration = async () => {
    if (!token) return alert("Please login to save your custom studio.");
    setSaving(true);
    
    try {
        const itemsToAdd = [configuration.hob, configuration.chimney, configuration.oven].filter(Boolean); 
        if(itemsToAdd.length === 0) return alert("Please select at least one appliance.");

        for (const item of itemsToAdd) {
            await axios.post(`${BACKEND_URL}/api/cart/add`, 
                { productId: item._id, quantity: 1 }, 
                { headers: { 'auth-token': token } }
            );
        }
        refreshCart(); 
        navigate('/cart');
    } catch (error) {
        console.error("Error saving config:", error);
        alert("Could not save configuration.");
    } finally {
        setSaving(false);
    }
  };

  const getRecommendation = () => {
    if (areaInput < 80) return "Compact Series (Space Saver)";
    if (areaInput < 150) return "Standard Series (Family)";
    return "Grand Series (Luxury)";
  };

  const calculateTotal = () => {
      const hPrice = configuration.hob?.price || 0;
      const cPrice = configuration.chimney?.price || 0;
      const oPrice = configuration.oven?.price || 0;
      return hPrice + cPrice + oPrice;
  };

  return (
    <section className="min-h-screen w-full bg-[#FAFAFA] font-sans text-gray-900 flex flex-col pt-24 pb-10">
      
      {/* ================= HEADER ================= */}
      <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-12 flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <Layers className="w-4 h-4 text-amber-600" />
             <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold">Studio Configurator</p>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-medium tracking-tight text-gray-900">
              Kitchen <span className="italic font-light text-gray-400">Blueprint.</span>
          </h2>
        </div>
        
        {step === 2 && (
             <button onClick={() => { setStep(1); setActiveSlot(null); }} className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-amber-600 transition-colors border-b border-transparent hover:border-amber-600 pb-1">
                Start Over
             </button>
        )}
      </div>

      <div className="flex-1 w-full max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col">
          {/* ================= STEP 1: CONSULTATION PHASE ================= */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}
                className="w-full bg-white rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col lg:flex-row"
              >
                {/* Left Side: Aesthetic Visual */}
                <div className="w-full lg:w-1/2 bg-gray-900 p-12 flex flex-col justify-center relative overflow-hidden min-h-[400px]">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/20 rounded-full blur-[100px]" />
                    <h1 className="text-5xl lg:text-7xl font-serif text-white mb-6 relative z-10 leading-[1.1]">
                        Define Your <br/><span className="italic text-gray-400">Space.</span>
                    </h1>
                    <p className="text-gray-400 font-light text-sm max-w-sm relative z-10">
                        Tell us about your kitchen's architecture. Our engine will adapt the studio environment to match your unique dimensions.
                    </p>
                </div>

                {/* Right Side: Form */}
                <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center bg-white">
                    
                    {/* Layout Selector */}
                    <div className="mb-12">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block mb-6">1. Select Architecture</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {Object.keys(layouts).map(layout => (
                                <button 
                                    key={layout} onClick={() => setSelectedLayout(layout)}
                                    className={`py-4 px-3 text-center transition-all duration-300 rounded-xl text-xs font-bold uppercase tracking-wider border ${
                                        selectedLayout === layout 
                                        ? 'border-gray-900 bg-gray-900 text-white shadow-lg scale-105' 
                                        : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {layout}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Area Slider */}
                    <div className="mb-12">
                        <div className="flex justify-between items-end mb-6">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block">2. Floor Area</label>
                            <span className="text-3xl font-serif text-gray-900">{areaInput} <span className="text-xs font-sans text-gray-400 uppercase tracking-widest font-bold">sq.ft</span></span>
                        </div>
                        <input 
                            type="range" min="50" max="400" value={areaInput} onChange={(e) => setAreaInput(e.target.value)}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                        />
                        <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            <Info className="w-3.5 h-3.5 text-amber-600" /> AI Suggests: <span className="text-amber-600">{getRecommendation()}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => setStep(2)} disabled={loading}
                        className="group w-full bg-amber-600 text-black py-5 rounded-xl uppercase tracking-[0.2em] text-[10px] font-extrabold hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Launch Configurator"}
                        {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ================= STEP 2: REAL-TIME VISUALIZER ================= */}
          <AnimatePresence>
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="w-full h-[70vh] min-h-[600px] bg-white rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col lg:flex-row relative"
              >
                  {/* --- LEFT: THE VISUAL STAGE --- */}
                  <div className="flex-1 relative bg-gray-100 overflow-hidden">
                      {/* Background Image */}
                      <img src={layouts[selectedLayout].image} alt="Kitchen Base" className="w-full h-full object-cover" />
                      {/* Cinematic Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
                      
                      {/* Interactive Nodes (The "Material Board" Concept) */}
                      {Object.keys(layouts[selectedLayout].slots).map((slotKey) => {
                          const pos = layouts[selectedLayout].slots[slotKey];
                          const isActive = activeSlot === slotKey;
                          const selectedItem = configuration[slotKey];

                          return (
                              <div key={slotKey} style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }} className="absolute z-20 flex flex-col items-center gap-2">
                                  
                                  {/* Tooltip Label */}
                                  <span className={`text-[9px] font-bold uppercase tracking-widest text-white drop-shadow-md transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                      {slotKey}
                                  </span>

                                  {/* The Node Button */}
                                  <button
                                      onClick={() => setActiveSlot(isActive ? null : slotKey)}
                                      className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl backdrop-blur-md border-[3px] group ${
                                          isActive ? 'border-amber-500 scale-110' : 'border-white/50 hover:border-white hover:scale-105'
                                      } ${selectedItem ? 'bg-white p-1' : 'bg-black/40'}`}
                                  >
                                      {/* If product selected, show its thumbnail */}
                                      {selectedItem ? (
                                          <div className="w-full h-full rounded-full overflow-hidden bg-gray-50 flex items-center justify-center relative">
                                              <img src={getImageUrl(selectedItem.image)} alt={slotKey} className="w-3/4 h-3/4 object-contain mix-blend-multiply" />
                                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                                  <SlidersHorizontal className="w-4 h-4 text-white" />
                                              </div>
                                          </div>
                                      ) : (
                                          // Empty State: Pulsing Plus
                                          <>
                                              <Plus className={`w-5 h-5 transition-colors ${isActive ? 'text-amber-500' : 'text-white'}`} strokeWidth={3} />
                                              {!isActive && <div className="absolute inset-0 rounded-full border border-white/50 animate-ping opacity-50" />}
                                          </>
                                      )}
                                      
                                      {/* Success Checkmark indicator */}
                                      {selectedItem && (
                                          <div className="absolute -top-1 -right-1 bg-green-500 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                              <Check className="w-3 h-3 text-white" strokeWidth={4} />
                                          </div>
                                      )}
                                  </button>
                              </div>
                          );
                      })}
                  </div>

                  {/* --- RIGHT: THE PRODUCT SELECTOR PANEL --- */}
                  {/* On Mobile: Slides up from bottom. On Desktop: Fixed Right Sidebar */}
                  <div className={`absolute lg:relative top-0 right-0 h-full w-full lg:w-[450px] bg-white z-30 flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.05)] transition-transform duration-500 ${
                      activeSlot ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
                  }`}>
                      
                      {/* Panel Header */}
                      <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                          <div>
                              <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-600 mb-1">Configuration</h3>
                              <h2 className="text-2xl font-serif text-gray-900">
                                  {activeSlot ? `Select ${activeSlot}` : "Overview"}
                              </h2>
                          </div>
                          {/* Mobile Close Button */}
                          <button onClick={() => setActiveSlot(null)} className="lg:hidden p-2 bg-white rounded-full shadow-sm border border-gray-100 text-gray-400">
                              <X className="w-4 h-4" />
                          </button>
                      </div>

                      {/* Panel Body: Product List */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                          {activeSlot ? (
                              products[activeSlot]?.length > 0 ? (
                                  products[activeSlot].map((product, idx) => {
                                      const isSelected = configuration[activeSlot]?._id === product._id;
                                      return (
                                          <motion.div 
                                              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                              key={product._id}
                                              onClick={() => setConfiguration({...configuration, [activeSlot]: product})}
                                              className={`group cursor-pointer p-4 border rounded-2xl flex items-center gap-4 transition-all duration-300 ${
                                                  isSelected ? 'bg-amber-50/50 border-amber-500 shadow-md ring-1 ring-amber-500' : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'
                                              }`}
                                          >
                                              <div className="w-20 h-20 bg-gray-50 border border-gray-100 p-2 rounded-xl flex items-center justify-center">
                                                  <img src={getImageUrl(product.image)} className="max-h-full max-w-full object-contain mix-blend-multiply" alt={product.name} />
                                              </div>
                                              <div className="flex-1">
                                                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">{product.brand}</p>
                                                  <h4 className="font-semibold text-xs text-gray-900 line-clamp-2 leading-snug mb-2">{product.name}</h4>
                                                  <div className="flex justify-between items-center">
                                                      <p className="text-sm font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                                                      {isSelected && <span className="text-[9px] uppercase tracking-widest font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-sm">Selected</span>}
                                                  </div>
                                              </div>
                                          </motion.div>
                                      );
                                  })
                              ) : (
                                  <div className="text-center py-12 text-gray-400 font-light text-sm">No models found for {activeSlot}.</div>
                              )
                          ) : (
                              // Overview State (When no slot is clicked)
                              <div className="space-y-4">
                                  {['hob', 'chimney', 'oven'].map(slot => (
                                      <div key={slot} onClick={() => setActiveSlot(slot)} className="cursor-pointer p-4 border border-gray-100 rounded-2xl flex items-center justify-between hover:bg-gray-50 transition-colors">
                                          <div className="flex items-center gap-4">
                                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${configuration[slot] ? 'bg-gray-50' : 'bg-gray-100 border border-dashed border-gray-300'}`}>
                                                  {configuration[slot] ? <img src={getImageUrl(configuration[slot].image)} className="w-8 h-8 object-contain mix-blend-multiply" alt=""/> : <Plus className="w-4 h-4 text-gray-400" />}
                                              </div>
                                              <div>
                                                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{slot}</p>
                                                  <p className="text-xs font-medium text-gray-900 truncate w-32">{configuration[slot]?.name || 'Not Selected'}</p>
                                              </div>
                                          </div>
                                          {configuration[slot] && <p className="text-xs font-bold text-gray-900">₹{configuration[slot].price.toLocaleString()}</p>}
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>

                      {/* Checkout Footer */}
                      <div className="p-6 md:p-8 border-t border-gray-100 bg-white">
                          <div className="flex justify-between items-end mb-6">
                              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Total Studio Value</span>
                              <span className="text-3xl font-serif text-gray-900 leading-none">₹{calculateTotal().toLocaleString()}</span>
                          </div>
                          <button 
                              onClick={handleSaveConfiguration} disabled={saving || calculateTotal() === 0}
                              className="w-full py-4 bg-gray-900 text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-amber-600 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0"
                          >
                              {saving ? <Loader2 className="animate-spin w-4 h-4 text-white"/> : <ShoppingCart className="w-4 h-4"/>}
                              {saving ? "Saving Studio..." : "Add to Portfolio"}
                          </button>
                      </div>

                  </div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </section>
  );
}