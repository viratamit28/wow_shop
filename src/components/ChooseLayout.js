import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import video from "../video/Video_tour.mp4";
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";

// ==================== ALL LAYOUTS (Same Data) ====================
const kitchenLayouts = [
  {
    id: 1,
    name: "L-Shaped Kitchen",
    fancyName: "The Corner Masterpiece",
    image: require("../assests/layouts/L-shaped.jpg"),
    videoUrl: video,
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
    videoUrl: video,
    positions: [
      { x: 27, y: 27, name: "Chimney" },
      { x: 32, y: 55, name: "Hob" },
      { x: 82, y: 55, name: "Oven" },
      { x: 51, y: 55, name: "Sink" },
      { x: 82, y: 30, name: "Referigerators" },
    ],
  },
  {
    id: 3,
    name: "Galley Kitchen",
    image: require("../assests/layouts/Galley-shaped.jpg"),
    videoUrl: video,
    positions: [{ x: 50, y: 50, name: "Hob" }],
  },
  {
    id: 4,
    name: "One Wall Kitchen",
    image: require("../assests/layouts/Onewall-shaped.jpg"),
    videoUrl: video,
    positions: [{ x: 50, y: 50, name: "Referigerators" }],
  },
  {
    id: 5,
    name: "Penisula Kitchen",
    image: require("../assests/layouts/Penisula-shaped.jpg"),
    videoUrl: video,
    positions: [{ x: 50, y: 50, name: "Sink" }],
  },
  {
    id: 6,
    name: "Island Kitchen",
    image: require("../assests/layouts/Island-shaped.jpeg"),
    videoUrl: video,
    positions: [{ x: 50, y: 50, name: "Oven" }],
  },
];

