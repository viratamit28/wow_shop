import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Loader2, Package, SearchX, SlidersHorizontal, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// === ASSETS IMPORT ===
import imgOven from '../assests/oven.jpg';
import imgChimney from '../assests/chemni.jpg';
import imgFridge from '../assests/refrigarator.jpg';
import imgCountertop from '../assests/countertop.jpg';
import imgLaundry from '../assests/laundry.jpg';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dcljdkqer/image/upload/";

// === DYNAMIC HEADER IMAGE HELPER ===
const getHeaderImage = (title) => {
  if (!title) return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000"; 
  const t = title.toLowerCase();
  if (t.includes('oven')) return imgOven;
  if (t.includes('chimney') || t.includes('hood') || t.includes('hobs')) return imgChimney;
  if (t.includes('refrigerator') || t.includes('fridge')) return imgFridge;
  if (t.includes('countertop') || t.includes('small') || t.includes('appliances')) return imgCountertop;
  if (t.includes('washing') || t.includes('laundry')) return imgLaundry;
  return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000"; 
};

export default function ProductGridComponent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token, refreshCart } = useContext(AuthContext);
  
  // URL Filters
  const categoryFilter = searchParams.get('category');
  const typeFilter = searchParams.get('type');
  const searchFilter = searchParams.get('search');
  const brandFilter = searchParams.get('brand'); 

  // States
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState(new Set(brandFilter ? [brandFilter] : []));
  const [sort, setSort] = useState("best");
  const [page, setPage] = useState(1);
  const perPage = 12; 
  const [dynamicBrands, setDynamicBrands] = useState([]);
  const [showMoreBrands, setShowMoreBrands] = useState(false);
  const [compareProducts, setCompareProducts] = useState(new Set());
  const [showCompareSidebar, setShowCompareSidebar] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000); 

  // 1. FETCH DATA
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = new URL(`${BACKEND_URL}/api/products`);
        if (categoryFilter) url.searchParams.append("category", categoryFilter);
        if (typeFilter) url.searchParams.append("type", typeFilter);
        if (searchFilter) url.searchParams.append("search", searchFilter);

        const res = await axios.get(url.toString());
        const fetchedProducts = res.data;
        setDbProducts(fetchedProducts);

        if (fetchedProducts.length > 0) {
            const brandsObj = {};
            fetchedProducts.forEach(p => {
                if (p.brand) {
                    brandsObj[p.brand] = (brandsObj[p.brand] || 0) + 1;
                }
            });
            const brandsArray = Object.entries(brandsObj).map(([name, count]) => ({ name, count }));
            brandsArray.sort((a, b) => b.count - a.count);
            setDynamicBrands(brandsArray);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryFilter, typeFilter, searchFilter]);

  // 2. IMAGE URL HELPER
  const getImageUrl = (imgData) => {
    let img = imgData;
    if (Array.isArray(img)) img = img.length > 0 ? img[0] : "";
    if (!img) return "https://placehold.co/300?text=No+Img";
    if (img.startsWith('http')) return img;
    const cleanPath = typeof img === 'string' ? img.replace(/\\/g, '/') : '';
    return `${CLOUDINARY_BASE_URL}${cleanPath}`; 
  };

  // 3. FILTERING & SORTING LOGIC
  function filteredProducts() {
    let arr = dbProducts.filter((p) => (p.price || 0) >= minPrice && (p.price || 0) <= maxPrice);
    if (selectedBrands.size > 0) {
      arr = arr.filter((p) => p.brand && selectedBrands.has(p.brand));
    }
    if (sort === "price-asc") arr = arr.slice().sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "price-desc") arr = arr.slice().sort((a, b) => (b.price || 0) - (a.price || 0));
    return arr;
  }

  const resultList = filteredProducts();
  const paginated = resultList.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(resultList.length / perPage);

  const toggleBrand = (brandName) => {
    const next = new Set(selectedBrands);
    if (next.has(brandName)) next.delete(brandName);
    else next.add(brandName);
    setSelectedBrands(next);
    setPage(1); 
  };

  const removeAllFilters = () => {
    setSelectedBrands(new Set());
    setMinPrice(0);
    setMaxPrice(500000);
    setPage(1);
  };

  // 4. ACTIONS (Buy, Compare)
  const handleBuyNow = async (product) => {
    if (!token) return alert("Please Login to add items to your portfolio!");
    try {
      await axios.post(`${BACKEND_URL}/api/cart/add`, 
        { productId: product._id, quantity: 1 }, 
        { headers: { 'auth-token': token } }
      );
      refreshCart(); 
      navigate('/cart'); 
    } catch (err) {
      alert("Could not add to portfolio. Try again.");
    }
  };

  const toggleCompare = (productId) => {
    const next = new Set(compareProducts);
    if (next.has(productId)) next.delete(productId);
    else {
      if (next.size < 4) next.add(productId);
      else return alert("You can compare up to 4 products only.");
    }
    setCompareProducts(next);
    if (next.size > 0 && !showCompareSidebar) setShowCompareSidebar(true);
  };

  const removeFromCompare = (productId) => {
    const next = new Set(compareProducts);
    next.delete(productId);
    setCompareProducts(next);
    if (next.size === 0) setShowCompareSidebar(false);
  };

  const clearAllCompare = () => {
    setCompareProducts(new Set());
    setShowCompareSidebar(false);
  };

  const comparedProductsData = Array.from(compareProducts)
    .map(id => dbProducts.find(p => p._id === id))
    .filter(Boolean);

  // Render Loader
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="w-12 h-12 text-amber-600 animate-spin mb-6" strokeWidth={1}/>
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] animate-pulse">Curating The Collection...</span>
      </div>
    );
  }

  const visibleBrands = showMoreBrands ? dynamicBrands : dynamicBrands.slice(0, 6);
  const pageTitle = brandFilter ? `${brandFilter}` : searchFilter ? `"${searchFilter}"` : typeFilter || categoryFilter || "The Complete";

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-24 pt-28">
      
      {/* === HEADER SECTION (Cinematic Banner) === */}
      <div className="relative w-full h-[40vh] min-h-[350px] mb-12 flex items-center mt-[-112px]"> 
        <div className="absolute inset-0">
          <img src={getHeaderImage(pageTitle)} alt={pageTitle} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-transparent to-transparent opacity-90" />
        </div>

        <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row md:items-end justify-between gap-8 pt-24">
            <div className="max-w-3xl">
                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-[1px] bg-amber-500" />
                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-500">Masterpieces</span>
                </motion.div>
                <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.1}} className="text-5xl md:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-[1.1] capitalize drop-shadow-lg">
                  {pageTitle} <span className="italic font-light text-gray-300">Collection.</span>
                </motion.h1>
            </div>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 0.3}} className="text-sm text-gray-300 font-light flex items-center gap-2 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-xl mb-4 md:mb-0">
                Showing <strong className="text-white font-medium">{resultList.length}</strong> exclusive designs
            </motion.div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* === LEFT SIDEBAR: FILTERS === */}
        <aside className="lg:col-span-3 h-fit lg:sticky lg:top-32">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Refine
            </h3>
            {(selectedBrands.size > 0 || minPrice > 0 || maxPrice < 500000) && (
              <button onClick={removeAllFilters} className="text-[10px] font-bold uppercase tracking-widest text-amber-600 hover:text-gray-900 transition-colors">
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-10">
            {dynamicBrands.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">Design Houses</h4>
                <div className="space-y-3.5">
                  {visibleBrands.map((b) => (
                    <label key={b.name} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300 ${selectedBrands.has(b.name) ? 'bg-amber-600 border-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.3)]' : 'bg-transparent border-gray-300 group-hover:border-amber-400'}`}>
                           {selectedBrands.has(b.name) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <input type="checkbox" checked={selectedBrands.has(b.name)} onChange={() => toggleBrand(b.name)} className="hidden" />
                        <span className={`text-sm transition-colors duration-300 ${selectedBrands.has(b.name) ? 'text-gray-900 font-medium' : 'text-gray-500 group-hover:text-gray-900'}`}>{b.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">{b.count}</span>
                    </label>
                  ))}
                </div>
                {dynamicBrands.length > 6 && (
                  <button onClick={() => setShowMoreBrands(!showMoreBrands)} className="mt-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-amber-600 transition-colors flex items-center gap-1">
                    {showMoreBrands ? "- View Less" : "+ View All"}
                  </button>
                )}
              </div>
            )}

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">Investment Range</h4>
              <div className="flex items-center gap-3">
                <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                    <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="w-full bg-white border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-sm text-gray-900 outline-none focus:border-amber-500 transition-all shadow-sm" placeholder="Min" />
                </div>
                <span className="text-gray-300">—</span>
                <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                    <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full bg-white border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-sm text-gray-900 outline-none focus:border-amber-500 transition-all shadow-sm" placeholder="Max" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* === RIGHT COLUMN: PRODUCT GRID === */}
        <main className="lg:col-span-9">
          <div className="flex justify-end mb-8">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sort by</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent text-xs font-bold text-gray-900 outline-none cursor-pointer">
                  <option value="best">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
          </div>

          {paginated.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-40">
              <SearchX className="w-16 h-16 text-gray-200 mx-auto mb-6" strokeWidth={1} />
              <h3 className="text-3xl font-serif text-gray-900 mb-3">No Masterpieces Found</h3>
              <p className="text-gray-500 font-light mb-8 max-w-sm mx-auto">Try adjusting your filters or explore our complete architectural collection.</p>
              <button onClick={removeAllFilters} className="bg-gray-900 text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                Clear All Filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
              {paginated.map((p, index) => (
                <motion.article 
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, ease: "easeOut" }}
                  key={p._id} 
                  className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col relative"
                >
                  {/* Explicit Compare Checkbox */}
                  <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200 shadow-sm flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
                     <input type="checkbox" checked={compareProducts.has(p._id)} onChange={() => toggleCompare(p._id)} className="w-3.5 h-3.5 accent-amber-600 cursor-pointer" />
                     <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest pt-[1px]">Compare</span>
                  </div>

                  {/* Product Image */}
                  <div className="relative bg-[#F5F5F7] aspect-[4/3] flex items-center justify-center p-8 cursor-pointer" onClick={() => navigate(`/product-details/${p._id}`)}>
                    <img src={getImageUrl(p.image)} alt={p.name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 hover:scale-105" />
                  </div>

                  {/* Product Details & Actions */}
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.25em] mb-1.5 block">{p.brand || 'Exclusive'}</span>
                    <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-3 cursor-pointer hover:text-amber-600 transition-colors" onClick={() => navigate(`/product-details/${p._id}`)}>
                      {p.name}
                    </h4>
                    
                    <div className="mt-auto mb-5">
                      <div className="text-xl font-serif font-bold text-gray-900 tracking-tight">₹{p.price?.toLocaleString()}</div>
                    </div>

                    {/* Explicit Actions (Details & Add to Cart) */}
                    <div className="flex gap-3">
                      <button onClick={(e) => { e.stopPropagation(); navigate(`/product-details/${p._id}`); }} className="flex-1 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all">
                        Details
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleBuyNow(p); }} className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 shadow-md hover:shadow-amber-500/20 transition-all">
                        Add to List
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-20 gap-3 border-t border-gray-100 pt-10">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button 
                  key={i} onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className={`w-12 h-12 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-300 ${page === i + 1 ? "bg-gray-900 text-white shadow-lg" : "bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-900"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* === COMPARE SIDEBAR === */}
      <AnimatePresence>
        {showCompareSidebar && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCompareSidebar(false)} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] text-white shadow-2xl z-50 flex flex-col">
              <div className="flex items-center justify-between p-8 border-b border-white/10">
                <h2 className="text-2xl font-serif tracking-tight">Compare ({compareProducts.size}/4)</h2>
                <div className="flex items-center gap-5">
                  <button onClick={clearAllCompare} className="text-[9px] uppercase tracking-widest font-bold text-white/50 hover:text-amber-500 transition-colors">Clear</button>
                  <button onClick={() => setShowCompareSidebar(false)} className="text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"><X className="w-5 h-5"/></button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-8 custom-scrollbar">
                {comparedProductsData.length === 0 ? (
                  <div className="text-center text-white/30 mt-20">
                    <SlidersHorizontal className="w-12 h-12 mx-auto mb-5 opacity-50" strokeWidth={1} />
                    <p className="text-sm font-light">No items selected.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid gap-4 grid-cols-2">
                      {comparedProductsData.map((product) => (
                        <div key={product._id} className="bg-white/5 rounded-2xl p-4 flex flex-col relative group border border-white/10">
                          <button onClick={() => removeFromCompare(product._id)} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white/50 rounded-full hover:text-red-500 hover:bg-black z-10 transition-all"><X className="w-3 h-3"/></button>
                          <div className="h-28 bg-white rounded-xl flex items-center justify-center mb-4 p-3">
                            <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                          </div>
                          <p className="text-[9px] uppercase tracking-widest font-bold text-amber-500 mb-1">{product.brand || 'Exclusive'}</p>
                          <h4 className="text-xs font-medium text-white/90 line-clamp-2 mb-3 flex-grow">{product.name}</h4>
                          <div className="text-sm font-serif text-white">₹{product.price?.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                    {/* Add Navigation to a dedicated compare page if needed, or keep as specs view trigger */}
                    <button className="w-full mt-6 py-4 bg-amber-600 text-black text-[10px] font-extrabold uppercase tracking-widest rounded-xl hover:bg-amber-500 transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                      View Detailed Specs
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* COMPARE FLOATING BUTTON */}
      {compareProducts.size > 0 && !showCompareSidebar && (
        <button 
          onClick={() => setShowCompareSidebar(true)}
          className="fixed bottom-8 right-8 bg-gray-900 text-white pl-6 pr-2 py-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:bg-amber-600 hover:-translate-y-1 transition-all flex items-center gap-4 z-40"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest">Compare</span>
          <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">{compareProducts.size}</span>
        </button>
      )}

    </div>
  );
}