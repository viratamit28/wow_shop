import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { 
  Star, Share2, Plus, Minus, Box, FileText, 
  Truck, ShieldCheck, RotateCcw, CheckCircle, Loader2,
  ChevronRight, ChevronLeft, ArrowRight, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from "../context/AuthContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, refreshCart } = useContext(AuthContext);

  const [product, setProduct] = useState(null); 
  const [similarProducts, setSimilarProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(""); 
  const [quantity, setQuantity] = useState(1); 
  const [adding, setAdding] = useState(false); 

  // 🔥 NEW STATES FOR ZOOM EFFECT
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const sliderRef = useRef(null);

  const categories = [
    { name: "Ovens", dbCategory: "ovens", dbType: "Ovens", image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=600&auto=format&fit=crop" },
    { name: "Hobs", dbCategory: "hobs", dbType: "Hobs", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop" },
    { name: "Chimneys", dbCategory: "chimneys", dbType: "Chimneys", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=600&auto=format&fit=crop" },
    { name: "Refrigerators", dbCategory: "refrigerators", dbType: "Refrigerators", image: "https://images.unsplash.com/photo-1571175443880-49e1d58b95da?q=80&w=600&auto=format&fit=crop" },
    { name: "Dishwashers", dbCategory: "dishwashers", dbType: "Dishwashers", image: "https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?q=80&w=600&auto=format&fit=crop" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const res = await axios.get(`${BACKEND_URL}/api/products/${id}`);
        const data = res.data;
        setProduct(data);
        
        // 🔥 CHANGE: data.image -> data.Image
        let initialImg = data.Image;
        if (Array.isArray(initialImg)) {
            initialImg = initialImg.length > 0 ? initialImg[0] : "";
        }
        
        if (initialImg && !initialImg.startsWith('http')) {
            const cleanPath = initialImg.replace(/\\/g, '/');
            initialImg = `${BACKEND_URL}/${cleanPath}`;
        }
        
        setMainImage(initialImg);

        // 🔥 CHANGE: data.category -> data.Category
        if (data.Category) {
            const relatedRes = await axios.get(`${BACKEND_URL}/api/products?category=${encodeURIComponent(data.Category)}`);
            setSimilarProducts(relatedRes.data.filter(p => p._id !== id));
        }
      } catch (err) {
        console.error("Error fetching details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToSelection = async () => {
    if (!token) return alert("Please Login to create your project portfolio!");
    
    setAdding(true);
    try {
      await axios.post(`${BACKEND_URL}/api/cart/add`, 
        { productId: product._id, quantity: quantity }, 
        { headers: { 'auth-token': token } }
      );
      refreshCart(); 
    } catch (err) { 
        alert("Could not add to portfolio. Try again."); 
    } finally {
        setAdding(false);
    }
  };

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
        const { scrollLeft, clientWidth } = sliderRef.current;
        const scrollAmount = clientWidth * 0.8;
        sliderRef.current.scrollTo({
            left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
            behavior: 'smooth'
        });
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F5F5F7]">
        <Loader2 className="w-10 h-10 text-amber-600 animate-spin mb-4" strokeWidth={2}/>
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] animate-pulse">Curating Specifications...</span>
    </div>
  );
  
  if (!product) return <div className="h-screen flex items-center justify-center text-gray-500 tracking-widest uppercase font-bold">Product Not Found</div>;

  // 🔥 CHANGE: product.image -> product.Image
  const galleryImages = Array.isArray(product.Image) ? product.Image : [product.Image];
  const customEase = [0.16, 1, 0.3, 1];

  // 🔥 NAYA FEATURE: Excel columns se Specs banaye hain taaki UI na toote
  const specList = [
      { label: "Material/Finish", value: product.material_finish },
      { label: "Power", value: product.power_consumption },
      { label: "Dimensions", value: product.Dimensions_cm },
      { label: "Capacity", value: product.Capacity },
      { label: "Installation", value: product.Installation_Type },
      { label: "Warranty", value: product.Warranty_Details }
  ].filter(s => s.value && s.value.toLowerCase() !== "not specified"); // Khali data hide kar dega

  return (
    <div className="min-h-screen bg-white font-sans pt-28 pb-28 md:pb-16 selection:bg-amber-500 selection:text-white">
      
      {/* BREADCRUMBS */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
         <nav className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-400">
            <button onClick={() => navigate('/')} className="hover:text-amber-600 transition-colors flex items-center gap-1"><Home className="w-3 h-3"/> Home</button>
            <span>/</span>
            {/* 🔥 CHANGE: product.category -> product.Category */}
            <button 
              onClick={() => navigate(`/products?category=${encodeURIComponent(product.Category)}`)} 
              className="hover:text-amber-600 transition-colors"
            >
              {product.Category}
            </button>
            <span>/</span>
            {/* 🔥 CHANGE: product.model -> product.Model_Number */}
            <span className="text-gray-900 line-clamp-1">{product.Model_Number || "Details"}</span>
         </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-24 items-start">
        
        {/* LEFT COLUMN: LUXURY DYNAMIC IMAGE GALLERY */}
        <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-28">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: customEase }}
              className="relative w-full md:w-fit mx-auto bg-[#F5F5F7] rounded-3xl overflow-hidden flex items-center justify-center cursor-crosshair border border-gray-100/50 shadow-sm"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
                <AnimatePresence mode="wait">
                    <motion.img 
                        key={mainImage}
                        initial={{ opacity: 0, filter: "blur(4px)" }} 
                        animate={{ opacity: 1, filter: "blur(0px)" }} 
                        exit={{ opacity: 0 }} 
                        transition={{ duration: 0.4 }}
                        src={mainImage} 
                        alt={product.Product_Name} // 🔥 CHANGE
                        className="w-auto h-auto max-w-full max-h-[70vh] object-contain mix-blend-multiply transition-transform duration-200 ease-out p-8" 
                        style={{
                            transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                            transformOrigin: isZoomed ? `${zoomPos.x}% ${zoomPos.y}%` : 'center center'
                        }}
                    />
                </AnimatePresence>
            </motion.div>
            
            {/* THUMBNAILS */}
            {galleryImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto py-2 px-1 hide-scrollbar justify-center">
                  {galleryImages.map((img, i) => {
                      const cleanPath = typeof img === 'string' ? img.replace(/\\/g, '/') : '';
                      const thumbUrl = img && img.startsWith('http') ? img : `${BACKEND_URL}/${cleanPath}`;
                      const isActive = mainImage === thumbUrl;
                      
                      return (
                          <button 
                              key={i} 
                              onClick={() => setMainImage(thumbUrl)}
                              className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300 bg-[#F5F5F7] ${isActive ? "ring-2 ring-amber-500 ring-offset-2 scale-105" : "border border-gray-100 hover:border-gray-300 opacity-60 hover:opacity-100"}`}
                          >
                              <img src={thumbUrl} className="w-full h-full object-contain p-2 mix-blend-multiply" alt={`thumb-${i}`}/>
                          </button>
                      );
                  })}
              </div>
            )}
        </div>

        {/* RIGHT COLUMN: PRODUCT INFO */}
        <div className="lg:col-span-5 flex flex-col pt-2">
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: customEase }}>
                <div className="flex justify-between items-start mb-4">
                  {/* 🔥 CHANGE: product.brand -> product.Brand */}
                  <span className="text-amber-600 text-[10px] font-bold uppercase tracking-[0.3em]">{product.Brand || "Premium Selection"}</span>
                  {/* 🔥 CHANGE: product.model -> product.Model_Number */}
                  <span className="bg-gray-100 text-gray-500 text-[9px] px-2 py-1 rounded font-bold tracking-widest uppercase">Model: {product.Model_Number || "N/A"}</span>
                </div>
                
                {/* 🔥 CHANGE: product.name -> product.Product_Name */}
                <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 leading-[1.15] tracking-tight">{product.Product_Name}</h1>
                
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center bg-gray-900 text-white px-3 py-1.5 rounded text-xs font-bold gap-1.5 shadow-sm">
                        {/* 🔥 CHANGE: product.rating -> product.average_rating */}
                        {product.average_rating || 5.0} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>
                    <span className="text-gray-400 text-[11px] font-medium uppercase tracking-widest border-b border-transparent">Verified Product</span>
                </div>
            </motion.div>

            {/* PRICE SECTION */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: customEase }} className="mb-8">
                {/* 🔥 CHANGE: product.price -> product.Selling_Price */}
                <span className="text-5xl lg:text-5xl font-serif font-medium text-gray-900 leading-none tracking-tight">₹{product.Selling_Price?.toLocaleString()}</span>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-4 mb-6">Taxes Included • Subject to site feasibility</p>
            </motion.div>

            {/* 🔥 UPDATED TECHNICAL SPECS GRID (Mapped from Excel Columns) */}
            {specList.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: customEase }} className="mb-10 bg-[#FAFAFA] p-6 rounded-2xl border border-gray-100/80">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-5 border-b border-gray-200 pb-3">Key Specifications</h3>
                    <div className="grid grid-cols-2 gap-y-5 gap-x-6">
                        {specList.map((spec, idx) => (
                            <div key={idx} className="flex flex-col">
                                <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest block mb-1">{spec.label}</span>
                                <span className="text-gray-900 text-sm font-semibold">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* QUANTITY & ACTIONS */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: customEase }} className="mb-12 border-t border-gray-100 pt-8">
                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl p-1 shadow-inner h-14 w-full sm:w-auto">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-full flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-black transition-colors"><Minus className="w-4 h-4"/></button>
                        <span className="w-14 text-center font-serif text-xl font-medium text-gray-900">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-full flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-black transition-colors"><Plus className="w-4 h-4"/></button>
                    </div>
                    
                    <div className="flex-1 w-full flex gap-3">
                        <button 
                            onClick={handleAddToSelection}
                            disabled={adding}
                            className="flex-1 bg-gray-900 hover:bg-amber-600 text-white h-14 rounded-xl font-bold uppercase tracking-[0.15em] text-[10px] md:text-[11px] flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            {adding ? <Loader2 className="w-4 h-4 animate-spin"/> : <FileText className="w-4 h-4" />} 
                            {adding ? "Adding..." : "Add to Portfolio"}
                        </button>
                    </div>
                 </div>
                 
                 <button 
                    onClick={() => navigate(`/kitchen-layout/default?product=${product._id}`)}
                    className="w-full mt-4 bg-white border border-gray-200 text-gray-900 hover:border-gray-900 hover:bg-gray-50 h-14 rounded-xl font-bold uppercase tracking-[0.15em] text-[10px] md:text-[11px] flex items-center justify-center gap-3 transition-all duration-300 shadow-sm hover:shadow-md"
                 >
                    <Box className="w-4 h-4 text-amber-600" /> 3D Virtual Try-On
                 </button>
            </motion.div>

            {/* DESCRIPTION SECTION */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease: customEase }} className="mb-12">
               <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 mb-6">The Details</h3>
               <p className="text-gray-600 leading-relaxed text-[14px] font-light mb-6">
                   {/* 🔥 CHANGE: product.description -> product.Technical_Specifications */}
                   {product.Technical_Specifications || "Discover unparalleled luxury and precision with this masterpiece. Engineered to elevate your culinary experience, blending seamless design with cutting-edge technology."}
               </p>
               <ul className="space-y-4">
                   <li className="flex items-start gap-3">
                       <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                       <span className="text-[13px] text-gray-700">Premium build quality ensuring longevity and style.</span>
                   </li>
                   <li className="flex items-start gap-3">
                       <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                       <span className="text-[13px] text-gray-700">Engineered for maximum efficiency and superior performance.</span>
                   </li>
               </ul>
            </motion.div>

            {/* MONOCHROME LUXURY SERVICES */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5, ease: customEase }} className="grid grid-cols-4 gap-2 md:gap-3 border-t border-gray-100 pt-10">
                {[
                  { icon: Truck, text: "White-Glove Delivery" },
                  { icon: ShieldCheck, text: "Brand Warranty" },
                  { icon: RotateCcw, text: "7 Days Return" },
                  { icon: CheckCircle, text: "Pro Installation" }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center gap-3 group">
                      <div className="bg-gray-50 border border-gray-100 w-12 h-12 flex items-center justify-center rounded-2xl text-gray-600 group-hover:text-amber-600 group-hover:border-amber-100 transition-colors shadow-sm"><item.icon className="w-5 h-5" strokeWidth={1.5}/></div>
                      <span className="text-[8px] md:text-[9px] font-bold text-gray-500 uppercase tracking-widest max-w-[80px] leading-relaxed group-hover:text-gray-900 transition-colors">{item.text}</span>
                  </div>
                ))}
            </motion.div>

        </div>
      </div>
      
      {/* SIMILAR PRODUCTS */}
      {similarProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-20 border-t border-gray-100 pt-24">
             <div className="flex items-center justify-between mb-12">
                 <h3 className="text-3xl md:text-4xl font-serif text-gray-900">Complementary Pieces</h3>
                 <div className="hidden md:flex items-center gap-3">
                     <button onClick={() => scrollSlider('left')} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors">
                         <ChevronLeft className="w-5 h-5" />
                     </button>
                     <button onClick={() => scrollSlider('right')} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors">
                         <ChevronRight className="w-5 h-5" />
                     </button>
                 </div>
             </div>
             
             <div ref={sliderRef} className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar scroll-smooth snap-x snap-mandatory">
                {similarProducts.map((item, idx) => {
                    // 🔥 CHANGE: item.image -> item.Image
                    let simImg = item.Image;
                    if (Array.isArray(simImg)) simImg = simImg.length > 0 ? simImg[0] : "";
                    
                    const cleanPath = typeof simImg === 'string' ? simImg.replace(/\\/g, '/') : '';
                    const similarImgUrl = simImg && simImg.startsWith('http') ? simImg : `${BACKEND_URL}/${cleanPath}`;
                    
                    return (
                        <div 
                            key={item._id} 
                            onClick={() => navigate(`/product-details/${item._id}`)} 
                            className="min-w-[280px] md:min-w-[320px] snap-start cursor-pointer border border-gray-100 rounded-3xl p-6 hover:border-amber-300 hover:shadow-2xl transition-all duration-500 bg-[#FAFAFA] group"
                        >
                            <div className="h-40 md:h-56 mb-6 flex items-center justify-center">
                                <img src={similarImgUrl} alt={item.Product_Name} className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"/>
                            </div>
                            {/* 🔥 CHANGE: item.brand -> item.Brand, item.name -> item.Product_Name, item.price -> item.Selling_Price */}
                            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2">{item.Brand}</p>
                            <h4 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-amber-600 transition-colors">{item.Product_Name}</h4>
                            <div className="flex items-end gap-3 mt-4">
                                <span className="text-lg font-serif font-medium text-gray-900">₹{item.Selling_Price?.toLocaleString()}</span>
                            </div>
                        </div>
                    )
                })}
             </div>
        </div>
      )}

     {/* EXPLORE COLLECTIONS */}
      <div className="bg-white border-t border-gray-100 py-24 mt-10">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                  <h3 className="text-3xl md:text-4xl font-serif text-gray-900">Explore Other Collections</h3>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2 md:mt-0 hidden md:block">Curated for your perfect kitchen</p>
              </div>

              <div className="flex overflow-x-auto md:grid md:grid-cols-5 gap-4 md:gap-6 pb-8 hide-scrollbar snap-x snap-mandatory">
                  {categories.map((cat, idx) => (
                      <motion.div 
                          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                          key={cat.dbCategory} 
                          onClick={() => navigate(`/products?category=${encodeURIComponent(cat.dbCategory)}&type=${encodeURIComponent(cat.dbType)}`)}
                          className="min-w-[240px] md:min-w-0 snap-start relative aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
                      >
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                          <div className="absolute inset-0 p-6 flex flex-col justify-end">
                              <span className="text-amber-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-2 opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                  View Collection
                              </span>
                              <h4 className="text-white text-2xl font-serif tracking-wide flex items-center justify-between">
                                  {cat.name}
                                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                      <ArrowRight className="w-4 h-4 text-white" />
                                  </div>
                              </h4>
                          </div>
                      </motion.div>
                  ))}
              </div>
          </div>
      </div>

      {/* MOBILE FLOATING ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-200 p-4 pb-safe flex gap-3 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button 
            onClick={() => navigate(`/kitchen-layout/default?product=${product._id}`)}
            className="flex-none w-14 h-14 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl flex items-center justify-center transition-colors shadow-sm"
        >
            <Box className="w-5 h-5" /> 
        </button>
        <button 
            onClick={handleAddToSelection} disabled={adding}
            className="flex-1 bg-gray-900 hover:bg-amber-600 text-white h-14 rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-lg"
        >
            {adding ? <Loader2 className="w-4 h-4 animate-spin"/> : <FileText className="w-4 h-4"/>} 
            {adding ? "Adding..." : "Add to Portfolio"}
        </button>
      </div>

    </div>
  );
}