import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import { 
  X, Plus,  ArrowRight, ShoppingCart, 
  Trash2, Video, Eye,  Loader2, Sparkles, Search 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 🔥 DEPLOYMENT READY URLS
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dcljdkqer/image/upload/";

// --- MASTER LAYOUT DATA ---
const kitchenLayouts = [
  {
    id: 1,
    name: "L-Shaped Kitchen",
    fancyName: "The Corner Masterpiece",
    image: require("../assests/layouts/L-shaped.jpg"), 
    positions: [
      { x: 32, y: 25, name: "Chimney" },
      { x: 32, y: 55, name: "Hob" },
      { x: 82, y: 55, name: "Oven" },
      { x: 51, y: 55, name: "Sink" },
      { x: 82, y: 30, name: "Refrigerator" },
      { x: 51, y: 75, name: "Dishwasher" },
      { x: 20, y: 75, name: "Washing Machine" },
    ],
  },
  {
    id: 2,
    name: "U-Shaped Kitchen",
    fancyName: "The Ultimate Triangle",
    image: require("../assests/layouts/U-shaped.jpg"),
    positions: [
      { x: 43, y: 25, name: "Chimney" },
      { x: 43, y: 55, name: "Hob" },
      { x: 75, y: 35, name: "Oven" },
      { x: 15, y: 55, name: "Sink" },
      { x: 25, y: 25, name: "Refrigerator" },
      { x: 15, y: 75, name: "Dishwasher" },
      { x: 75, y: 65, name: "Washing Machine" },
    ],
  },
  {
    id: 3,
    name: "Galley Kitchen",
    fancyName: "The Efficient Parallel",
    image: require("../assests/layouts/Galley-shaped.jpg"),
    positions: [
      { x: 63, y: 30, name: "Chimney" },
      { x: 63, y: 60, name: "Hob" },
      { x: 85, y: 40, name: "Oven" },
      { x: 35, y: 60, name: "Sink" },
      { x: 15, y: 40, name: "Refrigerator" },
      { x: 35, y: 80, name: "Dishwasher" }
    ],
  },
  {
    id: 4,
    name: "One Wall Kitchen",
    fancyName: "Minimalist Studio",
    image: require("../assests/layouts/Onewall-shaped.jpg"),
    positions: [
      { x: 50, y: 25, name: "Chimney" },
      { x: 50, y: 55, name: "Hob" },
      { x: 75, y: 55, name: "Oven" },
      { x: 30, y: 55, name: "Sink" },
      { x: 10, y: 45, name: "Refrigerator" },
      { x: 30, y: 75, name: "Dishwasher" },
    ],
  },
  {
    id: 5,
    name: "Peninsula Kitchen",
    fancyName: "The Open Connector",
    image: require("../assests/layouts/Penisula-shaped.jpg"),
    positions: [
      { x: 47, y: 25, name: "Chimney" },
      { x: 47, y: 55, name: "Hob" },
      { x: 15, y: 55, name: "Oven" },
      { x: 75, y: 55, name: "Sink" },
      { x: 85, y: 30, name: "Refrigerator" },
      { x: 75, y: 75, name: "Dishwasher" },
    ],
  },
  {
    id: 6,
    name: "Island Kitchen",
    fancyName: "The Grand Centerpiece",
    image: require("../assests/layouts/Island-shaped.jpeg"),
    positions: [
      { x: 48, y: 20, name: "Chimney" },
      { x: 48, y: 50, name: "Hob" },
      { x: 20, y: 50, name: "Oven" },
      { x: 80, y: 50, name: "Sink" },
      { x: 20, y: 25, name: "Refrigerator" },
      { x: 80, y: 75, name: "Dishwasher" },
    ],
  },
];

export default function ChooseLayout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, refreshCart } = useContext(AuthContext);

  const [activeZone, setActiveZone] = useState(null); 
  const [kitchenSelections, setKitchenSelections] = useState({});
  const [dbProducts, setDbProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const [selectionOrder, setSelectionOrder] = useState([]);

  const selectedLayout = kitchenLayouts.find((l) => l.id === parseInt(id));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/products`);
        if (Array.isArray(res.data)) {
            setDbProducts(res.data);
        } else if (res.data && res.data.products) {
            setDbProducts(res.data.products);
        } else {
            setDbProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products", error);
        setDbProducts([]);
      }
    };
    fetchProducts();
  }, []);

  if (!selectedLayout) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600 mb-4" />
        <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">Loading Studio...</p>
    </div>
  );

  const getImgUrl = (img) => {
      if (!img) return "https://placehold.co/400x300?text=No+Image";
      let url = Array.isArray(img) ? img[0] : img;
      if (typeof url !== 'string') return "https://placehold.co/400x300?text=No+Image";
      
      if (url.startsWith('http') || url.startsWith('data:')) return url;
      
      const cleanPath = url.replace(/\\/g, '/');
      return `${CLOUDINARY_BASE_URL}${cleanPath}`;
  };

  const getZoneProducts = (zoneName) => {
    if (!zoneName) return [];
    let search = zoneName.toLowerCase();

    if (search.includes('refrigerator') || search.includes('fridge')) search = 'refrigerator';
    if (search.includes('oven') || search.includes('microwave')) search = 'oven';
    if (search.includes('hob') || search.includes('cooktop')) search = 'hob';
    if (search.includes('washing')) search = 'washing';
    if (search.includes('dish')) search = 'dishwasher';

    return dbProducts.filter(p => {
        const cat = p.category ? p.category.toLowerCase() : "";
        const name = p.name ? p.name.toLowerCase() : "";
        return cat.includes(search) || name.includes(search);
    });
  };

  const handlePointerClick = (index) => {
    setActiveZone(index); 
  };

  const handleSelectProduct = (zoneName, product) => {
    setKitchenSelections((prev) => ({ ...prev, [zoneName]: product }));
    
    setSelectionOrder(prev => {
        if (prev.includes(zoneName)) return prev;
        return [...prev, zoneName];
    });

    setActiveZone(null); 
    
    setTimeout(() => {
      const container = document.getElementById('configuration-grid');
      if(container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const handleRemoveSelection = (zoneName) => {
    const newSelections = { ...kitchenSelections };
    delete newSelections[zoneName];
    setKitchenSelections(newSelections);

    setSelectionOrder(prev => prev.filter(z => z !== zoneName));
  };

  const handleViewDetails = (product) => {
    navigate(`/product-details/${product._id}`);
  };

  const handleAddToCartAll = async () => {
    const items = Object.values(kitchenSelections);
    if (items.length === 0) return alert("Select at least one masterpiece for your kitchen.");
    if (!token) {
        alert("Please Log In or Sign Up to save your project.");
        return;
    }

    setAddingToCart(true);
    try {
        for (const item of items) {
            await axios.post(`${BACKEND_URL}/api/cart/add`, 
                { productId: item._id, quantity: 1 }, 
                { headers: { 'auth-token': token } }
            );
        }
        await refreshCart();
        navigate('/cart');
    } catch (err) {
        alert("Error saving configuration to your portfolio.");
    } finally {
        setAddingToCart(false);
    }
  };

  const sortedPositions = [...selectedLayout.positions].sort((a, b) => {
      const indexA = selectionOrder.indexOf(a.name);
      const indexB = selectionOrder.indexOf(b.name);

      if (indexA !== -1 && indexB !== -1) return indexA - indexB; 
      if (indexA !== -1) return -1; 
      if (indexB !== -1) return 1;  
      return 0; 
  });

  const activeZoneName = activeZone !== null ? selectedLayout.positions[activeZone].name : "";
  const availableProducts = activeZone !== null ? getZoneProducts(activeZoneName) : [];
  const totalPrice = Object.values(kitchenSelections).reduce((acc, i) => acc + (i.price || 0), 0);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans overflow-x-hidden">
      
      {/* ================= SECTION 1: VISUALIZER ================= */}
      <div className="relative w-full h-[75vh] md:h-[90vh] bg-black overflow-hidden shadow-2xl">
        
        <img 
          src={selectedLayout.image} 
          alt={selectedLayout.name} 
          className="w-full h-full object-cover opacity-80 transition-transform duration-[20s] hover:scale-110 ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />

        <div className="absolute top-0 left-0 w-full px-6 pt-24 md:px-12 md:pt-32 flex justify-between items-start z-20 pointer-events-none">
            <div className="pointer-events-auto">
                <button onClick={() => navigate(-1)} className="text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Change Layout
                </button>
                <div className="flex items-center gap-3 mb-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-500 text-[10px] font-bold tracking-[0.3em] uppercase">Interactive Studio</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tight drop-shadow-lg">
                    {selectedLayout.name}
                </h1>
            </div>
            
            <button 
                onClick={() => navigate('/3d-tour')}
                className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all text-white text-[10px] font-bold uppercase tracking-widest mt-4 pointer-events-auto"
            >
                <Video className="w-4 h-4" /> View 3D Tour
            </button>
        </div>

        {/* ================= PROMINENT & EASY-TO-CLICK HOTSPOTS ================= */}
        {selectedLayout.positions.map((pos, i) => {
            const isSelected = !!kitchenSelections[pos.name];
            return (
            <div
                key={i}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 group"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
                {/* MASSIVE Click Area for perfect UX on touch and mouse */}
                <button
                    onClick={() => handlePointerClick(i)}
                    className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full cursor-pointer focus:outline-none"
                >
                    {isSelected ? (
                        // IF SELECTED: Bigger Green Dot
                        <span className="w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.9)] border-2 border-white transition-all duration-300 group-hover:scale-125" />
                    ) : (
                        // IF UNSELECTED: Bigger Blinking Ring + Visible Center Anchor Dot
                        <>
                            {/* The blinking ring (Larger) */}
                            <span className="absolute w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-white/80 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                            {/* A solid center dot so users clearly see where to click */}
                            <span className="w-3 h-3 md:w-4 md:h-4 bg-white/80 group-hover:bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300 group-hover:scale-150" />
                        </>
                    )}
                </button>

                {/* Larger & Clearer Tooltip */}
                <div className="absolute bottom-[75%] left-1/2 -translate-x-1/2 mb-2 px-4 py-2 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg text-white text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0 shadow-2xl">
                    {pos.name}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-black/90"></div>
                </div>
            </div>
            );
        })}

        {/* ================= RIGHT SIDEBAR (The Selection Panel) ================= */}
        <div 
            className={`absolute top-0 right-0 h-full w-full md:w-[450px] bg-[#0a0a0a]/95 backdrop-blur-2xl border-l border-white/10 z-40 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col shadow-[-30px_0_60px_rgba(0,0,0,0.7)] pt-20 md:pt-24
            ${activeZone !== null ? "translate-x-0" : "translate-x-full"}`}
        >
            <div className="p-8 border-b border-white/10 flex justify-between items-start bg-gradient-to-b from-white/5 to-transparent">
                <div>
                    <span className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.3em]">Catalog</span>
                    <h2 className="text-3xl font-serif text-white mt-2 tracking-wide">{activeZoneName}</h2>
                </div>
                <button onClick={() => setActiveZone(null)} className="p-2.5 bg-white/5 hover:bg-white/20 rounded-full text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {availableProducts.length > 0 ? availableProducts.map((prod, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={prod._id} 
                        onClick={() => handleSelectProduct(activeZoneName, prod)}
                        className="group relative flex items-center gap-5 p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer overflow-hidden"
                    >
                        <div className="w-24 h-24 bg-white rounded-xl flex-shrink-0 flex items-center justify-center p-3 shadow-inner group-hover:scale-105 transition-transform">
                            <img src={getImgUrl(prod.image)} alt={prod.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                        </div>
                        
                        <div className="flex-1 min-w-0 py-2">
                            <p className="text-[9px] text-amber-500 uppercase tracking-widest font-bold mb-1">{prod.brand || 'Premium'}</p>
                            <h4 className="text-white font-medium text-sm leading-snug line-clamp-2 mb-2 group-hover:text-amber-400 transition-colors">{prod.name}</h4>
                            <span className="text-white font-serif font-bold tracking-wide">₹{prod.price?.toLocaleString()}</span>
                        </div>

                        <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                                <Plus className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    </motion.div>
                )) : (
                    <div className="text-center py-32 flex flex-col items-center">
                        <Search className="w-12 h-12 text-white/20 mb-4" />
                        <p className="text-white/50 text-sm">No premium appliances found in this category.</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* ================= SECTION 2: THE CONFIGURATION GRID ================= */}
      <div id="configuration-grid" className="container mx-auto px-6 md:px-12 max-w-[1400px] py-16 md:py-24">
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12 border-b border-gray-200 pb-8">
            <div>
                <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4 tracking-tight">Your Custom Build</h2>
                <p className="text-sm text-gray-500 flex items-center gap-2 font-medium">
                    <span className="bg-gray-100 text-gray-900 px-2 py-0.5 rounded text-xs font-bold">{Object.keys(kitchenSelections).length} of {selectedLayout.positions.length}</span>
                    Positions Configured
                </p>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto bg-white p-4 md:p-6 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100">
                <div className="text-right hidden md:block pr-6 border-r border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-1">Total Investment</p>
                    <p className="text-3xl font-serif font-bold text-gray-900">₹{totalPrice.toLocaleString()}</p>
                </div>
                <button 
                    onClick={handleAddToCartAll}
                    disabled={addingToCart || Object.keys(kitchenSelections).length === 0}
                    className="flex-1 md:flex-none bg-gray-900 text-white px-8 py-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-amber-600 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:bg-gray-900 shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5"
                >
                    {addingToCart ? <Loader2 className="animate-spin w-4 h-4"/> : <ShoppingCart className="w-4 h-4" />}
                    {addingToCart ? "Saving Build..." : "Add Build to Cart"}
                </button>
            </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
            {sortedPositions.map((pos) => {
                const item = kitchenSelections[pos.name];
                const isSelected = !!item;

                return (
                    <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        key={pos.name} 
                        className={`flex flex-col h-[380px] rounded-3xl border transition-all duration-500 overflow-hidden group 
                            ${isSelected 
                                ? "bg-white border-transparent shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] ring-1 ring-gray-100" 
                                : "bg-gray-50/50 border-dashed border-gray-300 hover:border-amber-400 hover:bg-amber-50/30"
                            }`}
                    >
                        <div className="p-5 flex justify-between items-center z-10 relative">
                            <span className={`text-[10px] font-extrabold uppercase tracking-[0.2em] px-3 py-1 rounded-full ${isSelected ? 'bg-green-50 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                {pos.name}
                            </span>
                            {isSelected && (
                                <button onClick={() => handleRemoveSelection(pos.name)} className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors shadow-sm">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        <div className="flex-1 px-6 pb-6 flex flex-col items-center text-center relative">
                            {isSelected ? (
                                <>
                                    <div className="w-full h-40 mb-6 relative flex items-center justify-center">
                                        <img src={getImgUrl(item.image)} alt={item.name} className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-xl group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    
                                    <div className="w-full mt-auto">
                                        <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">{item.brand || 'Premium'}</p>
                                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-3 leading-snug">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center justify-between mt-4">
                                            <p className="text-lg text-gray-900 font-serif font-bold">₹{item.price?.toLocaleString()}</p>
                                            <button 
                                                onClick={() => handleViewDetails(item)}
                                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 w-full flex flex-col items-center justify-center mt-[-20px]">
                                    <div className="w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 text-gray-300 group-hover:bg-amber-50 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                                        <Plus className="w-8 h-8" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-2">Slot Empty</h3>
                                    <p className="text-xs text-gray-500 mb-6 font-light px-4">Tap below to browse the catalog and add a {pos.name}.</p>
                                    <button 
                                        onClick={() => {
                                            const index = selectedLayout.positions.findIndex(p => p.name === pos.name);
                                            handlePointerClick(index);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="w-full bg-white border border-gray-200 text-gray-900 text-[10px] font-bold uppercase tracking-widest py-3.5 rounded-xl hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                                    >
                                        Choose Appliance
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
            })}
            </AnimatePresence>
        </motion.div>
      </div>

    </div>
  );
}