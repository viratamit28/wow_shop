import { User, Phone, MapPin, Menu, X, ShoppingCart, ChevronDown, Heart, LogOut, BookOpen, Headphones } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assests/logo1.png";
import { LoginModal } from "./LoginModal";
import { SignupModal } from "./SignupModal";
import { BookingConsultation } from "./BookingConsultation";
import { AuthContext } from "../context/AuthContext";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Context Data
  const { user, logout, cartCount } = useContext(AuthContext);

  // States
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Dropdown States
  const [isAppliancesOpen, setIsAppliancesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isGuidanceOpen, setIsGuidanceOpen] = useState(false); // New State for Guidance

  // Modal States
  const [activeModal, setActiveModal] = useState(null);
  const [showBookingPopup, setShowBookingPopup] = useState(false);

  // Refs for Click Outside
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const guidanceRef = useRef(null);

  // Click Outside Logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAppliancesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (guidanceRef.current && !guidanceRef.current.contains(event.target)) {
        setIsGuidanceOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    if (location.pathname === '/') {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(true);
    }
  }, [location.pathname]);

  // Navigation Handlers
  const handleHomeClick = () => {
    if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
    else navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => { setActiveModal('login'); setIsUserMenuOpen(false); setIsMobileMenuOpen(false); };
  const handleBookingClick = () => { setShowBookingPopup(true); setIsUserMenuOpen(false); setIsMobileMenuOpen(false); };
  const handleCloseModal = () => setActiveModal(null);
  const switchToSignup = () => setActiveModal('signup');
  const switchToLogin = () => setActiveModal('login');
  
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/'); 
  };

  const handleCartClick = () => { navigate('/cart'); setIsMobileMenuOpen(false); };

  const handleApplianceSelect = (category, item) => {
    const slug = item.toLowerCase().replace(/\s+/g, '-');
    navigate(`/products?category=${category.toLowerCase()}&type=${slug}`);
    setIsAppliancesOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Data
  const appliancesData = [
    { category: "Large Appliances", items: ["Chimney", "Hobs", "Dishwasher", "Washing Machine", "Refrigerators", "Dryer"] },
    { category: "Hobs", items: ["2 Burner Hob", "3 Burner Hob", "4 Burner Hob", "Induction", "Deep Fryer", "Barbeque"] },
    { category: "Countertop", items: ["Food Processor", "Dough Processor", "Mixer Grinder", "Blender", "Toaster", "Electric Kettle"] },
    { category: "Oven", items: ["Built in Oven", "Steam Combi Oven", "Microwave", "Combi Microwave"] },
    { category: "Cooker Hood", items: ["Wall Mounted", "Island Hood", "Ceiling Mounted", "Downdraft"] }
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || location.pathname !== '/' ? 'bg-black/95 backdrop-blur-md shadow-xl' : 'bg-transparent'}`}>
        
        {/* --- LEVEL 1: Utility Bar (Top Strip) --- */}
        <div className="bg-black border-b border-white/10 hidden md:block">
          <div className="container mx-auto px-4 lg:px-8 h-8 flex items-center justify-between text-[11px] font-medium tracking-wide text-gray-400">
            <div className="flex gap-6">
               <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Pune, India</span>
            </div>
            <div className="flex gap-4">
              <button onClick={handleBookingClick} className="hover:text-teal-400 transition-colors">Book Consultation</button>
              <span className="text-gray-700">|</span>
              <a href="tel:+919876543210" className="hover:text-white transition-colors flex items-center gap-1.5">
                <Phone className="h-3 w-3" /> +91 98765 43210
              </a>
            </div>
          </div>
        </div>

        {/* --- LEVEL 2: Main Header (Logo + Navigation + Icons) --- */}
        <div className="container mx-auto px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            
            {/* 1. Logo */}
            <button onClick={handleHomeClick} className="flex-shrink-0">
              <img src={logo} alt="Wow Shop" className="h-10 md:h-16 w-auto object-contain" />
            </button>

            {/* 2. Center Navigation (Replaced Search Bar) - Desktop Only */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                {/* Shop Appliances Mega Menu */}
                <div className="relative h-full" ref={dropdownRef}>
                    <button 
                        onMouseEnter={() => setIsAppliancesOpen(true)}
                        onClick={() => setIsAppliancesOpen(!isAppliancesOpen)}
                        className="flex items-center gap-1.5 text-sm font-semibold text-white hover:text-teal-400 transition-colors uppercase tracking-wide py-2"
                    >
                        Shop Appliances
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isAppliancesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Mega Menu Content */}
                    <div 
                        className={`fixed top-[100px] left-0 w-full bg-white shadow-2xl border-t border-gray-100 transition-all duration-300 overflow-hidden z-50 ${
                        isAppliancesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                        }`}
                        onMouseLeave={() => setIsAppliancesOpen(false)}
                    >
                        <div className="container mx-auto px-8 py-8 grid grid-cols-5 gap-8">
                            {appliancesData.map((cat, i) => (
                                <div key={i} className="space-y-4">
                                    <h4 className="font-bold text-gray-900 text-sm border-b-2 border-teal-500 pb-2 inline-block">{cat.category}</h4>
                                    <ul className="space-y-2">
                                        {cat.items.map((item, j) => (
                                            <li key={j}>
                                                <button onClick={() => handleApplianceSelect(cat.category, item)} className="text-sm text-gray-600 hover:text-teal-600 hover:translate-x-1 transition-all text-left w-full">
                                                    {item}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                             <div className="col-span-1 rounded-lg overflow-hidden relative group cursor-pointer" onClick={() => navigate('/products')}>
                                <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80" alt="Kitchen" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <span className="text-white font-bold border-2 border-white px-4 py-2 uppercase tracking-widest text-xs">New Arrivals</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Get Guidance Dropdown (New) */}
                <div className="relative h-full" ref={guidanceRef}>
                    <button 
                        onClick={() => setIsGuidanceOpen(!isGuidanceOpen)}
                        className="flex items-center gap-1.5 text-sm font-semibold text-white hover:text-teal-400 transition-colors uppercase tracking-wide py-2"
                    >
                        Get Guidance
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isGuidanceOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isGuidanceOpen && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2">
                             <button onClick={() => { navigate('/knowledge-library'); setIsGuidanceOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-teal-500" />
                                Knowledge Library
                             </button>
                             <button onClick={() => { navigate('/talk-expert'); setIsGuidanceOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors flex items-center gap-3">
                                <Headphones className="h-4 w-4 text-teal-500" />
                                Talk to Expert
                             </button>
                        </div>
                    )}
                </div>

                {/* Standard Links */}
                <button onClick={() => navigate('/bestsellers')} className="text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors uppercase tracking-wide">
                    Bestsellers
                </button>
            </nav>

            {/* 3. Right Icons (Account, Wishlist, Cart) */}
            <div className="flex items-center gap-1 md:gap-4 text-white">
              
              {/* User Account */}
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex flex-col items-center gap-1 p-2 hover:bg-white/10 rounded-lg transition-all group"
                >
                  <User className={`h-5 w-5 ${user ? "text-green-400" : "group-hover:text-teal-400 transition-colors"}`} />
                  <span className="text-[10px] font-medium opacity-80 group-hover:opacity-100 max-w-[60px] truncate">
                    {user ? `Hi, ${user.name.split(" ")[0]}` : "Account"}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 border border-gray-100">
                    {user ? (
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">Hi, {user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <button 
                          onClick={handleLogout}
                          className="mt-3 w-full bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2 rounded uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                        >
                          <LogOut className="h-3 w-3" /> Logout
                        </button>
                      </div>
                    ) : (
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">Welcome!</p>
                        <button onClick={handleLoginClick} className="mt-3 w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 rounded uppercase tracking-wider transition-colors">
                          Login / Sign Up
                        </button>
                      </div>
                    )}
                    <div className="py-1">
                      {['My Profile', 'My Orders', 'Wishlist', 'Saved Addresses'].map((item) => (
                        <button key={item} onClick={() => navigate(`/${item.toLowerCase().replace(' ', '-')}`)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors">
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <button onClick={() => navigate('/wishlist')} className="hidden md:flex flex-col items-center gap-1 p-2 hover:bg-white/10 rounded-lg transition-all group">
                <Heart className="h-5 w-5 group-hover:text-pink-500 transition-colors" />
                <span className="text-[10px] font-medium opacity-80 group-hover:opacity-100">Saved</span>
              </button>

              {/* Cart Button */}
              <button 
                onClick={handleCartClick}
                className="flex flex-col items-center gap-1 p-2 hover:bg-white/10 rounded-lg transition-all group relative"
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5 group-hover:text-yellow-400 transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium opacity-80 group-hover:opacity-100 hidden md:block">Cart</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 ml-2">
                <Menu className="h-7 w-7" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- MOBILE SIDEBAR MENU --- */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-[80%] max-w-[300px] bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 border-b flex items-center justify-between bg-gray-50">
            <span className="font-bold text-gray-900">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white rounded-full shadow-sm">
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Mobile: Guidance Section */}
            <div>
                 <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Get Guidance</h5>
                 <div className="space-y-2 border-l-2 border-teal-100 pl-3">
                    <button onClick={() => {navigate('/knowledge-library'); setIsMobileMenuOpen(false);}} className="flex items-center gap-2 text-sm text-gray-700 font-medium w-full">
                        <BookOpen className="h-4 w-4 text-teal-600" /> Knowledge Library
                    </button>
                    <button onClick={() => {navigate('/talk-expert'); setIsMobileMenuOpen(false);}} className="flex items-center gap-2 text-sm text-gray-700 font-medium w-full">
                        <Headphones className="h-4 w-4 text-teal-600" /> Talk to Expert
                    </button>
                 </div>
            </div>

            {/* Mobile: Categories */}
            <div>
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Shop Appliances</h5>
              <div className="space-y-1">
                {appliancesData.map((cat, i) => (
                  <div key={i} className="py-2 border-b border-gray-100 last:border-0">
                    <p className="font-semibold text-gray-800 text-sm mb-2">{cat.category}</p>
                    <div className="pl-2 space-y-2 border-l-2 border-gray-100">
                      {cat.items.slice(0, 4).map((item, j) => (
                        <button key={j} onClick={() => handleApplianceSelect(cat.category, item)} className="block text-xs text-gray-500 hover:text-teal-600 text-left w-full">{item}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile: Other Links */}
            <div>
              <button onClick={() => {navigate('/bestsellers'); setIsMobileMenuOpen(false);}} className="block text-sm text-yellow-600 font-bold mb-4 uppercase">View Bestsellers</button>
              <button onClick={handleBookingClick} className="w-full bg-teal-50 text-teal-700 py-2 rounded-md text-sm font-semibold mb-2">Book Consultation</button>
            </div>
          </div>

          {/* Mobile: Bottom Actions */}
          <div className="p-4 border-t bg-gray-50">
            {user ? (
              <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 border border-red-200 py-3 rounded-lg font-bold text-sm">LOGOUT</button>
            ) : (
              <button onClick={handleLoginClick} className="w-full bg-black text-white py-3 rounded-lg font-bold text-sm mb-2">LOGIN</button>
            )}
            <Button className="bg-teal-600 hover:bg-teal-700 text-white mt-2 w-full" onClick={handleCartClick}>
              VIEW CART ({cartCount})
            </Button>
          </div>
        </div>
      </div>

      <LoginModal isOpen={activeModal === 'login'} onClose={handleCloseModal} onSwitchToSignup={switchToSignup} />
      <SignupModal isOpen={activeModal === 'signup'} onClose={handleCloseModal} onSwitchToLogin={switchToLogin} />
      <BookingConsultation isOpen={showBookingPopup} onClose={() => setShowBookingPopup(false)} />
    </>
  );
}