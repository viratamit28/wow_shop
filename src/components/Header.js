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
  
  // 🔥 FIX 1: "isReadyToListen" state add kiya hai Context API ke delay ko sambhalne ke liye
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

  // 🔥 FIX 2: 1.5 second ka delay taaki page reload hone par initial cart fetch hone par popup na khule
  useEffect(() => {
    const delayTimer = setTimeout(() => setIsReadyToListen(true), 1500);
    return () => clearTimeout(delayTimer);
  }, []);

  // 🔥 FIX 3: Timer 3 seconds (3000ms) par set kar diya
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
    ? "bg-white/95 backdrop-blur-md py-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border-b border-gray-100" 
    : "bg-black/20 backdrop-blur-sm py-6 border-b border-white/10";

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
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${headerBg}`} onMouseLeave={() => setActiveMenu(null)}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between relative">

            <div className="flex flex-col justify-center w-[200px]">
              <div onClick={() => navigate('/')} className="cursor-pointer group flex items-end gap-2">
                 <img src={logo} alt="Wow_shop" className="h-8 md:h-20 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
                
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-10">
              <button onMouseEnter={() => setActiveMenu('appliances')} className={`flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wider transition-all duration-300 ${activeMenu === 'appliances' ? 'text-amber-600' : `${textColor} hover:text-amber-500`}`}>
                Appliances <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeMenu === 'appliances' ? 'rotate-180 text-amber-600' : ''}`} />
              </button>

              <button onMouseEnter={() => setActiveMenu('expert')} className={`flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wider transition-all duration-300 ${activeMenu === 'expert' ? 'text-amber-600' : `${textColor} hover:text-amber-500`}`}>
                Expert Advice <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeMenu === 'expert' ? 'rotate-180 text-amber-600' : ''}`} />
              </button>

              <button onClick={() => navigate('/kitchen-layout/3d')} className={`relative text-[11px] font-bold uppercase tracking-widest px-6 py-2.5 rounded transition-all duration-500 overflow-hidden group ${isWhiteTheme ? "bg-gray-900 text-white hover:bg-amber-600 shadow-md hover:shadow-lg hover:-translate-y-0.5" : "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-amber-600 hover:border-amber-600"}`}>
                <span className="relative z-10">Kitchen Studio 3D</span>
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse z-10">NEW</span>
              </button>
            </nav>

            <div className="flex items-center justify-end gap-6 w-[200px]">
              <button onClick={() => setShowSearch(!showSearch)} className={`transition-all duration-300 hover:scale-110 ${iconColor}`}>
                <Search className="w-5 h-5 stroke-[2]" />
              </button>

              <div className="relative group flex items-center">
                <button onClick={() => !user && setAuthMode('login')} className={`transition-all duration-300 hover:scale-105 flex items-center justify-center ${iconColor}`}>
                  {user ? (
                    user.profileImage ? (
                      <img src={getImageUrl(user.profileImage)} alt="Profile" className="w-7 h-7 rounded-full object-cover border-2 border-amber-500 shadow-sm" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-[12px] font-bold shadow-sm uppercase">
                        {user.name ? user.name.charAt(0) : 'U'}
                      </div>
                    )
                  ) : (
                    <User className="w-5 h-5 stroke-[2]" />
                  )}
                </button>
                {user && (
                  <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] hidden lg:block">
                    <div className="bg-white border border-gray-200 py-4 w-48 shadow-xl rounded-md relative before:absolute before:-top-1.5 before:right-4 before:w-3 before:h-3 before:bg-white before:rotate-45 before:border-l before:border-t before:border-gray-200">
                      <p className="px-5 mb-1 text-[13px] font-bold text-gray-900 truncate">Hi, {user.name?.split(' ')[0]}</p>
                      <p className="px-5 mb-3 text-[10px] text-gray-400 truncate border-b pb-2">{user.email}</p>
                      <div className="flex flex-col">
                        <button onClick={() => navigate('/profile')} className="text-left px-5 py-1.5 text-[13px] text-gray-600 hover:text-amber-600 hover:underline">Your Profile</button>
                        <button onClick={() => navigate('/orders')} className="text-left px-5 py-1.5 text-[13px] text-gray-600 hover:text-amber-600 hover:underline">Your Orders</button>
                        <button onClick={() => navigate('/cart')} className="text-left px-5 py-1.5 text-[13px] text-gray-600 hover:text-amber-600 hover:underline underline decoration-amber-500 underline-offset-4">Your Portfolio</button>
                        
                        {user.role === 'admin' && (
                           <button onClick={() => navigate('/admin/add-product')} className="text-left px-5 py-1.5 text-[13px] text-blue-600 hover:text-blue-800 font-semibold mt-1">Admin Dashboard</button>
                        )}

                        <div className="h-[1px] bg-gray-100 my-2 mx-4" />
                        <button onClick={() => { logout(); setActiveMenu(null); }} className="text-left px-5 py-1.5 text-[13px] text-gray-600 hover:text-red-600 hover:underline">Sign Out</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative group flex items-center">
                <button onClick={() => navigate('/cart')} className={`relative transition-all duration-300 hover:scale-110 ${iconColor}`}>
                  <ShoppingBag className="w-5 h-5 stroke-[2]" />
                  {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[9px] font-bold text-white shadow-sm">{cartCount}</span>}
                </button>

                {!showAddedDialog && (
                  <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[90] hidden lg:block">
                    <div className="bg-white border border-gray-200 py-4 w-64 shadow-xl rounded-md relative before:absolute before:-top-1.5 before:right-4 before:w-3 before:h-3 before:bg-white before:rotate-45 before:border-l before:border-t before:border-gray-200">
                      <p className="px-5 mb-3 text-[13px] font-bold text-gray-900">Your Selection</p>
                      <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                        {Array.isArray(cart) && cart.length > 0 ? (
                          cart.map((item, i) => {
                            const product = item?.productId || item?.product || item;
                            if (!product || !product._id) return null;

                            return (
                              <div key={product._id || i} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 group/item cursor-pointer" onClick={() => navigate(`/product-details/${product._id}`)}>
                                <div className="w-10 h-10 bg-gray-50 rounded p-1 shrink-0 border border-gray-100 flex items-center justify-center">
                                  {/* 🔥 FIX 4: product.image -> product.Image */}
                                  <img 
                                    src={getImageUrl(product.Image) || 'https://placehold.co/50x50?text=No+Img'} 
                                    className="max-w-full max-h-full object-contain mix-blend-multiply" 
                                    alt={product.Product_Name || 'product'} 
                                    onError={(e) => { e.target.src = "https://placehold.co/50x50?text=No+Img" }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  {/* 🔥 FIX 5: product.name -> product.Product_Name */}
                                  <p className="text-[12px] text-gray-800 line-clamp-1 group-hover/item:text-amber-600 transition-colors">{product.Product_Name || 'Unknown Item'}</p>
                                  <p className="text-[10px] text-gray-400">Qty: {item.quantity || 1}</p>
                                </div>
                                <button 
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        removeFromCart(product._id); 
                                    }} 
                                    className="text-gray-300 hover:text-red-500 z-10"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )
                          })
                        ) : (
                          <p className="px-5 py-4 text-[12px] text-gray-500">Selection list is empty</p>
                        )}
                      </div>
                      <div className="h-[1px] bg-gray-100 my-2 mx-4" />
                      <div className="px-4 pt-1">
                         <button onClick={() => navigate('/cart')} className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded text-[12px] font-bold transition-colors">Proceed to Portfolio</button>
                      </div>
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {showAddedDialog && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      className="absolute top-full right-0 mt-3 p-4 w-64 bg-white border border-gray-200 shadow-2xl rounded-xl z-[110] before:absolute before:-top-1.5 before:right-4 before:w-3 before:h-3 before:bg-white before:rotate-45 before:border-l before:border-t before:border-gray-200 hidden lg:block"
                    >
                      <button onClick={() => setShowAddedDialog(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-900"><X className="w-3.5 h-3.5"/></button>
                      <div className="flex items-start gap-3 mt-1">
                         <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0 border border-green-100">
                            <CheckCircle className="w-4 h-4" />
                         </div>
                         <div>
                           <p className="text-[13px] font-bold text-gray-900 leading-tight">Added to Portfolio</p>
                           <p className="text-[11px] text-gray-500 mt-0.5">Your selection is updated.</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => { setShowAddedDialog(false); navigate('/cart'); }} 
                        className="w-full mt-4 bg-gray-900 hover:bg-amber-600 text-white py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                      >
                         Continue Inquiry <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={() => setActiveMenu('mobile')} className={`lg:hidden transition-all duration-300 hover:scale-110 ${textColor}`}>
                <Menu className="w-6 h-6 stroke-[2]" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {activeMenu === 'appliances' && (
            <motion.div variants={menuVariants} initial="hidden" animate="visible" exit="exit" className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] z-40 text-gray-900 rounded-b-2xl overflow-hidden hidden lg:block">
              <div className="container mx-auto px-12 py-10">
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-9 grid grid-cols-3 gap-y-12 gap-x-8 border-r border-gray-100 pr-10">
                    {appliancesMenu.categories.map((cat, idx) => (
                      <div key={idx} className="space-y-5">
                        <h4 className="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-3">{cat.name}</h4>
                        <ul className="space-y-3">
                          {cat.items.map((item, i) => (
                            <li key={i}>
                              <button 
                                onClick={() => { 
                                  navigate(`/products?category=${encodeURIComponent(item.dbCategory)}&type=${encodeURIComponent(item.dbType)}`); 
                                  setActiveMenu(null); 
                                }} 
                                className="text-[13px] text-gray-500 hover:text-amber-600 hover:translate-x-1.5 transition-all duration-300 text-left w-full"
                              >
                                {item.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="col-span-3 pl-8">
                    <div className="relative group cursor-pointer overflow-hidden rounded-xl h-full min-h-[250px] shadow-sm" onClick={() => { navigate(appliancesMenu.spotlight.link); setActiveMenu(null); }}>
                      <img src={appliancesMenu.spotlight.image} alt="Highlight" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                        <span className="text-white font-serif text-2xl mb-2">{appliancesMenu.spotlight.title}</span>
                        <span className="text-amber-400 text-[11px] uppercase font-bold tracking-widest flex items-center gap-2 group-hover:text-amber-300 transition-colors">Shop Now <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" /></span>
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
            <motion.div variants={menuVariants} initial="hidden" animate="visible" exit="exit" className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] py-10 rounded-b-2xl overflow-hidden z-40 hidden lg:block">
              <div className="container mx-auto px-12">
                <div className="grid grid-cols-12 gap-12"> 
                    <div className="col-span-5 flex flex-col gap-10 py-2">
                        {expertMenu.sections.map((section, idx) => (
                            <div key={idx} className="group">
                                <button onClick={() => { navigate(section.mainLink); setActiveMenu(null); }} className="flex items-center gap-3 text-[13px] font-extrabold text-gray-900 uppercase tracking-widest mb-2.5 hover:text-amber-600 transition-colors w-full text-left">
                                    <span className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">{section.icon}</span> 
                                    {section.title} 
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"/>
                                </button>
                                <p className="text-[13px] text-gray-500 mb-4 pl-12 leading-relaxed">{section.description}</p>
                                <div className="pl-12 grid grid-cols-2 gap-y-3 gap-x-4">
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

                    <div className="col-span-7 relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer" onClick={() => setBookingOpen(true)}>
                        <img src={expertMenu.promo.image} alt="Expert Consultation" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent flex flex-col justify-center px-12">
                            <h3 className="text-4xl font-serif text-white mb-3">{expertMenu.promo.title}</h3>
                            <p className="text-gray-300 text-lg mb-8 max-w-md font-light">{expertMenu.promo.subtitle}</p>
                            <button onClick={(e) => { e.stopPropagation(); setBookingOpen(true); setActiveMenu(null); }} className="w-fit bg-white text-gray-900 px-8 py-3.5 rounded-lg text-[11px] font-extrabold uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-xl hover:-translate-y-0.5">
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-0 left-0 w-full h-[120px] bg-white/95 backdrop-blur-xl flex items-center justify-center z-[100] border-b border-gray-100 shadow-2xl">
                    <div className="container mx-auto px-6 md:px-12 relative flex items-center w-full max-w-4xl">
                        <Search className="w-6 h-6 text-amber-600 mr-4" />
                        
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
                            placeholder="Type to search appliances..." 
                            className="w-full text-xl md:text-2xl font-light outline-none bg-transparent placeholder:text-gray-300 text-gray-900" 
                        />
                        
                        <button onClick={() => setShowSearch(false)} className="absolute right-0 p-2 text-gray-400 hover:text-gray-900 hover:rotate-90 transition-all duration-300">
                            <X className="w-6 h-6 md:w-8 md:h-8" />
                        </button>
                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="absolute bottom-[-10px] left-6 md:left-12 right-6 md:right-12 h-[1px] bg-gradient-to-r from-amber-600 to-transparent origin-left" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {activeMenu === 'mobile' && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveMenu(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden" />
              <motion.div variants={mobileMenuVariants} initial="hidden" animate="visible" exit="exit" className="fixed top-0 right-0 h-full w-[85%] max-w-[400px] bg-white z-[60] shadow-2xl flex flex-col lg:hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                    <img src={logo} alt="Logo" className="h-6 object-contain" />
                    <button onClick={() => setActiveMenu(null)} className="p-2 bg-white border border-gray-200 rounded-full text-gray-900 hover:bg-gray-100 transition-colors shadow-sm"><X className="w-4 h-4" /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
                    {appliancesMenu.categories.map((cat, idx) => (
                        <div key={idx} className="group">
                            <h2 className="text-[15px] font-extrabold text-gray-900 mb-4 uppercase tracking-wider">{cat.name}</h2>
                            <div className="pl-4 border-l-2 border-amber-100 group-hover:border-amber-500 transition-colors duration-300 space-y-4">
                                {cat.items.map((item, i) => (
                                    <button 
                                      key={i} 
                                      onClick={() => { 
                                        navigate(`/products?category=${encodeURIComponent(item.dbCategory)}&type=${encodeURIComponent(item.dbType)}`); 
                                        setActiveMenu(null); 
                                      }} 
                                      className="block text-gray-600 text-[14px] hover:text-amber-600 hover:translate-x-1 transition-all text-left w-full"
                                    >
                                      {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Mobile Action Center */}
                <div className="p-6 border-t border-gray-100 bg-white space-y-4">
                    {user ? (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                                {user.profileImage ? (
                                    <img src={getImageUrl(user.profileImage)} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-amber-500 shadow-sm" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-bold shadow-sm uppercase">
                                        {user.name ? user.name.charAt(0) : 'U'}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Hi, {user.name?.split(' ')[0]}</p>
                                    <p className="text-[11px] text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => { setActiveMenu(null); navigate('/profile'); }} className="text-left text-[13px] text-gray-700 font-medium hover:text-amber-600">My Profile</button>
                                <button onClick={() => { setActiveMenu(null); navigate('/orders'); }} className="text-left text-[13px] text-gray-700 font-medium hover:text-amber-600">My Orders</button>
                                <button onClick={() => { logout(); setActiveMenu(null); }} className="text-left text-[13px] text-red-600 font-bold mt-2">Sign Out</button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => { setAuthMode('login'); setActiveMenu(null); }} className="w-full py-3 bg-gray-100 text-gray-900 font-bold rounded-lg text-[13px] hover:bg-gray-200 transition-colors">
                            Log In / Sign Up
                        </button>
                    )}
                    
                    <button onClick={() => setBookingOpen(true)} className="w-full py-4 bg-gray-900 text-white uppercase tracking-widest text-[11px] font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors shadow-lg">
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