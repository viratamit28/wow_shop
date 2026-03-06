import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; 
import { Eye, ShoppingCart, ArrowRight } from "lucide-react"; 

// 🔥 FIX 1: Deployment Ready URL
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function SuggestedProducts() {
  const { token, refreshCart } = useContext(AuthContext);
  const navigate = useNavigate();

  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // 🔥 FIX 3: Window resize ke hisaab se productsPerSlide calculate karna (Responsive Bug Fix)
  const [productsPerSlide, setProductsPerSlide] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setProductsPerSlide(1); // Mobile
      else if (window.innerWidth < 1024) setProductsPerSlide(2); // Tablet
      else if (window.innerWidth < 1280) setProductsPerSlide(3); // Small Laptop
      else setProductsPerSlide(4); // Desktop
    };
    
    // Set initial value
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/products`);
        setSuggestedProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Data fetch error:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const totalSlides = suggestedProducts.length > 0 
    ? Math.ceil(suggestedProducts.length / productsPerSlide) 
    : 0;

  useEffect(() => {
    if (!isAutoPlaying || totalSlides <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000); 
    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const nextSlide = () => { if (totalSlides > 0) setCurrentSlide((prev) => (prev + 1) % totalSlides); };
  const prevSlide = () => { if (totalSlides > 0) setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides); };
  const goToSlide = (index) => { setCurrentSlide(index); };

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation(); 
    
    if (!token) {
        alert("Please Login to create your project list!");
        return;
    }

    try {
        await axios.post(`${BACKEND_URL}/api/cart/add`, 
            { productId, quantity: 1 }, 
            { headers: { 'auth-token': token } }
        );
        refreshCart(); 
        alert("Item added to your Inquiry List!");
    } catch (err) {
        console.error(err);
        alert("Could not add item.");
    }
  };

  const handleProductClick = (id) => {
    navigate(`/product-details/${id}`);
  };

  if (loading) return <div className="py-12 text-center text-gray-400 font-bold tracking-widest text-[10px] uppercase animate-pulse">Loading Recommendations...</div>;
  if (suggestedProducts.length === 0) return null;

  return (
    <div className="bg-white py-12 md:py-20 px-4">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4 text-gray-900 tracking-tight">
            Curated <span className="font-bold text-amber-600">Essentials</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-light text-sm">
            Explore our most sought-after appliances for your modern kitchen.
          </p>
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {totalSlides > 1 && (
            <>
              <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-10 bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all">
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-10 bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all">
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          <div className="overflow-hidden px-2 py-4">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {suggestedProducts.map((product) => {
                let displayImg = product.image;
                if (Array.isArray(displayImg)) {
                    displayImg = displayImg.length > 0 ? displayImg[0] : "";
                }
                const cleanPath = typeof displayImg === 'string' ? displayImg.replace(/\\/g, '/') : '';
                const imageUrl = displayImg && displayImg.startsWith('http') 
                    ? displayImg 
                    : `${BACKEND_URL}/${cleanPath}`;

                return (
                    <div 
                      key={product._id || Math.random()} 
                      className="flex-shrink-0 px-3"
                      style={{ width: `${100 / productsPerSlide}%` }}
                    >
                      <article 
                        onClick={() => handleProductClick(product._id)}
                        className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer h-full flex flex-col"
                      >
                        <div className="relative h-48 md:h-56 bg-gray-50 flex items-center justify-center overflow-hidden p-6">
                          <img 
                            src={imageUrl} 
                            alt={product.name}
                            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
                            onError={(e) => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }}
                          />
                          {product.tag && (
                            <span className="absolute top-4 left-4 bg-gray-900 text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest rounded shadow-sm">
                              {product.tag}
                            </span>
                          )}
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                          <div className="mb-2 text-[10px] font-extrabold text-amber-600 uppercase tracking-widest">
                            {product.brand || "Exclusive"}
                          </div>
                          
                          <h3 className="text-sm md:text-base font-bold text-gray-900 leading-snug mb-2 line-clamp-2 flex-grow group-hover:text-amber-600 transition-colors">
                            {product.name}
                          </h3>

                          <div className="flex items-baseline gap-2 mb-5 border-t border-gray-100 pt-4 mt-2">
                            <span className="text-lg md:text-xl font-serif font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mt-auto">
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleProductClick(product._id); }}
                                className="py-2.5 border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </button>
                            <button 
                                onClick={(e) => handleAddToCart(e, product._id)}
                                className="py-2.5 bg-gray-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition shadow-md flex items-center justify-center gap-1.5"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" /> Add
                            </button>
                          </div>
                        </div>
                      </article>
                    </div>
                );
              })}
            </div>
          </div>

          {totalSlides > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-amber-600 w-8" : "bg-gray-200 w-2 hover:bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}