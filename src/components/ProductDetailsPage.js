import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { 
  Star, Share2, Plus, Minus, Box, FileText, 
  Truck, ShieldCheck, RotateCcw, CheckCircle, 
  ChevronRight, Tag, CreditCard, Info
} from 'lucide-react';
import { AuthContext } from "../context/AuthContext";

// 🔥 CLOUDINARY CONFIG
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dcljdkqer/image/upload/";

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
  const [activeTab, setActiveTab] = useState("specs");

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        window.scrollTo(0,0);

        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        const data = res.data;
        setProduct(data);
        
        // 🔥 FIX 1: Handle Main Image (Array vs String)
        let initialImg = data.image;
        if (Array.isArray(initialImg)) {
            initialImg = initialImg.length > 0 ? initialImg[0] : "";
        }
        
        // Cloudinary Check
        if (initialImg && !initialImg.startsWith('http')) {
            initialImg = `${CLOUDINARY_BASE_URL}${initialImg}.jpg`;
        }
        
        setMainImage(initialImg);

        if (data.category) {
            const relatedRes = await axios.get(`http://localhost:5000/api/products?category=${data.category}`);
            setSimilarProducts(relatedRes.data.filter(p => p._id !== id).slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // --- 2. ADD TO SELECTION LOGIC ---
  const handleAddToSelection = async () => {
    if (!token) return alert("Please Login to create your project list!");
    
    setAdding(true);
    try {
      await axios.post('http://localhost:5000/api/cart/add', 
        { productId: product._id, quantity: quantity }, 
        { headers: { 'auth-token': token } }
      );
      refreshCart(); 
      alert(`${quantity} x ${product.name} added to your Inquiry List!`);
    } catch (err) { 
        alert("Could not add to list. Try again."); 
    } finally {
        setAdding(false);
    }
  };

  const calculateDiscount = (price) => {
    const fakeMRP = price * 1.25; 
    return { mrp: Math.round(fakeMRP), off: 25 };
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-400 font-medium tracking-widest animate-pulse">LOADING PREMIUM PRODUCTS...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product Not Found</div>;

  const { mrp, off } = calculateDiscount(product.price);

  // 🔥 FIX 2: Prepare Gallery Images (Array handling)
  // Agar product.image array hai to use karo, nahi to array bana lo
  const galleryImages = Array.isArray(product.image) ? product.image : [product.image];

  return (
    <div className="min-h-screen bg-white font-sans pt-24 pb-10">
      
      {/* 1. BREADCRUMBS */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-4">
        <div className="flex items-center text-xs text-gray-500 gap-2">
            <span className="cursor-pointer hover:text-black" onClick={() => navigate('/')}>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span className="cursor-pointer hover:text-black" onClick={() => navigate(-1)}>{product.category || 'Shop'}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-semibold text-gray-900 truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
        
        {/* LEFT COLUMN: IMAGE GALLERY */}
        <div className="lg:col-span-5 space-y-4 sticky top-24 h-fit">
            <div className="relative aspect-square bg-white border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center group cursor-zoom-in">
                {product.tag && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest z-10 rounded-sm shadow-sm">
                        {product.tag}
                    </span>
                )}
                <Share2 className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer z-10 bg-white p-1.5 rounded-full shadow-sm w-8 h-8" />
                
                <img 
                    src={mainImage} 
                    alt={product.name} 
                    className="max-h-[90%] max-w-[90%] object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-125" 
                />
            </div>
            
            {/* 🔥 UPDATED THUMBNAILS: Real Images from Array */}
            <div className="flex gap-3 overflow-x-auto py-2 px-1 justify-center lg:justify-start">
                {galleryImages.map((img, i) => {
                    // Har thumbnail ka URL fix karo
                    const thumbUrl = img && img.startsWith('http') ? img : `${CLOUDINARY_BASE_URL}${img}.jpg`;
                    
                    return (
                        <div 
                            key={i} 
                            onMouseEnter={() => setMainImage(thumbUrl)}
                            className={`w-16 h-16 rounded-lg border cursor-pointer p-1 bg-white ${mainImage === thumbUrl ? "border-amber-500 ring-1 ring-amber-500" : "border-gray-200 hover:border-gray-400"}`}
                        >
                            <img src={thumbUrl} className="w-full h-full object-contain" alt={`thumb-${i}`}/>
                        </div>
                    );
                })}
            </div>

            {/* ACTION BUTTONS */}
            <div className="hidden lg:flex gap-4 mt-6">
                 <button 
                    onClick={handleAddToSelection}
                    disabled={adding}
                    className="flex-1 bg-amber-400 hover:bg-amber-500 text-black h-12 rounded-sm font-bold uppercase tracking-wide text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                    {adding ? "Adding..." : <><FileText className="w-4 h-4" /> Add to Inquiry List</>}
                </button>
                <button 
                    onClick={() => navigate(`/kitchen-layout/default?product=${product._id}`)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-12 rounded-sm font-bold uppercase tracking-wide text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                    <Box className="w-4 h-4" /> 3D Visualize
                </button>
            </div>
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        <div className="lg:col-span-7">
            
            <div className="mb-2">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">{product.brand}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-2 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center bg-green-700 text-white px-2 py-0.5 rounded-[4px] text-xs font-bold gap-1">
                    {product.rating || 4.5} <Star className="w-3 h-3 fill-white" />
                </div>
                <span className="text-gray-500 text-sm font-medium">1,240 Ratings & 89 Reviews</span>
            </div>

            {/* PRICE SECTION */}
            <div className="mb-6">
                <div className="flex items-end gap-3">
                    <span className="text-3xl font-medium text-black">₹{product.price.toLocaleString()}</span>
                    <span className="text-gray-500 line-through text-sm mb-1.5">₹{mrp.toLocaleString()}</span>
                    <span className="text-green-700 font-bold text-sm mb-1.5">{off}% off</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
                <p className="text-sm text-gray-900 mt-1 font-medium flex items-center gap-1">
                    <CreditCard className="w-4 h-4 text-gray-600"/> EMI starts at ₹{(product.price/12).toFixed(0)}/mo. 
                    <span className="text-blue-600 cursor-pointer">View Plans</span>
                </p>
            </div>

            {/* OFFERS */}
            <div className="mb-6">
                <h4 className="font-bold text-sm mb-2 text-gray-900">Available Offers</h4>
                <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                        <Tag className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><span className="font-bold">Bank Offer:</span> 5% Unlimited Cashback on WowShop Axis Bank Credit Card.</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                        <Tag className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><span className="font-bold">Partner Offer:</span> Sign up for GST Invoice and save up to 18%.</span>
                    </div>
                </div>
            </div>

            {/* DELIVERY & SERVICES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 border-y border-gray-100 py-4">
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="bg-blue-50 p-2 rounded-full text-blue-600"><Truck className="w-5 h-5"/></div>
                    <span className="text-xs font-semibold text-gray-700">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="bg-blue-50 p-2 rounded-full text-blue-600"><ShieldCheck className="w-5 h-5"/></div>
                    <span className="text-xs font-semibold text-gray-700">1 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="bg-blue-50 p-2 rounded-full text-blue-600"><RotateCcw className="w-5 h-5"/></div>
                    <span className="text-xs font-semibold text-gray-700">7 Days Replacement</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="bg-blue-50 p-2 rounded-full text-blue-600"><CheckCircle className="w-5 h-5"/></div>
                    <span className="text-xs font-semibold text-gray-700">Installation Included</span>
                </div>
            </div>

            {/* SELECTION CONTROLS */}
            <div className="flex items-center gap-6 mb-8">
                 <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Quantity</label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1.5 hover:bg-gray-100 text-gray-600"><Minus className="w-4 h-4"/></button>
                        <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1.5 hover:bg-gray-100 text-gray-600"><Plus className="w-4 h-4"/></button>
                    </div>
                 </div>
                 
                 <div className="flex-1">
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md flex gap-2 items-start">
                        <Info className="w-4 h-4 text-yellow-700 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-yellow-800">
                            <strong>Bulk Order?</strong> Add to Inquiry List. Our experts will contact you for the best B2B pricing.
                        </p>
                    </div>
                 </div>
            </div>

            {/* TABS: DESCRIPTION & SPECS */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex border-b border-gray-200 bg-gray-50">
                    <button 
                        onClick={() => setActiveTab('specs')}
                        className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide ${activeTab === 'specs' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Specifications
                    </button>
                    <button 
                        onClick={() => setActiveTab('desc')}
                        className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide ${activeTab === 'desc' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Description
                    </button>
                </div>
                
                <div className="p-6 bg-white min-h-[200px]">
                    {activeTab === 'specs' && product.specs ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                            {Object.entries(product.specs).map(([key, value], idx) => (
                                <div key={idx} className="flex border-b border-gray-100 pb-2">
                                    <span className="w-1/2 text-gray-500 text-sm font-medium capitalize">{key}</span>
                                    <span className="w-1/2 text-gray-900 text-sm font-semibold">{value}</span>
                                </div>
                            ))}
                         </div>
                    ) : (
                        <p className="text-gray-600 leading-relaxed text-sm">
                            {product.description || "No description available for this premium product."}
                        </p>
                    )}
                </div>
            </div>

        </div>
      </div>
      
      {/* 7. SIMILAR PRODUCTS SLIDER */}
      {similarProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 border-t border-gray-200 pt-10">
             <h3 className="text-xl font-bold text-gray-900 mb-6">Similar Products You Might Like</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {similarProducts.map((item) => {
                    // 🔥 FIX 3: Similar Product Image Fix
                    let simImg = item.image;
                    if (Array.isArray(simImg)) {
                        simImg = simImg.length > 0 ? simImg[0] : "";
                    }
                    const similarImgUrl = simImg && simImg.startsWith('http') ? simImg : `${CLOUDINARY_BASE_URL}${simImg}.jpg`;
                    
                    return (
                        <div key={item._id} onClick={() => navigate(`/product-details/${item._id}`)} className="cursor-pointer border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
                            <div className="h-40 mb-3 flex items-center justify-center">
                                <img src={similarImgUrl} alt={item.name} className="max-h-full max-w-full object-contain mix-blend-multiply"/>
                            </div>
                            <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-bold text-black">₹{item.price.toLocaleString()}</span>
                                <span className="text-xs text-green-600 font-bold">20% off</span>
                            </div>
                        </div>
                    )
                })}
             </div>
        </div>
      )}

      {/* MOBILE FLOATING ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 shadow-2xl flex gap-3 z-50">
        <button 
            onClick={() => navigate(`/kitchen-layout/default?product=${product._id}`)}
            className="flex-1 bg-white border border-gray-300 text-black h-12 rounded-sm font-bold uppercase text-xs flex items-center justify-center gap-2"
        >
            <Box className="w-4 h-4" /> 3D View
        </button>
        <button 
            onClick={handleAddToSelection}
            disabled={adding}
            className="flex-1 bg-amber-400 text-black h-12 rounded-sm font-bold uppercase text-xs flex items-center justify-center gap-2"
        >
            {adding ? "Adding..." : "Add to Inquiry"}
        </button>
      </div>

    </div>
  );
}