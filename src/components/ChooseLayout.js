import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import { 
  X, Plus, Check, ArrowRight, ShoppingCart, 
  Trash2, Video, Eye, Info 
} from "lucide-react";

// Layout Data
const kitchenLayouts = [
  {
    id: 1,
    name: "L-Shaped Kitchen",
    fancyName: "The Corner Masterpiece",
    image: require("../assests/layouts/L-shaped.jpg"), 
    positions: [
      { x: 27, y: 27, name: "Chimney" },
      { x: 32, y: 55, name: "Hob" },
      { x: 82, y: 55, name: "Oven" },
      { x: 51, y: 55, name: "Sink" },
      { x: 82, y: 30, name: "Referigerators" },
    ],
  },
  {
    id: 2,
    name: "U-Shaped Kitchen",
    fancyName: "The Ultimate Triangle",
    image: require("../assests/layouts/U-shaped.jpg"),
    positions: [
      { x: 42, y: 27, name: "Chimney" },
      { x: 43, y: 55, name: "Hob" },
      { x: 70, y: 27, name: "Oven" },
      { x: 10, y: 55, name: "Sink" },
      { x: 25, y: 80, name: "Referigerators" },
    ],
  },
  // ... Baaki layouts same rahenge
  {
    id: 3,
    name: "Galley Kitchen",
    image: require("../assests/layouts/Galley-shaped.jpg"),
    positions: [{ x: 63, y: 60, name: "Hob" }],
  },
  {
    id: 4,
    name: "One Wall Kitchen",
    image: require("../assests/layouts/Onewall-shaped.jpg"),
    positions: [
      { x: 18, y: 60, name: "Referigerators" },
      { x: 86, y: 40, name: "Oven" },
    ],
  },
  {
    id: 5,
    name: "Peninsula Kitchen",
    image: require("../assests/layouts/Penisula-shaped.jpg"),
    positions: [
      { x: 52, y: 27, name: "Oven" },
      { x: 47, y: 55, name: "Hob" },
      { x: 64, y: 55, name: "Sink" },
      { x: 15, y: 55, name: "Referigerators" },
    ],
  },
  {
    id: 6,
    name: "Island Kitchen",
    image: require("../assests/layouts/Island-shaped.jpeg"),
    positions: [
      { x: 30, y: 50, name: "Oven" },
      { x: 48, y: 50, name: "Hob" },
    ],
  },
];

