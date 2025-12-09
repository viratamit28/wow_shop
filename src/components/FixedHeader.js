import { Search, User, Phone, MapPin, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";
import logo from "../assests/logo.png";

export function FixedHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAppliancesOpen, setIsAppliancesOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAppliancesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black shadow-lg">
       

        {/* Main Header */}
        <div className="py-2 bg-black">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-12">
                {/* Logo */}
                <a href="/" className="flex items-center group">
                  <div className="relative">
                    <img src={logo} alt="logo" className="w-auto h-[70px]"/>
                  </div>
                </a>

                {/* Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                  {navItems.map((item) => (
                    <div key={item} className="relative" ref={item === 'APPLIANCES' ? dropdownRef : null}>
                      {item === 'APPLIANCES' ? (
                        <div>
                          <button
                            onClick={() => setIsAppliancesOpen(!isAppliancesOpen)}
                            className="text-xs tracking-[0.15em] relative group transition-colors duration-300 flex items-center text-white hover:text-teal-600"
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
                            <span className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300 bg-teal-600"></span>
                          </button>

                          {/* Dropdown Menu - Matching Image Structure */}
                          {isAppliancesOpen && (
                            <div className="absolute top-full left-[-245px] right-0 mt-6 w-[calc(100vw-1.7rem)] bg-white shadow-2xl rounded-lg overflow-hidden z-50 border border-gray-200">
                              <div className="p-6 max-w-5xl">
                                {/* Table-like Grid Layout */}
                                <div className="grid grid-cols-5 gap-24">
                                  {appliancesData.map((categoryData, index) => (
                                    <div key={categoryData.category} className="min-w-[200px]">
                                      <h3 className="font-semibold text-yellow-400 text-sm mb-4 pb-2 border-b border-gray-200 text-left">
                                        {categoryData.category}
                                      </h3>
                                      <ul className="space-y-2 text-left">
                                        {categoryData.items.map((item, itemIndex) => (
                                          <li key={itemIndex}>
                                            <a 
                                              href="#" 
                                              className="text-xs text-gray-600 hover:text-teal-600 transition-colors block py-1"
                                            >
                                              {item}
                                            </a>
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
                      ) : (
                        <a
                          href={`#${item.toLowerCase()}`}
                          className="text-xs tracking-[0.15em] relative group transition-colors duration-300 text-white hover:text-teal-600"
                        >
                          {item}
                          <span className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300 bg-teal-600"></span>
                        </a>
                      )}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2 md:gap-4">
                {/* Search with Placeholder */}
                <div className="hidden md:flex items-center gap-2 rounded-lg px-3 py-2 transition-colors cursor-pointer bg-gray-100 hover:bg-gray-200">
                  <Search className="h-5 w-5 text-gray-600" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="text-sm bg-transparent border-none outline-none w-full text-gray-800 placeholder-gray-500"
                  />
                </div>

                {/* Login/Signup */}
                <div className="hidden md:flex items-center gap-2 rounded-lg px-3 py-2 transition-colors cursor-pointer bg-gray-100 hover:bg-gray-200">
                  <User className="h-5 w-5 text-gray-700" />
                  <span className="text-sm text-gray-700">
                    Login / Signup
                  </span>
                </div>

                <Button className="hidden md:flex transition-all duration-300 bg-teal-600 hover:bg-teal-700 text-white">
                  ORDER NOW
                </Button>
                
                {/* Mobile Menu Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-white"
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
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-2xl tracking-[0.2em] hover:text-teal-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <Button className="mt-8 bg-teal-600 hover:bg-teal-700 text-white">
            BOOK CONSULTATION
          </Button>
        </div>
      </div>
    </>
  );
}