import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductGridComponent() {
  const navigate = useNavigate();
  
  // Extended Product List with different names for each product
  const productNames = [
    "KB5A- 34L Built-in Microwave with Grill & Convection",
    "Smart Inverter Microwave Oven 28L with Auto Cook",
    "Compact Solo Microwave 20L for Small Kitchens",
    "Grill Microwave Oven 30L with Ceramic Enamel",
    "Convection Microwave 42L with Steam Clean",
    "Digital Microwave 25L with Child Lock Safety",
    "Stainless Steel Microwave 32L with 100+ Auto Programs",
    "Over-the-Range Microwave 1.7 cu.ft with Exhaust",
    "Countertop Microwave 1.2 cu.ft with Sensor Cooking",
    "Built-in Microwave 27L with Eco Mode",
    "Commercial Microwave 1.8 cu.ft for Restaurants",
    "Mini Microwave 18L for Dorms and Offices",
    "Smart Microwave with WiFi and Voice Control",
    "Microwave Oven 35L with Turntable On/Off",
    "Retro Style Microwave 24L in Vintage Colors",
    "Professional Microwave 40L with Dehydration",
    "Microwave Convection Oven Combo 38L",
    "Compact Microwave 19L with Quick Start",
    "Family Size Microwave 45L with Dual Racks",
    "Energy Efficient Microwave 23L with Eco Mode",
    "Microwave with Air Fryer 34L Combo",
    "Digital Inverter Microwave 31L with Precision Cooking",
    "Stainless Steel Built-in Microwave 28L",
    "Smart Microwave 36L with Recipe Guide"
  ];

  const products = Array.from({ length: 24 }).map((_, i) => ({
    id: i + 1,
    title: productNames[i],
    brand: ["Elica", "Bosch", "Faber", "Glen", "Crompton", "Electrolux"][i % 6],
    price: 5000 + i * 1200,
    oldPrice: 10000 + i * 1400,
    badge: i % 2 === 0 ? "OFFER" : "",
    image: `https://images.unsplash.com/photo-1713514022453-4adc636025a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTk4fHxraXRjaGVuJTIwYXBwbGlhbmNlc3xlbnwwfHwwfHx8MA%3D%3D${i}`,
    features: [
      `Capacity: ${30 + i}L`,
      `Power: ${800 + i * 50}W`,
      i % 3 === 0 ? "Grill Function" : "Convection",
      i % 2 === 0 ? "Auto Cook" : "Manual Control",
      i % 4 === 0 ? "Child Lock" : "Quick Start"
    ]
  }));

  // Brands full list with counts
  const brandList = [
    { name: "Bosch", count: 27 },
    { name: "Carysil", count: 25 },
    { name: "Siemens", count: 29 },
    { name: "Kaff", count: 16 },
    { name: "Elica", count: 126 },
    { name: "Faber", count: 97 },
    { name: "Hafele", count: 26 },
    { name: "Hindware", count: 56 },
    { name: "Blaupunkt", count: 32 },
    { name: "Electrolux", count: 32 },
  ];

  // Installation types with counts
  const installationTypes = [
    { name: "Ceiling Mounted", count: 9 },
    { name: "Down Draft", count: 1 },
    { name: "Island", count: 67 },
    { name: "Straight Line", count: 17 },
    { name: "Under Cabinet Wall Mounted", count: 7 },
    { name: "Wall Mounted", count: 619 },
  ];

  const [showMoreBrands, setShowMoreBrands] = useState(false);
  const visibleBrands = showMoreBrands ? brandList : brandList.slice(0, 8);

  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [selectedInstallations, setSelectedInstallations] = useState(new Set());
  const [sort, setSort] = useState("best");
  const [page, setPage] = useState(1);
  const perPage = 9;

  // Compare functionality states
  const [compareProducts, setCompareProducts] = useState(new Set());
  const [showCompareSidebar, setShowCompareSidebar] = useState(false);

  // Price Range
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(60000);

  // Cart functionality
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on component mount
  React.useEffect(() => {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  React.useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
  }, [cart]);

  function toggleBrand(brandName) {
    const next = new Set(selectedBrands);
    if (next.has(brandName)) next.delete(brandName);
    else next.add(brandName);
    setSelectedBrands(next);
  }

  function toggleInstallation(installationName) {
    const next = new Set(selectedInstallations);
    if (next.has(installationName)) next.delete(installationName);
    else next.add(installationName);
    setSelectedInstallations(next);
  }

  function removeBrand(brandName) {
    const next = new Set(selectedBrands);
    next.delete(brandName);
    setSelectedBrands(next);
  }

  function removeAllFilters() {
    setSelectedBrands(new Set());
    setSelectedInstallations(new Set());
    setMinPrice(0);
    setMaxPrice(60000);
  }

  // Compare functions
  const toggleCompare = (productId) => {
    const next = new Set(compareProducts);
    if (next.has(productId)) {
      next.delete(productId);
    } else {
      if (next.size < 4) { // Limit to 4 products for comparison
        next.add(productId);
      } else {
        alert("You can compare up to 4 products only");
        return;
      }
    }
    setCompareProducts(next);
    
    // Auto-show sidebar when adding first product to compare
    if (next.size > 0 && !showCompareSidebar) {
      setShowCompareSidebar(true);
    }
  };

  const removeFromCompare = (productId) => {
    const next = new Set(compareProducts);
    next.delete(productId);
    setCompareProducts(next);
    
    // Hide sidebar if no products left to compare
    if (next.size === 0) {
      setShowCompareSidebar(false);
    }
  };

  const clearAllCompare = () => {
    setCompareProducts(new Set());
    setShowCompareSidebar(false);
  };

  // Navigation functions
  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`, { 
      state: { product } 
    });
  };

  const handleBuyNow = (product) => {
    // Add product to cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    // Navigate to cart page
    navigate('/cart');
  };

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    // Show success notification
    alert(`${product.title} added to cart!`);
  };

  function filteredProducts() {
    let arr = products.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    if (selectedBrands.size > 0) {
      arr = arr.filter((p) => selectedBrands.has(p.brand));
    }

    if (sort === "price-asc") arr = arr.slice().sort((a, b) => a.price - b.price);
    if (sort === "price-desc") arr = arr.slice().sort((a, b) => b.price - a.price);

    return arr;
  }

  const paginated = filteredProducts().slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredProducts().length / perPage);

  // Get compared products data
  const comparedProducts = Array.from(compareProducts).map(id => 
    products.find(p => p.id === id)
  ).filter(Boolean);

  return (
    <div className="min-h-screen bg-white p-4 relative">
      {/* Bestselling Products Heading */}
      <div className="max-w-[1400px] mx-auto mb-8">
        <div className="text-left">
          <h1 className="text-5xl md:text-6xl font-light mb-6">
          Bestselling <span className="font-semibold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Products</span>
          </h1>
        </div>
      </div>

      {/* Compare Sidebar */}
      <div className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transition-transform duration-300 ${
        showCompareSidebar ? 'translate-x-0' : 'translate-x-full'
      }`} style={{ width: '480px' }}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">
              Compare Products ({compareProducts.size}/4)
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearAllCompare}
                className="text-sm text-gray-600 hover:text-black underline"
              >
                Clear All
              </button>
              <button 
                onClick={() => setShowCompareSidebar(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Compare Content */}
          <div className="flex-1 overflow-auto p-6">
            {comparedProducts.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No products selected for comparison</p>
                <p className="text-sm mt-2">Select up to 4 products to compare</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Products Row */}
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${comparedProducts.length}, 1fr)` }}>
                  {comparedProducts.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="h-32 bg-gray-100 rounded flex items-center justify-center mb-3 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-sm font-medium line-clamp-2 mb-2">{product.title}</h4>
                      <div className="text-lg font-bold text-green-600">
                        ₹{product.price.toLocaleString()}
                      </div>
                      <button 
                        onClick={() => removeFromCompare(product.id)}
                        className="w-full mt-3 py-2 border border-red-500 text-red-500 rounded text-sm hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Features Comparison */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Features Comparison</h3>
                  <div className="space-y-3">
                    {['Brand', 'Price', 'Capacity', 'Power', 'Features'].map((feature) => (
                      <div key={feature} className="grid gap-4 text-sm" style={{ gridTemplateColumns: `repeat(${comparedProducts.length + 1}, 1fr)` }}>
                        <div className="font-medium text-gray-700">{feature}</div>
                        {comparedProducts.map((product) => (
                          <div key={`${product.id}-${feature}`}>
                            {feature === 'Brand' && <span>{product.brand}</span>}
                            {feature === 'Price' && <span>₹{product.price.toLocaleString()}</span>}
                            {feature === 'Capacity' && <span>{product.features[0]}</span>}
                            {feature === 'Power' && <span>{product.features[1]}</span>}
                            {feature === 'Features' && (
                              <ul className="text-xs space-y-1">
                                {product.features.slice(2).map((feat, idx) => (
                                  <li key={idx}>• {feat}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {comparedProducts.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              <button className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition">
                Compare Selected Products
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Compare FAB */}
      {compareProducts.size > 0 && !showCompareSidebar && (
        <button 
          onClick={() => setShowCompareSidebar(true)}
          className="fixed bottom-6 right-6 bg-black text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800 transition flex items-center gap-2 z-40"
        >
          <span>Compare ({compareProducts.size})</span>
        </button>
      )}

      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-16">
        {/* Filters */}
        <aside className="col-span-3 bg-white mt-10 h-fit">
          {/* Filter Header with Remove All */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold tracking-wide">Filter:</h3>
            {(selectedBrands.size > 0 || selectedInstallations.size > 0) && (
              <button 
                onClick={removeAllFilters}
                className="text-sm text-gray-600 hover:text-black underline"
              >
                Remove all
              </button>
            )}
          </div>

          {/* Active Filter Tags */}
          {selectedBrands.size > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {Array.from(selectedBrands).map((brand) => (
                <div key={brand} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                  <span>Brand: {brand}</span>
                  <button 
                    onClick={() => removeBrand(brand)}
                    className="text-gray-500 hover:text-black ml-1"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-200">
            {/* Brand Filter */}
            <details className="border-b border-gray-200 group" open>
              <summary className="flex items-center justify-between py-3 text-sm text-gray-800 cursor-pointer list-none">
                <div className="flex items-center gap-2">
                  <span>Brand</span>
                  {selectedBrands.size > 0 && (
                    <span className="bg-gray-200 text-xs px-2 py-0.5 rounded">
                      {selectedBrands.size}
                    </span>
                  )}
                </div>
                <span className="transition-transform duration-200 group-open:rotate-180 text-gray-500">
                  ▾
                </span>
              </summary>

              <div className="pb-3 space-y-2">
                <div className="space-y-2 max-h-56 overflow-auto pr-1">
                  {visibleBrands.map((b) => (
                    <label
                      key={b.name}
                      className="flex items-center justify-between text-sm gap-2 cursor-pointer hover:bg-gray-50 px-1 py-1 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedBrands.has(b.name)}
                          onChange={() => toggleBrand(b.name)}
                          className="h-4 w-4 border-gray-400 rounded-sm"
                        />
                        <span>{b.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">({b.count})</span>
                    </label>
                  ))}
                </div>
                {brandList.length > 8 && (
                  <button
                    onClick={() => setShowMoreBrands(!showMoreBrands)}
                    className="mt-1 text-xs font-medium text-gray-700 underline"
                  >
                    {showMoreBrands ? "Show less" : "+ Show more"}
                  </button>
                )}
              </div>
            </details>

            {/* Price Filter */}
            <details className="border-b border-gray-200 group">
              <summary className="flex items-center justify-between py-3 text-sm text-gray-800 cursor-pointer list-none">
                <span>Price</span>
                <span className="transition-transform duration-200 group-open:rotate-180 text-gray-500">
                  ▾
                </span>
              </summary>

              <div className="pb-3">
                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-20 border border-gray-300 rounded px-2 py-1"
                    placeholder="Min"
                  />
                  <span>—</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-20 border border-gray-300 rounded px-2 py-1"
                    placeholder="Max"
                  />
                </div>
              </div>
            </details>

            {/* Installation Type Filter */}
            <details className="border-b border-gray-200 group">
              <summary className="flex items-center justify-between py-3 text-sm text-gray-800 cursor-pointer list-none">
                <span>Installation Type</span>
                <span className="transition-transform duration-200 group-open:rotate-180 text-gray-500">
                  ▾
                </span>
              </summary>

              <div className="pb-3 space-y-2">
                <div className="space-y-2 max-h-56 overflow-auto pr-1">
                  {installationTypes.map((type) => (
                    <label
                      key={type.name}
                      className="flex items-center justify-between text-sm gap-2 cursor-pointer hover:bg-gray-50 px-1 py-1 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedInstallations.has(type.name)}
                          onChange={() => toggleInstallation(type.name)}
                          className="h-4 w-4 border-gray-400 rounded-sm"
                        />
                        <span>{type.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">({type.count})</span>
                    </label>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </aside>

        {/* Products */}
        <main className="col-span-9">
          <div className="flex items-center justify-between mb-5">
            <div className="text-sm text-gray-600 font-medium">{filteredProducts().length} products found</div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-600">Sort by:</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white shadow-sm hover:border-black transition">
                <option value="best">Best selling</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((p) => (
              <article
                key={p.id}
                className="bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 "
              >
                <div className="relative bg-gradient-to-b from-gray-200 via-gray-100 to-white h-60 flex items-center justify-center overflow-hidden">
                  <img 
                    src={p.image} 
                    alt={p.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                  />
                  {p.badge && (
                    <span className="absolute left-4 top-4 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                      {p.badge}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h4 className="text-[15px] font-semibold text-gray-900 leading-tight line-clamp-2 text-left mb-2">
                    {p.title}
                  </h4>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {p.brand}
                    </span>
                  </div>

                  <div className="mt-2 flex items-baseline gap-3">
                    <div className="text-xl font-bold text-green-600">₹{p.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-400 line-through">
                      ₹{p.oldPrice.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <input 
                      type="checkbox" 
                      checked={compareProducts.has(p.id)}
                      onChange={() => toggleCompare(p.id)}
                      className="w-4 h-4 border-gray-400 rounded-sm" 
                    />
                    <span className="text-sm text-gray-700">Compare</span>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button 
                      onClick={() => handleViewDetails(p)}
                      className="w-1/2 py-2 border border-black rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleBuyNow(p)}
                      className="w-1/2 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 gap-3">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i} 
                onClick={() => setPage(i + 1)} 
                className={`px-4 py-2 rounded-md border text-sm ${page === i + 1 ? "bg-yellow-400 text-white border-yellow-400" : "bg-white border-gray-300"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}