export default function ChooseLayout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [activeZone, setActiveZone] = useState(null); 
  const [kitchenSelections, setKitchenSelections] = useState({});
  const [dbProducts, setDbProducts] = useState([]);

  const selectedLayout = kitchenLayouts.find((l) => l.id === parseInt(id));

  // --- Mock Fetch ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setDbProducts(res.data);
      } catch (error) {
        console.log("Using Mock Data");
      }
    };
    fetchProducts();
  }, []);

  if (!selectedLayout) return <div className="h-screen flex items-center justify-center bg-black text-white">Layout Not Found</div>;

  // Helpers
  const getZoneProducts = (zoneName) => {
    return dbProducts.filter(p => p.category.toLowerCase().includes(zoneName.toLowerCase()) || p.name.includes(zoneName));
  };

  const handlePointerClick = (index) => {
    setActiveZone(index); 
  };

  const handleSelectProduct = (zoneName, product) => {
    setKitchenSelections((prev) => ({ ...prev, [zoneName]: product }));
    setActiveZone(null); 
    
    // Smooth scroll to bottom
    setTimeout(() => {
      const container = document.getElementById('product-container');
      if(container) container.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleRemoveSelection = (zoneName) => {
    const newSelections = { ...kitchenSelections };
    delete newSelections[zoneName];
    setKitchenSelections(newSelections);
  };

  const handleViewDetails = (product) => {
    navigate(`/product-details/${product._id}`);
  };

  const handleAddToCartAll = () => {
    alert("Products added to cart!");
  };

  const activeZoneName = activeZone !== null ? selectedLayout.positions[activeZone].name : "";
  const availableProducts = activeZone !== null ? getZoneProducts(activeZoneName) : [];
  const totalPrice = Object.values(kitchenSelections).reduce((acc, i) => acc + i.price, 0);

  return (
    <div className="min-h-screen bg-neutral-900 font-sans">
      
      {/* ================= SECTION 1: VISUALIZER (TOP - 85% Height) ================= */}
      <div className="relative w-full h-[85vh] mt-[100px]  bg-black overflow-hidden group">
        
        {/* Main Image */}
        <img 
          src={selectedLayout.image} 
          alt="Layout" 
          className="w-full h-full object-cover opacity-80 transition-transform duration-700 hover:scale-105" 
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />

        {/* Header Overlay */}
        <div className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-start z-20">
            <div>
                <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white text-xs uppercase tracking-widest mb-3 flex items-center gap-2 transition-colors">
                    <ArrowRight className="w-4 h-4 rotate-180" /> Back to Designs
                </button>
                <h1 className="text-3xl md:text-5xl font-serif text-white tracking-wide">{selectedLayout.name}</h1>
            </div>
            
            <button 
                onClick={() => navigate('/3d-tour')}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full hover:bg-amber-600 transition-all text-white text-xs font-bold uppercase tracking-widest"
            >
                <Video className="w-4 h-4" /> 3D Tour
            </button>
        </div>

        {/* Hotspots */}
        {selectedLayout.positions.map((pos, i) => {
            const isSelected = !!kitchenSelections[pos.name];
            return (
            <div
                key={i}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
                <button
                onClick={() => handlePointerClick(i)}
                className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)]
                    ${isSelected ? "bg-green-500 border-2 border-white scale-110" : "bg-white/20 backdrop-blur-xl border border-white/80 hover:bg-amber-500 hover:border-amber-500 hover:scale-110"}`}
                >
                {isSelected ? <Check className="w-5 h-5 text-white" /> : <Plus className="w-6 h-6 text-white" />}
                </button>
                
                {/* Label below dot */}
                <div className="absolute top-14 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold uppercase tracking-[0.2em] text-shadow-sm whitespace-nowrap bg-black/60 backdrop-blur-md px-3 py-1 rounded border border-white/10">
                    {pos.name}
                </div>
            </div>
            );
        })}

        {/* ================= 4. RIGHT SIDEBAR (SLIDING GLASS PANEL) - FIXED DESIGN ================= */}
        <div 
            className={`absolute top-0 right-0 h-full w-full md:w-[450px] bg-[#0a0a0a]/95 backdrop-blur-2xl border-l border-white/10 z-40 transform transition-transform duration-500 ease-in-out flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]
            ${activeZone !== null ? "translate-x-0" : "translate-x-full"}`}
        >
            {/* Panel Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div>
                    <span className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.2em]">Select Appliance</span>
                    <h2 className="text-2xl font-serif text-white mt-1 tracking-wide">{activeZoneName}</h2>
                </div>
                <button onClick={() => setActiveZone(null)} className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Product List inside Sidebar (Fixed: Row Layout instead of Grid) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {availableProducts.length > 0 ? availableProducts.map(prod => (
                    <div 
                        key={prod._id} 
                        onClick={() => handleSelectProduct(activeZoneName, prod)}
                        // 👇 Styling updated for "Glass Row" look
                        className="group relative flex items-center gap-4 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer overflow-hidden"
                    >
                        {/* Image Container */}
                        <div className="w-20 h-20 bg-white rounded-lg flex-shrink-0 flex items-center justify-center p-2">
                            <img src={prod.image} alt="" className="max-h-full max-w-full object-contain" />
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm line-clamp-1 mb-1">{prod.name}</h4>
                            <div className="flex items-center gap-3">
                                <span className="text-amber-500 font-bold text-sm">₹{prod.price.toLocaleString()}</span>
                                <span className="text-white/30 text-xs line-through">₹{(prod.price * 1.2).toFixed(0)}</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <span className="text-[9px] bg-white/10 text-white/60 px-2 py-0.5 rounded border border-white/5 uppercase tracking-wider">Standard</span>
                            </div>
                        </div>

                        {/* Select Arrow Icon (Visible on Hover) */}
                        <div className="pr-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                             <ArrowRight className="w-5 h-5 text-amber-500" />
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20">
                        <p className="text-white/40 text-sm">No products found for this category.</p>
                    </div>
                )}
            </div>
        </div>

      </div>


    {/* ================= SECTION 2: ACTION BAR & GRID (BOTTOM) ================= */}
      <div id="product-container" className="container mx-auto px-4 max-w-7xl -mt-8 relative z-30 mb-20">
        
        {/* 1. Action Bar */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h2 className="text-xl font-serif font-bold text-gray-900">Your Configuration</h2>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    {Object.keys(kitchenSelections).length} / {selectedLayout.positions.length} Items Selected
                </p>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="text-right hidden md:block">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total Estimate</p>
                    <p className="text-2xl font-serif font-bold text-gray-900">₹{totalPrice.toLocaleString()}</p>
                </div>
                <button 
                    onClick={handleAddToCartAll}
                    className="flex-1 md:flex-none bg-black text-white px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                    <ShoppingCart className="w-4 h-4" /> Buy All Items
                </button>
            </div>
        </div>

        {/* 2. Container Wise Grid (The Cards - 3 per row on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedLayout.positions.map((pos, i) => {
                const item = kitchenSelections[pos.name];

                return (
                    <div key={i} className={`flex flex-col h-full rounded-2xl border transition-all duration-300 overflow-hidden group ${item ? "bg-white border-green-200 shadow-md ring-1 ring-green-100" : "bg-white border-dashed border-gray-300 hover:border-gray-400"}`}>
                        
                        {/* Header of Card */}
                        <div className={`p-4 border-b flex justify-between items-center ${item ? "bg-green-50/50 border-green-100" : "bg-gray-50 border-gray-200"}`}>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{pos.name}</span>
                            {item && (
                                <button onClick={() => handleRemoveSelection(pos.name)} className="text-gray-400 hover:text-red-500 transition-colors" title="Remove Item">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Body of Card */}
                        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                            {item ? (
                                // FILLED CARD
                                <>
                                    <div className="w-40 h-40 mb-6 p-4 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                        <img src={item.image} alt="" className="max-h-full max-w-full object-contain" />
                                    </div>
                                    
                                    <div className="w-full mb-4">
                                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1 min-h-[40px] leading-relaxed">
                                            {item.name}
                                        </h3>
                                        <p className="text-lg text-amber-600 font-bold font-serif">₹{item.price.toLocaleString()}</p>
                                    </div>
                                    
                                    {/* View Details Button */}
                                    <button 
                                        onClick={() => handleViewDetails(item)}
                                        className="w-full py-3 border border-gray-200 rounded-lg text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Eye className="w-3 h-3" /> View Details
                                    </button>
                                </>
                            ) : (
                                // EMPTY CARD
                                <>
                                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-400 group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors">
                                        <Plus className="w-8 h-8" />
                                    </div>
                                    <p className="text-sm text-gray-400 mb-6 font-medium">No product selected</p>
                                    <button 
                                        onClick={() => handlePointerClick(i)}
                                        className="text-amber-600 text-xs font-bold uppercase hover:bg-amber-50 px-6 py-3 rounded-full transition-all border border-transparent hover:border-amber-200"
                                    >
                                        Select {pos.name} Now
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

    </div>
  );
}