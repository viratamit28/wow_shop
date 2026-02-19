import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // Context import kiya
import { Eye, ShoppingCart, ArrowRight } from "lucide-react"; // Icons ke liye

// 🔥 CLOUDINARY CONFIG
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dcljdkqer/image/upload/";

export default function SuggestedProducts() {
  const { token, refreshCart } = useContext(AuthContext);
  const navigate = useNavigate();

  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Slider states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const productsPerSlide = 4;

  // 1. Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        setSuggestedProducts(data);
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

  // Auto slide
  useEffect(() => {
    if (!isAutoPlaying || totalSlides === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000); 
    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const nextSlide = () => { if (totalSlides > 0) setCurrentSlide((prev) => (prev + 1) % totalSlides); };
  const prevSlide = () => { if (totalSlides > 0) setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides); };
  const goToSlide = (index) => { setCurrentSlide(index); };

  // 🔥 2. ADD TO CART FUNCTION
  const handleAddToCart = async (e, productId) => {
    e.stopPropagation(); // Taki parent click trigger na ho
    
    if (!token) {
        alert("Please Login to create your project list!");
        return;
    }

    try {
        await axios.post('http://localhost:5000/api/cart/add', 
            { productId, quantity: 1 }, 
            { headers: { 'auth-token': token } }
        );
        refreshCart(); // Cart count update karega
        alert("Item added to your Inquiry List!");
    } catch (err) {
        console.error(err);
        alert("Could not add item.");
    }
  };

  // Navigation Helper
  const handleProductClick = (id) => {
    navigate(`/product-details/${id}`);
  };

  if (loading) return <div className="py-12 text-center text-gray-400">Loading Recommendations...</div>;
  if (suggestedProducts.length === 0) return null;

  return (
    <div className="bg-white py-12 px-4 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">
            Curated <span className="font-bold text-amber-600">Essentials</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore our most sought-after appliances for your modern kitchen.
          </p>
        </div>

        {/* Slider */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Arrows */}
          {totalSlides > 1 && (
            <>
              <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-black hover:text-white transition-all">
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-black hover:text-white transition-all">
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Grid */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {suggestedProducts.map((product) => {
                // 🔥 IMAGE FIX LOGIC
                let displayImg = product.image;
                if (Array.isArray(displayImg)) {
                    displayImg = displayImg.length > 0 ? displayImg[0] : "";
                }
                const imageUrl = displayImg && displayImg.startsWith('http') 
                    ? displayImg 
                    : `${CLOUDINARY_BASE_URL}${displayImg}.jpg`;

                return (
                    <div 
                      key={product._id || Math.random()} 
                      className="flex-shrink-0 px-3"
                      style={{ width: `${100 / productsPerSlide}%` }}
                    >
                      <article 
                        onClick={() => handleProductClick(product._id)}
                        className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer h-full flex flex-col"
                      >
                        {/* Image */}
                        <div className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden p-4">
                          <img 
                            src={imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                            onError={(e) => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }}
                          />
                          {product.tag && (
                            <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                              {product.tag}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-grow">
                          <div className="mb-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {product.brand}
                          </div>
                          
                          <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 line-clamp-2 flex-grow">
                            {product.name}
                          </h3>

                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-lg font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
                            <span className="text-xs text-green-600 font-bold">20% OFF</span>
                          </div>

                          {/* 🔥 NEW BUTTONS */}
                          <div className="grid grid-cols-2 gap-2 mt-auto">
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleProductClick(product._id); }}
                                className="py-2 border border-gray-200 rounded text-xs font-bold uppercase hover:bg-gray-50 transition flex items-center justify-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> View
                            </button>
                            <button 
                                onClick={(e) => handleAddToCart(e, product._id)}
                                className="py-2 bg-black text-white rounded text-xs font-bold uppercase hover:bg-amber-600 transition flex items-center justify-center gap-1"
                            >
                              <ShoppingCart className="w-3 h-3" /> Add
                            </button>
                          </div>
                        </div>
                      </article>
                    </div>
                );
              })}
            </div>
          </div>

          {/* Dots */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-black w-8" : "bg-gray-200 w-2 hover:bg-gray-300"
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