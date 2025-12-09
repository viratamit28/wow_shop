import { Search, User, Phone, MapPin, Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assests/logo1.png";
import { LoginModal } from "./LoginModal";
import { SignupModal } from "./SignupModal";
import { BookingConsultation } from "./BookingConsultation";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAppliancesOpen, setIsAppliancesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  // Load cart count from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemsCount(totalItems);
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAppliancesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Only add scroll listener on home page or pages where header should change on scroll
    if (location.pathname === '/') {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      // On other pages, header should always have solid background
      setIsScrolled(true);
    }
  }, [location.pathname]);

  // Navigation handlers
  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsAppliancesOpen(false);
  };

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      // Scroll to top if already on home page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to home page
      navigate('/');
    }
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    setActiveModal('login');
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleSignupClick = () => {
    setActiveModal('signup');
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleBookingClick = () => {
    setShowBookingPopup(true);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const switchToSignup = () => {
    setActiveModal('signup');
  };

  const switchToLogin = () => {
    setActiveModal('login');
  };

  // Search functionality
  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchQuery("");
        setIsMobileMenuOpen(false);
      }
    }
  };

  // Function to open Google Maps
  const openGoogleMaps = () => {
    const address = "Pune, Maharashtra, India";
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(googleMapsUrl, '_blank');
    setIsMobileMenuOpen(false);
  };

  const handleVisitUs = () => {
  navigate('/visit');
  setIsMobileMenuOpen(false);
  setIsAppliancesOpen(false);
};

  // Appliance category selection
  const handleApplianceSelect = (category, item) => {
    const slug = item.toLowerCase().replace(/\s+/g, '-');
    navigate(`/products?category=${category.toLowerCase()}&type=${slug}`);
    setIsAppliancesOpen(false);
    setIsMobileMenuOpen(false);
  };

  const appliancesData = [
    {
      category: "Large Appliances",
      items: [
        "Chimney", "Hobs", "Dishwasher", "Washing Machine", "Refrigerators", "Dryer"
      ]
    },
    {
      category: "Hobs",
      items: [
        "2 Burner Hob", "3 Burner Hob", "4 Burner Hob", "5 Burner Hob",
        "Single Burner Hob", "Induction", "Teppanyaki", "Deep Fryer",
        "Barbeque"
      ]
    },
    {
      category: "Countertop Appliances",
      items: [
        "Food Processor", "Dough Processor", "Meat Mincing Machine", "Mixer Grinder", "Blender", "Toaster"
        , "Electric Kettle"
      ]
    },
    {
      category: "Oven",
      items: [
        "Built in Oven", "Built in Steam Combi Oven", "Built in Microwave", "Built in Combi Microwave Oven"
      ]
    },
    {
      category: "Cooker Hood",
      items: [
        "Wall Mounted Hood", "Island Hood", "Ceiling Mounted Hood", "Downdraft"
      ]
    }
  ];

  const navItems = ['HOME', 'APPLIANCES', 'VISIT US'];

  // Cart functionality
  const handleCartClick = () => {
    navigate('/cart');
    setIsMobileMenuOpen(false);
  };

  // Determine header background based on current page
  const getHeaderBackground = () => {
    if (location.pathname !== '/') {
      return 'bg-black'; // Solid black on other pages
    }
    return isScrolled ? 'bg-black backdrop-blur-md shadow-lg' : 'bg-transparent';
  };

  const getTopBarBackground = () => {
    if (location.pathname !== '/') {
      return 'bg-black border-gray-800';
    }
    return isScrolled ? 'bg-black border-gray-800' : 'bg-black border-white/10';
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getHeaderBackground()}`}>
        {/* Top Bar */}
        <div className={`border-b transition-colors duration-300 ${getTopBarBackground()}`}>
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between h-10 text-xs">
              <div className="flex items-center gap-6">
                <button 
                  onClick={openGoogleMaps}
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
                >
                  <MapPin className="h-3 w-3" />
                  <span className="hidden sm:inline">Experience Studio - Pune</span>
                </button>
                <button 
                  onClick={handleBookingClick}
                  className="text-white/80 hover:text-white transition-colors hidden md:inline"
                >
                  Book Consultation
                </button>
              </div>
              <div className="flex items-center gap-4">
                <a href="tel:+919876543210" className="text-white/80 hover:text-white transition-colors flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span className="hidden sm:inline">+91 98765 43210</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className={`transition-all duration-300 ${
          location.pathname !== '/' ? 'py-2' : isScrolled ? 'py-1' : 'py-2'
        }`}>
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-12">
                {/* Logo */}
                <button 
                  onClick={handleHomeClick}
                  className="flex items-center group"
                >
                  <div className="relative">
                    <img src={logo} alt="logo" className="w-auto h-[80px]"/>
                  </div>
                </button>

                {/* Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                  {navItems.map((item) => (
                    <div key={item} className="relative" ref={item === 'APPLIANCES' ? dropdownRef : null}>
                      {item === 'APPLIANCES' ? (
                        <div>
                          <button
                            onClick={() => setIsAppliancesOpen(!isAppliancesOpen)}
                            className={`text-xs tracking-[0.15em] relative group transition-colors duration-300 flex items-center ${
                              location.pathname !== '/' ? 'text-white hover:text-teal-600' : 
                              isScrolled ? 'text-white hover:text-teal-600' : 'text-white/90 hover:text-white'
                            }`}
                          >
                            {item}
                            <svg 
                              className={`ml-1 h-4 w-4 transition-transform ${isAppliancesOpen ? 'rotate-180' : ''}`} 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            <span className={`absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300 ${
                              location.pathname !== '/' ? 'bg-teal-600' : 
                              isScrolled ? 'bg-teal-600' : 'bg-white'
                            }`}></span>
                          </button>

                          {/* Dropdown Menu */}
                          {isAppliancesOpen && (
                            <div className="absolute top-full left-[-245px] right-0 mt-6 w-[calc(100vw-1.5rem)] bg-white shadow-2xl rounded-lg overflow-hidden z-50 border border-gray-200">
                              <div className="p-6 max-w-5xl">
                                <div className="grid grid-cols-5 gap-24">
                                  {appliancesData.map((categoryData, index) => (
                                    <div key={categoryData.category} className="min-w-[200px]">
                                      <h3 className="font-semibold text-yellow-400 text-sm mb-4 pb-2 border-b border-gray-200 text-left">
                                        {categoryData.category}
                                      </h3>
                                      <ul className="space-y-2 text-left">
                                        {categoryData.items.map((item, itemIndex) => (
                                          <li key={itemIndex}>
                                            <button 
                                              onClick={() => handleApplianceSelect(categoryData.category, item)}
                                              className="text-xs text-gray-600 hover:text-teal-600 transition-colors block py-1 w-full text-left"
                                            >
                                              {item}
                                            </button>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : item === 'VISIT US' ? (
                        <button
                          onClick={handleVisitUs}
                          className={`text-xs tracking-[0.15em] relative group transition-colors duration-300 ${
                            location.pathname !== '/' ? 'text-white hover:text-teal-600' : 
                            isScrolled ? 'text-white hover:text-teal-600' : 'text-white/90 hover:text-white'
                          }`}
                        >
                          {item}
                          <span className={`absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300 ${
                            location.pathname !== '/' ? 'bg-teal-600' : 
                            isScrolled ? 'bg-teal-600' : 'bg-white'
                          }`}></span>
                        </button>
                      ) : (
                        <button
                          onClick={handleHomeClick}
                          className={`text-xs tracking-[0.15em] relative group transition-colors duration-300 ${
                            location.pathname !== '/' ? 'text-white hover:text-teal-600' : 
                            isScrolled ? 'text-white hover:text-teal-600' : 'text-white/90 hover:text-white'
                          }`}
                        >
                          {item}
                          <span className={`absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300 ${
                            location.pathname !== '/' ? 'bg-teal-600' : 
                            isScrolled ? 'bg-teal-600' : 'bg-white'
                          }`}></span>
                        </button>
                      )}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2 md:gap-4">
                {/* Search */}
                <div className={`hidden md:flex items-center gap-2 rounded-lg px-3 py-2 transition-colors cursor-pointer ${
                  location.pathname !== '/' ? 'bg-gray-100 hover:bg-gray-200' : 
                  isScrolled ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white/10 hover:bg-white/20'
                }`}>
                  <Search className={`h-5 w-5 ${
                    location.pathname !== '/' ? 'text-gray-600' : 
                    isScrolled ? 'text-gray-600' : 'text-white/70'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearch}
                    className={`text-sm bg-transparent border-none outline-none w-full ${
                      location.pathname !== '/' ? 'text-gray-800 placeholder-gray-500' : 
                      isScrolled ? 'text-gray-800 placeholder-gray-500' : 'text-white placeholder-white/70'
                    }`}
                  />
                  <button 
                    onClick={handleSearch}
                    className={`p-1 rounded ${
                      location.pathname !== '/' ? 'hover:bg-gray-300' : 
                      isScrolled ? 'hover:bg-gray-300' : 'hover:bg-white/30'
                    }`}
                  >
                    <Search className={`h-4 w-4 ${
                      location.pathname !== '/' ? 'text-gray-600' : 
                      isScrolled ? 'text-gray-600' : 'text-white/70'
                    }`} />
                  </button>
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <Button
                    variant="ghost"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`hidden md:flex items-center gap-2 transition-colors ${
                      location.pathname !== '/' 
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                        : isScrolled 
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                          : 'bg-white/10 hover:bg-white/20 text-white/70'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span className="text-sm">Account</span>
                    <svg 
                      className={`ml-1 h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-2xl rounded-lg overflow-hidden z-50 border border-gray-200">
                      <div className="p-2">
                        <button
                          onClick={handleLoginClick}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors w-full text-left"
                        >
                          <User className="h-4 w-4" />
                          Login
                        </button>
                        <button
                          onClick={handleSignupClick}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors w-full text-left"
                        >
                          <User className="h-4 w-4" />
                          Sign Up
                        </button>
                        <div className="border-t border-gray-200 my-1"></div>
                        <button 
                          onClick={() => handleNavigation('/profile')}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors w-full text-left"
                        >
                          My Profile
                        </button>
                        <button 
                          onClick={() => handleNavigation('/orders')}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors w-full text-left"
                        >
                          My Orders
                        </button>
                        <button 
                          onClick={() => handleNavigation('/wishlist')}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors w-full text-left"
                        >
                          Wishlist
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cart */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCartClick}
                    className={`relative transition-colors ${
                      location.pathname !== '/' 
                        ? 'text-gray-700 hover:text-teal-600 hover:bg-gray-100' 
                        : isScrolled 
                          ? 'text-gray-700 hover:text-teal-600 hover:bg-gray-100' 
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <ShoppingCart className="h-7 w-7" />
                    {cartItemsCount > 0 && (
                      <span className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium ${
                        location.pathname !== '/' 
                          ? 'bg-pink-600 text-white' 
                          : isScrolled 
                            ? 'bg-orange-700 text-white' 
                            : 'bg-white text-black'
                      }`}>
                        {cartItemsCount}
                      </span>
                    )}
                  </Button>
                </div>

                
                {/* Mobile Menu Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`lg:hidden ${
                    location.pathname !== '/' ? 'text-gray-700' : 
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 bg-black transform transition-transform duration-300 lg:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 text-white">
          {['HOME', 'APPLIANCES', 'VISIT US'].map((item) => (
            item === 'VISIT US' ? (
              <button
                key={item}
                onClick={() => {
                  openGoogleMaps();
                  setIsMobileMenuOpen(false);
                }}
                className="text-2xl tracking-[0.2em] hover:text-teal-400 transition-colors"
              >
                {item}
              </button>
            ) : item === 'APPLIANCES' ? (
              <div key={item} className="text-center">
                <div className="text-2xl tracking-[0.2em] mb-4">APPLIANCES</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {appliancesData.flatMap(cat => cat.items).slice(0, 6).map((appliance, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleApplianceSelect('All', appliance);
                      }}
                      className="px-3 py-2 bg-white/10 rounded hover:bg-white/20 transition-colors"
                    >
                      {appliance}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                key={item}
                onClick={handleHomeClick}
                className="text-2xl tracking-[0.2em] hover:text-teal-400 transition-colors"
              >
                {item}
              </button>
            )
          ))}
          
          {/* Mobile Menu User Actions */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <button
              onClick={handleLoginClick}
              className="text-lg tracking-[0.1em] hover:text-teal-400 transition-colors"
            >
              LOGIN
            </button>
            <button
              onClick={handleSignupClick}
              className="text-lg tracking-[0.1em] hover:text-teal-400 transition-colors"
            >
              SIGN UP
            </button>
            <button
              onClick={handleBookingClick}
              className="text-lg tracking-[0.1em] hover:text-teal-400 transition-colors"
            >
              BOOK CONSULTATION
            </button>
            <Button 
              className="bg-teal-600 hover:bg-teal-700 text-white mt-4"
              onClick={handleCartClick}
            >
              VIEW CART ({cartItemsCount})
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LoginModal 
        isOpen={activeModal === 'login'} 
        onClose={handleCloseModal}
        onSwitchToSignup={switchToSignup}
      />
      
      <SignupModal 
        isOpen={activeModal === 'signup'} 
        onClose={handleCloseModal}
        onSwitchToLogin={switchToLogin}
      />

      <BookingConsultation 
        isOpen={showBookingPopup}
        onClose={() => setShowBookingPopup(false)}
      />
    </>
  );
}