import React, { useState, useEffect, useContext } from "react";
import { User, Search, ShoppingBag, Menu, X, ArrowRight, ChevronDown, BookOpen, MapPin, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assests/logo1.png"; 
import { AuthContext } from "../context/AuthContext";
import { LoginModal } from "./LoginModal"; 
import { SignupModal } from "./SignupModal";
import { BookingConsultation } from "./BookingConsultation";

// --- DATA ---
const appliancesMenu = {
  categories: [
    { name: "Cooking & Baking", items: ["Ovens", "Steam Cooking", "Hobs", "Kitchen hoods", "Microwaves", "Hob product finder"] },
    { name: "Laundry Care", items: ["Washing Machines", "Dryers", "Washer Dryers"] },
    { name: "Dishwashers", items: ["Built-in Dishwashers", "Free-standing Dishwashers"] },
    { name: "Cooling", items: ["Refrigerators", "Wine Coolers", "Freezers"] },
    { name: "Coffee Machines", items: ["Built-in Coffee Machines", "Automatic Coffee Machines"] }
  ],
  spotlight: {
    title: "Series 8 Black Steel",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80",
    link: "/products/series-8"
  }
};

// --- UPDATED EXPERT MENU DATA ---
// Ab Main Titles ke paas bhi 'link' hai aur Sub-items ke paas bhi unique navigation hai
const expertMenu = {
  sections: [
    {
      title: "Knowledge Library",
      mainLink: "/expert/knowledge", // <--- Main Page Link
      icon: <BookOpen className="w-5 h-5 text-amber-600" />,
      description: "Explore guides, maintenance tips, and warranty info.",
      // Sub-items ab specific component load karenge
      items: [
          { label: "Buying Guides", link: "/expert/knowledge?tab=guides" },
          { label: "Appliance Care", link: "/expert/knowledge?tab=care" },
          { label: "Kitchen Planning", link: "/expert/knowledge?tab=planning" },
          { label: "Warranty Info", link: "/expert/knowledge?tab=warranty" }
      ]
    },
    {
      title: "Get Guidance",
      mainLink: "/expert/guidance", // <--- Main Page Link
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

// --- ANIMATION VARIANTS ---
const menuVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, cartCount } = useContext(AuthContext);

  // States
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); 
  const [showSearch, setShowSearch] = useState(false);
  const [authMode, setAuthMode] = useState(null); 
  const [bookingOpen, setBookingOpen] = useState(false);

  // Scroll Logic
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setActiveMenu(null);
  }, [location]);

  // --- VISIBILITY LOGIC ---
  const isWhiteTheme = isScrolled || activeMenu;
  const textColor = isWhiteTheme ? "text-black" : "text-white drop-shadow-sm"; 
  const iconColor = isWhiteTheme ? "text-black hover:text-amber-600" : "text-white hover:text-amber-400 drop-shadow-sm";
  const borderColor = isWhiteTheme ? "border-gray-200" : "border-white/10";

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out border-b ${
          isWhiteTheme
            ? "bg-white py-4 shadow-md" 
            : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-6" 
        } ${borderColor}`}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between relative">

            {/* A. LEFT SIDE (BRAND) */}
            <div className="flex flex-col justify-center w-[200px]">
              <div 
                onClick={() => navigate('/')} 
                className="cursor-pointer group flex items-end gap-2"
              >
                 <img 
                   src={logo} 
                   alt="Wow_shop" 
                   className={`h-8 md:h-16 w-[70px] object-contain transition-all duration-500 `} 
                 />
                 
                 <span className={`hidden md:block text-[8px] uppercase tracking-widest font-bold mb-1 transition-colors duration-500 ${
                     isWhiteTheme ? "text-gray-500" : "text-white/90"
                 }`}>
                   Guided <br /> Buying.
                 </span>
              </div>
            </div>

            {/* B. CENTER (MAIN MENU) */}
            <nav className="hidden lg:flex items-center gap-10">
              
              <button 
                onMouseEnter={() => setActiveMenu('appliances')}
                className={`flex items-center gap-1 text-sm font-bold tracking-wide transition-colors duration-300 ${
                    activeMenu === 'appliances' ? 'text-amber-600' : `${textColor} hover:text-amber-500`
                }`}
              >
                Appliances <ChevronDown className={`w-3 h-3 transition-transform ${activeMenu === 'appliances' ? 'rotate-180' : ''}`} />
              </button>

              <button 
                onMouseEnter={() => setActiveMenu('expert')}
                className={`flex items-center gap-1 text-sm font-bold tracking-wide transition-colors duration-300 ${
                    activeMenu === 'expert' ? 'text-amber-600' : `${textColor} hover:text-amber-500`
                }`}
              >
                Expert Advice <ChevronDown className={`w-3 h-3 transition-transform ${activeMenu === 'expert' ? 'rotate-180' : ''}`} />
              </button>

              <button 
                onClick={() => navigate('/studio')}
                className={`relative text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-all duration-300 ${
                    isWhiteTheme 
                        ? "bg-black text-white hover:bg-gray-800 shadow-md" 
                        : "bg-black/30 backdrop-blur-md text-white border border-white/30 hover:bg-black/50" 
                }`}
              >
                Kitchen Studio 3D
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                  NEW
                </span>
              </button>
            </nav>

            {/* C. RIGHT SIDE (ACTIONS) */}
            <div className="flex items-center justify-end gap-6 w-[200px]">
              <button onClick={() => setShowSearch(!showSearch)} className={`transition-colors duration-300 ${iconColor}`}>
                <Search className="w-5 h-5 stroke-[2]" />
              </button>

              <div className="relative group">
                <button onClick={() => setAuthMode('login')} className={`transition-colors duration-300 ${iconColor}`}>
                  <User className="w-5 h-5 stroke-[2]" />
                </button>
                {user && (
                    <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                        <div className="bg-white border border-gray-100 p-4 w-48 shadow-xl rounded-md">
                            <p className="text-xs text-gray-500 mb-2">Signed in as <br/><span className="text-black font-semibold">{user.name}</span></p>
                            <button onClick={() => navigate('/profile')} className="w-full text-left text-xs font-bold text-gray-900 hover:bg-gray-50 py-2 px-2 rounded mb-2 flex items-center gap-2">
                                My Dashboard <ArrowRight className="w-3 h-3"/>
                            </button>
                        </div>
                    </div>
                )}
              </div>

              <button onClick={() => navigate('/cart')} className={`relative transition-colors duration-300 ${iconColor}`}>
                <ShoppingBag className="w-5 h-5 stroke-[2]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[9px] font-bold text-white shadow-sm border border-white">
                    {cartCount}
                  </span>
                )}
              </button>
              <button onClick={() => setActiveMenu('mobile')} className={`lg:hidden transition-colors ${textColor}`}>
                <Menu className="w-6 h-6 stroke-[2]" />
              </button>
            </div>
          </div>
        </div>

        {/* --- MEGA MENU CONTENT --- */}
        <AnimatePresence>
          {activeMenu === 'appliances' && (
            <motion.div
              variants={menuVariants} initial="hidden" animate="visible" exit="exit"
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl z-40 text-gray-900"
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="container mx-auto px-12 py-12">
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-9 grid grid-cols-3 gap-y-10 gap-x-8 border-r border-gray-100 pr-8">
                    {appliancesMenu.categories.map((cat, idx) => (
                      <div key={idx} className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">{cat.name}</h4>
                        <ul className="space-y-2.5">
                          {cat.items.map((item, i) => (
                            <li key={i}>
                              <button onClick={() => { navigate(`/products?category=${cat.name}&type=${item}`); setActiveMenu(null); }} className="text-sm text-gray-500 hover:text-amber-600 hover:translate-x-1 transition-all duration-200 text-left">
                                {item}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="col-span-3 pl-6">
                    <div className="relative group cursor-pointer overflow-hidden rounded-lg h-full max-h-[300px]" onClick={() => navigate(appliancesMenu.spotlight.link)}>
                      <img src={appliancesMenu.spotlight.image} alt="Highlight" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                        <span className="text-white font-serif text-xl mb-1">{appliancesMenu.spotlight.title}</span>
                        <span className="text-amber-400 text-xs uppercase tracking-wider flex items-center gap-2">Shop Now <ArrowRight className="w-3 h-3" /></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- EXPERT MENU (UPDATED: Clickable Headers) --- */}
          {activeMenu === 'expert' && (
            <motion.div
              variants={menuVariants} initial="hidden" animate="visible" exit="exit"
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-8"
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="container mx-auto px-12">
                <div className="grid grid-cols-12 gap-10"> 
                    
                    {/* LEFT SIDE: 2 OPTIONS (Knowledge & Guidance) */}
                    <div className="col-span-5 flex flex-col gap-8 py-2">
                        {expertMenu.sections.map((section, idx) => (
                            <div key={idx} className="group">
                                
                                {/* MAIN HEADER (Clickable) */}
                                <button 
                                    onClick={() => { navigate(section.mainLink); setActiveMenu(null); }} 
                                    className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-widest mb-2 hover:text-amber-600 transition-colors w-full text-left"
                                >
                                    {section.icon} {section.title} <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"/>
                                </button>
                                
                                <p className="text-xs text-gray-400 mb-3 pl-7">{section.description}</p>
                                
                                {/* SUB-MENUS (Clickable Components) */}
                                <div className="pl-7 grid grid-cols-2 gap-2">
                                    {section.items.map((item, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => { navigate(item.link); setActiveMenu(null); }}
                                            className="text-sm text-gray-600 hover:text-amber-600 text-left transition-colors flex items-center gap-1 group/item"
                                        >
                                            <span className="w-1 h-1 bg-gray-300 rounded-full group-hover/item:bg-amber-600"></span>
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT SIDE: IMAGE + CTA */}
                    <div className="col-span-7 relative rounded-xl overflow-hidden shadow-lg group cursor-pointer" onClick={() => setBookingOpen(true)}>
                        <img 
                            src={expertMenu.promo.image} 
                            alt="Expert Consultation" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex flex-col justify-center px-10">
                            <h3 className="text-3xl font-serif text-white mb-2">{expertMenu.promo.title}</h3>
                            <p className="text-gray-200 mb-6">{expertMenu.promo.subtitle}</p>
                            
                            <button 
                                onClick={(e) => { e.stopPropagation(); setBookingOpen(true); setActiveMenu(null); }}
                                className="w-fit bg-white text-black px-6 py-3 rounded text-sm font-bold uppercase tracking-wider hover:bg-amber-500 hover:text-white transition-all flex items-center gap-2"
                            >
                                <Video className="w-4 h-4" /> Book Consultation
                            </button>
                        </div>
                    </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- SEARCH OVERLAY --- */}
        <AnimatePresence>
            {showSearch && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="absolute top-full left-0 w-full bg-white text-gray-900 p-8 z-50 border-b border-gray-200 shadow-xl"
                >
                    <div className="container mx-auto max-w-3xl relative">
                        <input type="text" placeholder="Search..." className="w-full text-3xl font-light outline-none border-b-2 border-gray-200 pb-4 focus:border-amber-500 transition-colors bg-transparent placeholder:text-gray-300" autoFocus />
                        <button onClick={() => setShowSearch(false)} className="absolute right-0 top-0 p-2 text-gray-400 hover:text-black">
                            <X className="w-8 h-8" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </header>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {activeMenu === 'mobile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-white z-[60] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <span className="text-gray-900 font-serif italic text-xl">Menu</span>
                    <button onClick={() => setActiveMenu(null)} className="p-2 border border-gray-200 rounded-full text-gray-900 hover:bg-gray-100"><X className="w-5 h-5" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {appliancesMenu.categories.map((cat, idx) => (
                        <div key={idx}>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">{cat.name}</h2>
                            <div className="pl-4 border-l-2 border-amber-500 space-y-3">
                                {cat.items.map((item, i) => (
                                    <button key={i} onClick={() => { navigate(`/products`); setActiveMenu(null); }} className="block text-gray-600 text-sm active:text-amber-600 text-left">{item}</button>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="pt-8 border-t border-gray-100">
                        <button onClick={() => setBookingOpen(true)} className="w-full py-4 bg-gray-900 text-white uppercase tracking-widest text-sm font-bold mb-4 rounded-sm flex items-center justify-center gap-2">
                           <Video className="w-4 h-4" /> Talk to Expert
                        </button>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <LoginModal isOpen={authMode === 'login'} onClose={() => setAuthMode(null)} onSwitchToSignup={() => setAuthMode('signup')} />
      <SignupModal isOpen={authMode === 'signup'} onClose={() => setAuthMode(null)} onSwitchToLogin={() => setAuthMode('login')} />
      <BookingConsultation isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}