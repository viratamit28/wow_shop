import React, { useState, useEffect, useContext, useRef } from "react";
import { User, Search, ShoppingBag, Menu, X, ArrowRight, ChevronDown, BookOpen, MapPin, Video, Trash2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assests/logo1.png"; 
import { AuthContext } from "../context/AuthContext";
import { LoginModal } from "./LoginModal"; 
import { SignupModal } from "./SignupModal";
import { BookingConsultation } from "./BookingConsultation";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"; 

// --- MEGA MENU DATA ---
const appliancesMenu = {
  categories: [
    { 
      name: "Cooking & Baking", 
      items: [
        { label: "Ovens", dbCategory: "ovens", dbType: "Ovens" },
        { label: "Hobs", dbCategory: "hobs", dbType: "Hobs" },
        { label: "Chimneys", dbCategory: "chimneys", dbType: "Chimneys" },
        { label: "Warmers & Countertops", dbCategory: "countertop", dbType: "Countertop" }
      ] 
    },
    { 
      name: "Laundry Care", 
      items: [
        { label: "Washing Machines & Dryers", dbCategory: "washing", dbType: "Washing" }
      ] 
    },
    { 
      name: "Dishwashers", 
      items: [
        { label: "All Dishwashers", dbCategory: "dishwashers", dbType: "Dishwashers" }
      ] 
    },
    { 
      name: "Cooling", 
      items: [
        { label: "Refrigerators & Freezers", dbCategory: "refrigerators", dbType: "Refrigerators" }
      ] 
    }
  ],
  spotlight: {
    title: "Series 8 Black Steel",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80",
    link: "/products?search=Series 8" 
  }
};

const expertMenu = {
  sections: [
    {
      title: "Knowledge Library",
      mainLink: "/expert/knowledge",
      icon: <BookOpen className="w-5 h-5 text-amber-600" />,
      description: "Explore guides, maintenance tips, and warranty info.",
      items: [
          { label: "Buying Guides", link: "/expert/knowledge?tab=guides" },
          { label: "Appliance Care", link: "/expert/knowledge?tab=care" },
          { label: "Kitchen Planning", link: "/expert/knowledge?tab=planning" },
          { label: "Warranty Info", link: "/expert/knowledge?tab=warranty" }
      ]
    },
    {
      title: "Get Guidance",
      mainLink: "/expert/guidance",
      icon: <MapPin className="w-5 h-5 text-amber-600" />,
      description: "Find verified experts in your city for personalized advice.",
      items: [
          { label: "Find Local Experts", link: "/expert/guidance?filter=local" },
          { label: "Site Visits", link: "/expert/guidance?filter=site-visit" },
          { label: "Video Consultation", link: "/expert/guidance?filter=video" }
      ]
    }
  ],
  promo: {
    title: "Still Confused?",
    subtitle: "Talk to our experts directly.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop", 
  }
};

const menuVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2, ease: "easeIn" } }
};