export default function ChooseLayout() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Context
  const { token, user } = useContext(AuthContext);

  // State
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [selectedAppliances, setSelectedAppliances] = useState([]);
  const [activeZone, setActiveZone] = useState(null);
  const [showProductList, setShowProductList] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showScrollNotification, setShowScrollNotification] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  const selectedLayout = kitchenLayouts.find((l) => l.id === parseInt(id));

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setDbProducts(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch Cart on Load
  useEffect(() => {
    const fetchUserCart = async () => {
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/cart', {
            headers: { 'auth-token': token }
          });
          const cartProducts = res.data.map(item => item.productId);
          setSelectedAppliances(cartProducts);
        } catch (err) {
          console.error("Error fetching cart", err);
        }
      }
    };
    fetchUserCart();
  }, [token]);

  if (!selectedLayout) return <div className="text-white">Layout not found</div>;

  // Cart Logic
  const handleSelectAppliance = async (appliance) => {
    if (!token) {
      alert("Please Login first to create your kitchen layout!");
      return;
    }

    setCartLoading(true);
    const isAlreadySelected = selectedAppliances.find((i) => i._id === appliance._id);

    try {
      if (isAlreadySelected) {
        await axios.post('http://localhost:5000/api/cart/remove', 
          { productId: appliance._id },
          { headers: { 'auth-token': token } }
        );
        setSelectedAppliances((prev) => prev.filter((i) => i._id !== appliance._id));
      } else {
        await axios.post('http://localhost:5000/api/cart/add', 
          { productId: appliance._id, quantity: 1 },
          { headers: { 'auth-token': token } }
        );
        setSelectedAppliances((prev) => [...prev, appliance]);
        setShowScrollNotification(true);
        setTimeout(() => setShowScrollNotification(false), 4000);
      }
    } catch (error) {
      console.error("Cart Update Failed", error);
      alert("Failed to update cart. Please try again.");
    } finally {
      setCartLoading(false);
    }
  };

  const getAppliancesForZone = (zoneName) =>
    dbProducts.filter((a) => a.category === zoneName);

  const activePointData = activeZone !== null ? selectedLayout.positions[activeZone] : null;
  const activeZoneProducts = activePointData ? getAppliancesForZone(activePointData.name) : [];

  // === DOT COMPONENT ===
  const PositionPoint = ({ point, index }) => {
    const isActive = activeZone === index;

    return (
      <div
        className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-30"
        style={{ left: `${point.x}%`, top: `${point.y}%` }}
        onMouseEnter={() => !showProductList && setHoveredPoint(index)}
        onMouseLeave={() => setHoveredPoint(null)}
        onClick={(e) => {
          e.stopPropagation();
          if (activeZone === index && showProductList) {
            setShowProductList(false);
            setActiveZone(null);
          } else {
            setActiveZone(index);
            setShowProductList(true);
          }
        }}
      >
        <div className="relative group">
          <div className={`absolute inset-0 w-16 h-16 rounded-full border-2 ${isActive ? "border-amber-400" : "border-white"} animate-ping opacity-40`} />
          <div className={`relative w-12 h-12 rounded-full border-2 border-white/50 backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.5)] flex items-center justify-center font-serif text-lg transition-all duration-300 ${isActive ? "bg-amber-500 text-black scale-110" : "bg-black/60 text-white hover:bg-black/80 hover:scale-105"}`}>
            {index + 1}
          </div>
        </div>
        
        {hoveredPoint === index && !showProductList && (
          <div className="absolute left-1/2 -top-14 -translate-x-1/2 bg-black/90 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-full text-sm uppercase tracking-widest whitespace-nowrap z-40 shadow-2xl">
            {point.name}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black/90"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      
      {/* 1. MAIN IMAGE AREA */}
      <div className="relative w-full mt-16 h-screen overflow-hidden">
        <img src={selectedLayout.image} alt={selectedLayout.name} className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

        <div className="absolute top-8 left-8 z-20 pointer-events-none">
           <h1 className="text-5xl font-serif text-white mb-2">{selectedLayout.name}</h1>
           <p className="text-amber-500 tracking-widest uppercase text-sm font-bold">{selectedLayout.fancyName}</p>
        </div>

        {selectedLayout.positions.map((pos, i) => (
          <PositionPoint key={i} point={pos} index={i} />
        ))}

        <button onClick={() => setIsVideoOpen(true)} className="absolute top-8 right-8 z-40 group bg-white/10 backdrop-blur-md border border-white/20 hover:border-amber-500/50 hover:bg-black/80 text-white px-6 py-3 rounded-full flex items-center gap-3 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
          <span className="uppercase tracking-wider text-xs font-bold">Start 3D Tour</span>
        </button>

        {/* 2. PRODUCT SELECTION DRAWER */}
        {showProductList && activePointData && (
          <>
            <div className="absolute inset-0 z-40 cursor-default" onClick={() => { setShowProductList(false); setActiveZone(null); }} />
            <div className="absolute bottom-0 left-0 w-full z-50 animate-slide-up" onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-t from-black via-black/95 to-transparent pt-16 pb-32">
                <div className="px-8 mb-4 flex items-center gap-3">
                   <div className="h-[1px] w-8 bg-amber-500"></div>
                   <span className="text-amber-500 text-sm font-bold uppercase tracking-widest">
                      Available {activePointData.name === "Referigerators" ? "Refrigerators" : activePointData.name}
                   </span>
                </div>
                <div className="px-8 overflow-x-auto no-scrollbar">
                  {loading ? (
                    <div className="text-white/50">Loading...</div>
                  ) : activeZoneProducts.length === 0 ? (
                    <div className="text-white/50">Coming Soon</div>
                  ) : (
                    <div className="flex gap-5 min-w-max">
                      {activeZoneProducts.slice(0, 6).map((p) => {
                        const isSelected = selectedAppliances.find((s) => s._id === p._id);
                        return (
                          <div 
                            key={p._id} 
                            className={`relative w-64 group cursor-pointer rounded-xl overflow-hidden border border-white/10 hover:border-amber-500/50 transition-all transform hover:-translate-y-2 duration-300 ${isSelected ? "ring-2 ring-amber-500 scale-[1.02]" : ""}`}
                            onClick={() => handleSelectAppliance(p)}
                          >
                            <div className="h-40 overflow-hidden">
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                              
                              <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                                <button className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ${isSelected ? "bg-red-500 text-white" : "bg-white text-black"}`}>
                                    {isSelected ? "Remove" : "Add to Layout"}
                                </button>
                              </div>
                            </div>
                            <div className="p-4 bg-neutral-900/95 backdrop-blur-sm">
                              <h3 className="text-white text-sm font-medium truncate">{p.name}</h3>
                              <p className="text-amber-500 font-bold text-lg mt-1">₹{p.price.toLocaleString()}</p>
                            </div>
                          </div>
                        );
                      })}
                      <div 
                        className="w-32 flex flex-col items-center justify-center border border-white/10 rounded-xl hover:bg-white/5 cursor-pointer transition text-white/70 hover:text-amber-500 gap-2"
                        onClick={() => navigate("/view-all-products", { state: { zoneName: activePointData.name, zoneProducts: activeZoneProducts } })}
                      >
                         <div className="text-3xl font-light">→</div>
                         <span className="text-xs font-bold uppercase tracking-widest">View All</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. FLOATING DOCK (Selected Items & Compare) - UPDATED FOR CART */}
      {selectedAppliances.length > 0 && (
        <div className="fixed bottom-8 left-0 w-full z-[60] flex justify-center px-4 animate-slide-up">
           <div className="bg-black/80 backdrop-blur-xl border border-white/15 rounded-full shadow-2xl pl-2 pr-2 py-2 flex items-center gap-6 max-w-5xl w-full">
              
              {/* Count Badge */}
              <div className="hidden md:flex flex-col pl-6">
                 <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Selection</span>
                 <span className="text-white font-serif text-lg leading-none">{selectedAppliances.length} Items</span>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-10 bg-white/10"></div>

              {/* Thumbnails */}
              <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar px-2">
                 {selectedAppliances.map((item) => (
                    <div key={item._id} className="relative group shrink-0">
                       <img src={item.image} className="w-12 h-12 rounded-full object-cover border-2 border-white/20 group-hover:border-amber-500 transition-colors" alt={item.name} />
                       <button 
                          onClick={() => handleSelectAppliance(item)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                       >
                          ×
                       </button>
                    </div>
                 ))}
              </div>

              {/* Action Buttons Group - UPDATED */}
              <div className="flex gap-2 pr-1">
                 
                 {/* Compare Button */}
                 {selectedAppliances.length > 1 && (
                   <button 
                     onClick={() => setShowCompareModal(true)}
                     className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest transition border border-white/5"
                   >
                      Compare
                   </button>
                 )}

                 {/* Checkout Button - Directly Navigates to Cart */}
                 <button 
                   onClick={() => navigate("/cart")}
                   className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] transform hover:-translate-y-0.5"
                 >
                    Checkout ({selectedAppliances.length})
                 </button>
              </div>

           </div>
        </div>
      )}

      {/* 4. COMPARISON MODAL */}
      {showCompareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowCompareModal(false)}>
           <div className="bg-neutral-900 w-full max-w-6xl max-h-[85vh] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                 <div>
                    <h2 className="text-3xl font-serif text-white mb-1">Comparison View</h2>
                    <p className="text-white/50 text-sm">Review specs side-by-side to make the perfect choice.</p>
                 </div>
                 <button onClick={() => setShowCompareModal(false)} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition text-xl">✕</button>
              </div>
              <div className="flex-1 overflow-x-auto p-8 custom-scrollbar bg-neutral-950">
                 <div className="flex gap-8 min-w-max">
                    {selectedAppliances.map((item) => (
                       <div key={item._id} className="w-80 flex-shrink-0 bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-amber-500/30 transition-colors group">
                          <div className="h-60 relative overflow-hidden">
                             <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                             <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white text-xs font-bold uppercase">
                                {item.category || "Appliance"}
                             </div>
                          </div>
                          <div className="p-6 flex-1 flex flex-col">
                             <h3 className="text-xl font-serif text-white mb-2 leading-tight min-h-[3.5rem]">{item.name}</h3>
                             <p className="text-amber-500 text-3xl font-bold mb-6">₹{item.price.toLocaleString()}</p>
                             <div className="flex-1 space-y-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                   <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-2">Description</p>
                                   <p className="text-white/80 text-sm leading-relaxed">{item.description}</p>
                                </div>
                             </div>
                             <button 
                               onClick={() => handleSelectAppliance(item)}
                               className="mt-8 w-full py-4 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition uppercase text-xs font-bold tracking-widest"
                             >
                                Remove
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
      
      {/* Video Tour Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4" onClick={() => setIsVideoOpen(false)}>
           <div className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative" onClick={e=>e.stopPropagation()}>
             <button onClick={() => setIsVideoOpen(false)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition">✕</button>
             <video className="w-full h-full" controls autoPlay><source src={selectedLayout.videoUrl} /></video>
           </div>
        </div>
      )}
    </div>
  );
}