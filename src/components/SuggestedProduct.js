import React, { useState, useEffect } from "react";

export default function SuggestedProducts() {
  // Suggested kitchen appliances products
  const suggestedProducts = [
    {
      id: 1,
      title: "Smart Inverter Microwave Oven 28L",
      brand: "Samsung",
      price: 18999,
      oldPrice: 22999,
      badge: "POPULAR",
      image: "https://images.unsplash.com/photo-1597848212624-e5d0e154a67f?w=400&auto=format&fit=crop&q=60",
      rating: 4.5
    },
    {
      id: 2,
      title: "4-Burner Glass Top Gas Stove",
      brand: "Pigeon",
      price: 12499,
      oldPrice: 15999,
      badge: "TRENDING",
      image: "https://images.unsplash.com/photo-1581093458791-9d33f4726d22?w=400&auto=format&fit=crop&q=60",
      rating: 4.3
    },
    {
      id: 3,
      title: "Digital Air Fryer 5.5L with Touch Control",
      brand: "Philips",
      price: 14999,
      oldPrice: 18999,
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&auto=format&fit=crop&q=60",
      rating: 4.7
    },
    {
      id: 4,
      title: "Stainless Steel Food Processor",
      brand: "Morphy Richards",
      price: 8999,
      oldPrice: 11999,
      badge: "DEAL",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&auto=format&fit=crop&q=60",
      rating: 4.2
    },
    {
      id: 5,
      title: "Induction Cooktop 2000W",
      brand: "Prestige",
      price: 7599,
      oldPrice: 9999,
      badge: "SAVE 24%",
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&auto=format&fit=crop&q=60",
      rating: 4.4
    },
    {
      id: 6,
      title: "Electric Kettle 1.5L Stainless Steel",
      brand: "Havells",
      price: 2999,
      oldPrice: 3999,
      badge: "BESTSELLER",
      image: "https://images.unsplash.com/photo-1595344154993-764a8e4c9b19?w=400&auto=format&fit=crop&q=60",
      rating: 4.6
    },
    {
      id: 7,
      title: "Blender with 5 Speed Settings",
      brand: "Butterfly",
      price: 4599,
      oldPrice: 5999,
      badge: "NEW",
      image: "https://images.unsplash.com/photo-1621791487e6d5cd6a49eaf3e2d6e5f8?w=400&auto=format&fit=crop&q=60",
      rating: 4.1
    },
    {
      id: 8,
      title: "Toaster 4-Slice Automatic",
      brand: "Kenstar",
      price: 3899,
      oldPrice: 4999,
      badge: "LIMITED",
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&auto=format&fit=crop&q=60",
      rating: 4.0
    },
    {
      id: 9,
      title: "Coffee Maker with Grinder",
      brand: "DeLonghi",
      price: 24999,
      oldPrice: 29999,
      badge: "PREMIUM",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop&q=60",
      rating: 4.8
    },
    {
      id: 10,
      title: "Rice Cooker 1.8L Digital",
      brand: "Panasonic",
      price: 6999,
      oldPrice: 8999,
      badge: "SMART",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=60",
      rating: 4.5
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const productsPerSlide = 4;

  // Calculate total slides
  const totalSlides = Math.ceil(suggestedProducts.length / productsPerSlide);

  // Auto slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 1000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Get products for current slide
  const getCurrentSlideProducts = () => {
    const startIndex = currentSlide * productsPerSlide;
    return suggestedProducts.slice(startIndex, startIndex + productsPerSlide);
  };

  return (
    <div className="bg-white py-12 px-4">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light mb-4">
            Suggested <span className="font-semibold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Kitchen Appliances</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our top-rated kitchen appliances that make cooking easier and more enjoyable
          </p>
        </div>

        {/* Products Slider */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white border border-gray-300 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white border border-gray-300 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Products Grid */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * (100 / productsPerSlide)}%)` }}
            >
              {suggestedProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / productsPerSlide}%` }}
                >
                  <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                    {/* Product Image */}
                    <div className="relative bg-gradient-to-b from-gray-100 to-white h-48 flex items-center justify-center overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      {product.badge && (
                        <span className="absolute left-3 top-3 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      {/* Brand */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                          {product.brand}
                        </span>
                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          <div className="flex text-yellow-400 text-sm">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <span key={idx}>
                                {idx < Math.floor(product.rating) ? "★" : "☆"}
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">
                            ({product.rating})
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 mb-3 h-12">
                        {product.title}
                      </h3>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <div className="text-lg font-bold text-green-600">
                          ₹{product.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400 line-through">
                          ₹{product.oldPrice.toLocaleString()}
                        </div>
                        <div className="text-xs text-red-600 font-semibold ml-auto">
                          {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 border border-black rounded text-sm font-medium hover:bg-gray-100 transition">
                          View Details
                        </button>
                        <button className="flex-1 py-2 bg-black text-white rounded text-sm font-medium hover:bg-gray-800 transition">
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? "bg-black w-8" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <button className="px-8 py-3 border-2 border-black text-black rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105">
            View All Kitchen Appliances
          </button>
        </div>
      </div>
    </div>
  );
}