const mobileMenuVariants = {
  hidden: { x: "100%", opacity: 0.5 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { x: "100%", opacity: 0.5, transition: { duration: 0.3, ease: "easeInOut" } }
};

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, cart, cartCount, logout, removeFromCart } = useContext(AuthContext);

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); 
  const [showSearch, setShowSearch] = useState(false);
  const [authMode, setAuthMode] = useState(null); 
  const [bookingOpen, setBookingOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddedDialog, setShowAddedDialog] = useState(false);
  
  const [isReadyToListen, setIsReadyToListen] = useState(false);
  
  const prevCartCount = useRef(cartCount);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setActiveMenu(null); }, [location]);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
        searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    const delayTimer = setTimeout(() => setIsReadyToListen(true), 1500);
    return () => clearTimeout(delayTimer);
  }, []);

  useEffect(() => {
    if (isReadyToListen && cartCount > prevCartCount.current) {
      if (location.pathname !== '/cart' && location.pathname !== '/consultation') {
        setShowAddedDialog(true);
        const timer = setTimeout(() => setShowAddedDialog(false), 3000); 
        prevCartCount.current = cartCount; 
        return () => clearTimeout(timer);
      }
    }
    prevCartCount.current = cartCount;
  }, [cartCount, location.pathname, isReadyToListen]);

  const isWhiteTheme = isScrolled || activeMenu || showSearch;
  const textColor = isWhiteTheme ? "text-gray-900" : "text-white drop-shadow-md"; 
  const iconColor = isWhiteTheme ? "text-gray-800" : "text-white drop-shadow-md";
  const headerBg = isWhiteTheme 
    ? "bg-white/95 backdrop-blur-xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border-b border-gray-100" 
    : "bg-black/20 backdrop-blur-md border-b border-white/10";

  // Universal Image Helper 
  const getImageUrl = (path) => {
    if (!path) return null;
    let displayImg = Array.isArray(path) ? path[0] : path;
    if (typeof displayImg !== 'string' || !displayImg) return null;
    
    if (displayImg.startsWith('http') || displayImg.startsWith('data:')) {
        return displayImg;
    }
    
    const cleanPath = displayImg.replace(/\\/g, '/');
    return `${BACKEND_URL}/${cleanPath}`;
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ease-in-out ${headerBg}`} onMouseLeave={() => setActiveMenu(null)}>
        
        {/* 🔥 THE NEW PERFECT 3-COLUMN GRID LAYOUT 🔥 */}
        <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-2 lg:grid-cols-3 items-center h-[70px] md:h-[90px]">

            {/* 1. LEFT: LOGO */}
            <div className="col-span-1 flex justify-start items-center">
              <div onClick={() => navigate('/')} className="cursor-pointer group flex items-center">
                 {/* Height increased significantly. Max-width ensures it doesn't break bounds. */}
                 <img 
                   src={logo} 
                   alt="Wow_shop" 
                   className="h-10 md:h-14 lg:h-[75px] w-auto max-w-[200px] lg:max-w-[280px] object-contain origin-left transition-transform duration-500 group-hover:scale-105" 
                 />
              </div>
            </div>

            {/* 2. CENTER: NAVIGATION (Hidden on Mobile) */}
            <nav className="col-span-1 hidden lg:flex justify-center items-center gap-8 xl:gap-12">
              <button onMouseEnter={() => setActiveMenu('appliances')} className={`flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${activeMenu === 'appliances' ? 'text-amber-600' : `${textColor} hover:text-amber-500`}`}>
                Appliances <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeMenu === 'appliances' ? 'rotate-180 text-amber-600' : ''}`} />
              </button>

              <button onMouseEnter={() => setActiveMenu('expert')} className={`flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${activeMenu === 'expert' ? 'text-amber-600' : `${textColor} hover:text-amber-500`}`}>
                Expert Advice <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeMenu === 'expert' ? 'rotate-180 text-amber-600' : ''}`} />
              </button>

              {/* Sleeker Button Design */}
              <button onClick={() => navigate('/kitchen-layout/3d')} className={`relative flex items-center justify-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] px-6 py-2.5 rounded-full border transition-all duration-500 overflow-visible group ${isWhiteTheme ? "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white" : "border-white/50 text-white hover:bg-white hover:text-gray-900"}`}>
                <span>Studio 3D</span>
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm animate-bounce z-10">NEW</span>
              </button>
            </nav>

            {/* 3. RIGHT: ICONS & ACTIONS */}
            <div className="col-span-1 flex justify-end items-center gap-5 lg:gap-7">
              <button onClick={() => setShowSearch(!showSearch)} className={`transition-transform duration-300 hover:scale-110 ${iconColor}`}>
                <Search className="w-5 h-5 stroke-[2]" />
              </button>

              {/* Profile Dropdown */}
              <div className="relative group flex items-center h-full">
                <button onClick={() => !user && setAuthMode('login')} className={`transition-transform duration-300 hover:scale-110 flex items-center justify-center ${iconColor}`}>
                  {user ? (
                    user.profileImage ? (
                      <img src={getImageUrl(user.profileImage)} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-amber-500 shadow-sm" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-[12px] font-bold shadow-sm uppercase">
                        {user.name ? user.name.charAt(0) : 'U'}
                      </div>
                    )
                  ) : (
                    <User className="w-5 h-5 stroke-[2]" />
                  )}
                </button>
                {user && (
                  <div className="absolute top-12 right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] hidden lg:block">
                    <div className="bg-white border border-gray-200 py-4 w-52 shadow-[0_20px_40px_rgba(0,0,0,0.1)] rounded-xl relative before:absolute before:-top-1.5 before:right-3 before:w-3 before:h-3 before:bg-white before:rotate-45 before:border-l before:border-t before:border-gray-200">
                      <p className="px-5 mb-1 text-[13px] font-bold text-gray-900 truncate">Hi, {user.name?.split(' ')[0]}</p>
                      <p className="px-5 mb-3 text-[10px] text-gray-400 truncate border-b border-gray-100 pb-3">{user.email}</p>
                      <div className="flex flex-col gap-1 px-2">
                        <button onClick={() => navigate('/profile')} className="text-left px-3 py-2 rounded-lg text-[13px] text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition-colors">Your Profile</button>
                        <button onClick={() => navigate('/orders')} className="text-left px-3 py-2 rounded-lg text-[13px] text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition-colors">Your Orders</button>
                        <button onClick={() => navigate('/cart')} className="text-left px-3 py-2 rounded-lg text-[13px] font-bold text-gray-900 hover:bg-amber-50 hover:text-amber-600 transition-colors flex items-center justify-between">Portfolio <ArrowRight className="w-3 h-3 text-amber-500"/></button>
                        
                        {user.role === 'admin' && (
                           <button onClick={() => navigate('/admin/add-product')} className="text-left px-3 py-2 rounded-lg text-[13px] text-blue-600 hover:bg-blue-50 font-bold mt-1">Admin Dashboard</button>
                        )}

                        <div className="h-[1px] bg-gray-100 my-1 mx-2" />
                        <button onClick={() => { logout(); setActiveMenu(null); }} className="text-left px-3 py-2 rounded-lg text-[13px] text-red-500 hover:bg-red-50 font-bold transition-colors">Sign Out</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Dropdown */}
              <div className="relative group flex items-center h-full">
                <button onClick={() => navigate('/cart')} className={`relative transition-transform duration-300 hover:scale-110 ${iconColor}`}>
                  <ShoppingBag className="w-5 h-5 stroke-[2]" />
                  {cartCount > 0 && <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[9px] font-bold text-white shadow-md">{cartCount}</span>}
                </button>

                {!showAddedDialog && (
                  <div className="absolute top-12 right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[90] hidden lg:block">
                    <div className="bg-white border border-gray-200 py-4 w-[320px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] rounded-xl relative before:absolute before:-top-1.5 before:right-2 before:w-3 before:h-3 before:bg-white before:rotate-45 before:border-l before:border-t before:border-gray-200">
                      <div className="px-5 flex items-center justify-between mb-3">
                        <p className="text-[13px] font-bold text-gray-900">Your Selection</p>
                        <span className="text-[10px] text-gray-400 font-bold">{cartCount} Items</span>
                      </div>
                      
                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar px-2">
                        {Array.isArray(cart) && cart.length > 0 ? (
                          cart.map((item, i) => {
                            const product = item?.productId || item?.product || item;
                            if (!product || !product._id) return null;

                            return (
                              <div key={product._id || i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 group/item cursor-pointer mb-1 transition-colors" onClick={() => navigate(`/product-details/${product._id}`)}>
                                <div className="w-14 h-14 bg-gray-100 rounded-lg p-1.5 shrink-0 flex items-center justify-center">
                                  <img 
                                    src={getImageUrl(product.Image) || 'https://placehold.co/50x50?text=No+Img'} 
                                    className="max-w-full max-h-full object-contain mix-blend-multiply" 
                                    alt={product.Product_Name || 'product'} 
                                    onError={(e) => { e.target.src = "https://placehold.co/50x50?text=No+Img" }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[12px] font-bold text-gray-900 line-clamp-2 leading-tight group-hover/item:text-amber-600 transition-colors mb-1">{product.Product_Name || 'Unknown Item'}</p>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qty: {item.quantity || 1}</p>
                                </div>
                                <button 
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        removeFromCart(product._id); 
                                    }} 
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-red-500 z-10 transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )
                          })
                        ) : (
                          <div className="px-5 py-8 text-center flex flex-col items-center">
                             <ShoppingBag className="w-8 h-8 text-gray-200 mb-3" strokeWidth={1} />
                             <p className="text-[12px] text-gray-500 font-light">Your portfolio is empty.</p>
                          </div>
                        )}
                      </div>
                      
                      {cartCount > 0 && (
                        <div className="px-4 pt-4 mt-2 border-t border-gray-100">
                          <button onClick={() => navigate('/cart')} className="w-full bg-gray-900 hover:bg-amber-600 text-white py-3.5 rounded-lg text-[11px] font-bold tracking-[0.2em] uppercase transition-colors shadow-md flex justify-center items-center gap-2">
                             View Portfolio <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {showAddedDialog && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      className="absolute top-12 right-0 mt-3 p-5 w-72 bg-white border border-gray-200 shadow-2xl rounded-2xl z-[110] before:absolute before:-top-1.5 before:right-3 before:w-3 before:h-3 before:bg-white before:rotate-45 before:border-l before:border-t before:border-gray-200 hidden lg:block"
                    >
                      <button onClick={() => setShowAddedDialog(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-900"><X className="w-4 h-4"/></button>
                      <div className="flex items-start gap-4 mt-1">
                         <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0 border border-green-100">
                            <CheckCircle className="w-5 h-5" />
                         </div>
                         <div>
                           <p className="text-[14px] font-bold text-gray-900 leading-tight">Masterpiece Added</p>
                           <p className="text-[11px] text-gray-500 mt-1">Your portfolio has been updated.</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => { setShowAddedDialog(false); navigate('/cart'); }} 
                        className="w-full mt-6 bg-gray-900 hover:bg-amber-600 text-white py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                         View Portfolio <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <button onClick={() => setActiveMenu('mobile')} className={`lg:hidden transition-transform duration-300 hover:scale-110 ${textColor}`}>
                <Menu className="w-6 h-6 md:w-7 md:h-7 stroke-[2]" />
              </button>
            </div>
          </div>
        </div>

        {/* === MEGA MENUS & SEARCH OVERLAYS (Unchanged Logic, refined padding) === */}
        <AnimatePresence>
          {activeMenu === 'appliances' && (
            <motion.div variants={menuVariants} initial="hidden" animate="visible" exit="exit" className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-3xl border-t border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] z-40 text-gray-900 rounded-b-[2rem] overflow-hidden hidden lg:block">
              <div className="max-w-[1600px] mx-auto px-12 py-12">
                <div className="grid grid-cols-12 gap-12">
                  <div className="col-span-8 grid grid-cols-3 gap-y-12 gap-x-12 border-r border-gray-100 pr-12">
                    {appliancesMenu.categories.map((cat, idx) => (
                      <div key={idx} className="space-y-6">
                        <h4 className="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-3">{cat.name}</h4>
                        <ul className="space-y-3.5">
                          {cat.items.map((item, i) => (
                            <li key={i}>
                              <button 
                                onClick={() => { 
                                  navigate(`/products?category=${encodeURIComponent(item.dbCategory)}&type=${encodeURIComponent(item.dbType)}`); 
                                  setActiveMenu(null); 
                                }} 
                                className="text-[13px] text-gray-500 hover:text-amber-600 hover:translate-x-2 transition-all duration-300 text-left w-full"
                              >
                                {item.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="col-span-4 pl-4">
                    <div className="relative group cursor-pointer overflow-hidden rounded-2xl h-full min-h-[280px] shadow-lg" onClick={() => { navigate(appliancesMenu.spotlight.link); setActiveMenu(null); }}>
                      <img src={appliancesMenu.spotlight.image} alt="Highlight" className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                        <span className="text-white font-serif text-3xl mb-3">{appliancesMenu.spotlight.title}</span>
                        <span className="text-amber-400 text-[11px] uppercase font-bold tracking-widest flex items-center gap-2 group-hover:text-amber-300 transition-colors">Discover Collection <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" /></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeMenu === 'expert' && (
            <motion.div variants={menuVariants} initial="hidden" animate="visible" exit="exit" className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-3xl border-t border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] py-12 rounded-b-[2rem] overflow-hidden z-40 hidden lg:block">
              <div className="max-w-[1600px] mx-auto px-12">
                <div className="grid grid-cols-12 gap-16"> 
                    <div className="col-span-5 flex flex-col gap-12 py-2">
                        {expertMenu.sections.map((section, idx) => (
                            <div key={idx} className="group">
                                <button onClick={() => { navigate(section.mainLink); setActiveMenu(null); }} className="flex items-center gap-4 text-[14px] font-extrabold text-gray-900 uppercase tracking-widest mb-3 hover:text-amber-600 transition-colors w-full text-left">
                                    <span className="p-2.5 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors shadow-sm">{section.icon}</span> 
                                    {section.title} 
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all"/>
                                </button>
                                <p className="text-[13px] text-gray-500 mb-5 pl-14 leading-relaxed max-w-sm">{section.description}</p>
                                <div className="pl-14 grid grid-cols-2 gap-y-3.5 gap-x-6">
                                    {section.items.map((item, i) => (
                                        <button key={i} onClick={() => { navigate(item.link); setActiveMenu(null); }} className="text-[13px] text-gray-600 hover:text-amber-600 text-left transition-colors flex items-center gap-2 group/item">
                                            <span className="w-1.5 h-1.5 bg-gray-200 rounded-full group-hover/item:bg-amber-600 group-hover/item:scale-125 transition-all"></span>
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="col-span-7 relative rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer" onClick={() => setBookingOpen(true)}>
                        <img src={expertMenu.promo.image} alt="Expert Consultation" className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/60 to-transparent flex flex-col justify-center px-16">
                            <h3 className="text-5xl font-serif text-white mb-4 leading-tight">{expertMenu.promo.title}</h3>
                            <p className="text-gray-300 text-lg mb-10 max-w-md font-light leading-relaxed">{expertMenu.promo.subtitle}</p>
                            <button onClick={(e) => { e.stopPropagation(); setBookingOpen(true); setActiveMenu(null); }} className="w-fit bg-white text-gray-900 px-10 py-4 rounded-xl text-[11px] font-extrabold uppercase tracking-[0.2em] hover:bg-amber-600 hover:text-white transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1">
                                <Video className="w-4 h-4" /> Book Consultation
                            </button>
                        </div>
                    </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
            {showSearch && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-0 left-0 w-full h-[140px] bg-white/95 backdrop-blur-xl flex items-center justify-center z-[100] border-b border-gray-100 shadow-2xl">
                    <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative flex items-center w-full">
                        <Search className="w-8 h-8 text-amber-600 mr-6" strokeWidth={1.5} />
                        
                        <input 
                            ref={searchInputRef}
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && searchQuery.trim()) {
                                    setShowSearch(false);
                                    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                                    setSearchQuery("");
                                }
                            }}
                            placeholder="Type to search masterpieces..." 
                            className="w-full text-3xl md:text-5xl font-serif outline-none bg-transparent placeholder:text-gray-300 text-gray-900 tracking-tight" 
                        />
                        
                        <button onClick={() => setShowSearch(false)} className="absolute right-6 md:right-12 p-2 text-gray-400 hover:text-gray-900 hover:rotate-90 transition-all duration-300">
                            <X className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
                        </button>
                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }} className="absolute bottom-[-10px] left-6 md:left-12 right-6 md:left-12 h-[2px] bg-gradient-to-r from-amber-600 via-amber-400 to-transparent origin-left" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {activeMenu === 'mobile' && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveMenu(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[55] lg:hidden" />
              <motion.div variants={mobileMenuVariants} initial="hidden" animate="visible" exit="exit" className="fixed top-0 right-0 h-full w-[85%] max-w-[400px] bg-white z-[60] shadow-2xl flex flex-col lg:hidden rounded-l-3xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/80 backdrop-blur-md">
                    <img src={logo} alt="Logo" className="h-8 md:h-10 w-auto object-contain" />
                    <button onClick={() => setActiveMenu(null)} className="p-2 bg-white border border-gray-200 rounded-full text-gray-900 hover:bg-gray-100 transition-colors shadow-sm"><X className="w-4 h-4" /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 space-y-10 hide-scrollbar">
                    {appliancesMenu.categories.map((cat, idx) => (
                        <div key={idx} className="group">
                            <h2 className="text-[13px] font-extrabold text-gray-900 mb-5 uppercase tracking-[0.2em]">{cat.name}</h2>
                            <div className="pl-4 border-l-2 border-amber-100 group-hover:border-amber-500 transition-colors duration-300 space-y-4">
                                {cat.items.map((item, i) => (
                                    <button 
                                      key={i} 
                                      onClick={() => { 
                                        navigate(`/products?category=${encodeURIComponent(item.dbCategory)}&type=${encodeURIComponent(item.dbType)}`); 
                                        setActiveMenu(null); 
                                      }} 
                                      className="block text-gray-600 text-[15px] font-light hover:text-amber-600 hover:translate-x-1.5 transition-all text-left w-full"
                                    >
                                      {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Mobile Action Center */}
                <div className="p-6 border-t border-gray-100 bg-white space-y-5">
                    {user ? (
                        <div className="bg-[#F9FAFB] p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-200">
                                {user.profileImage ? (
                                    <img src={getImageUrl(user.profileImage)} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 shadow-sm" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center text-lg font-bold shadow-sm uppercase">
                                        {user.name ? user.name.charAt(0) : 'U'}
                                    </div>
                                )}
                                <div>
                                    <p className="text-base font-bold text-gray-900">Hi, {user.name?.split(' ')[0]}</p>
                                    <p className="text-[12px] text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button onClick={() => { setActiveMenu(null); navigate('/profile'); }} className="text-left text-[14px] text-gray-700 font-medium hover:text-amber-600">My Profile</button>
                                <button onClick={() => { setActiveMenu(null); navigate('/orders'); }} className="text-left text-[14px] text-gray-700 font-medium hover:text-amber-600">My Orders</button>
                                <button onClick={() => { logout(); setActiveMenu(null); }} className="text-left text-[14px] text-red-600 font-bold mt-2">Sign Out</button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => { setAuthMode('login'); setActiveMenu(null); }} className="w-full py-3.5 bg-[#F9FAFB] text-gray-900 font-extrabold uppercase tracking-widest rounded-xl border border-gray-200 text-[11px] hover:bg-gray-100 transition-colors shadow-sm">
                            Log In / Sign Up
                        </button>
                    )}
                    
                    <button onClick={() => setBookingOpen(true)} className="w-full py-4.5 bg-gray-900 text-white uppercase tracking-[0.2em] text-[11px] font-extrabold rounded-xl flex items-center justify-center gap-3 hover:bg-amber-600 transition-colors shadow-xl">
                        <Video className="w-4 h-4" /> Talk to Expert
                    </button>
                </div>
              </motion.div>
            </>
        )}
      </AnimatePresence>

      <LoginModal isOpen={authMode === 'login'} onClose={() => setAuthMode(null)} onSwitchToSignup={() => setAuthMode('signup')} />
      <SignupModal isOpen={authMode === 'signup'} onClose={() => setAuthMode(null)} onSwitchToLogin={() => setAuthMode('login')} />
      <BookingConsultation isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}