import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { 
   Plus, Minus, PhoneCall, Calendar, 
  FileText, ArrowRight, Loader2, Sparkles, X, Box, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

// 🔥 FIX 1: Deployment Ready URL
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const CartDetail = () => {
  const { token, refreshCart, removeFromCart, cart, loading: contextLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [updatingId, setUpdatingId] = useState(null); 

  useEffect(() => {
    if (cart) {
      const formattedItems = cart.map(item => {
         const productData = item.productId || item.product || item;
         return {
             _id: item._id, 
             product: productData, 
             quantity: item.quantity
         };
      });
      
      setCartItems(formattedItems);
      calculateTotal(formattedItems);
    }
  }, [cart]);

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => {
        if (!item.product) return acc;
        return acc + ((item.product.price || 0) * item.quantity);
    }, 0);
    setTotalValue(total);
  };

  const updateQty = async (productId, itemId, newQty) => {
    if(newQty < 1 || updatingId === itemId) return;
    
    setUpdatingId(itemId); 

    const updatedItems = cartItems.map(item => 
        item._id === itemId ? { ...item, quantity: newQty } : item
    );
    setCartItems(updatedItems);
    calculateTotal(updatedItems);

    try {
        await axios.post(`${BACKEND_URL}/api/cart/update`, 
            { productId: productId, quantity: newQty }, 
            { headers: { 'auth-token': token } }
        );
        refreshCart(); 
    } catch (err) {
        console.error("Update failed");
        refreshCart(); 
    } finally {
        setUpdatingId(null);
    }
  };

  const handleRemove = async (productId, itemId) => {
    setUpdatingId(itemId);
    
    const updatedItems = cartItems.filter(item => item._id !== itemId);
    setCartItems(updatedItems);
    calculateTotal(updatedItems);

    try {
      await removeFromCart(productId); 
    } catch(err) {
      refreshCart(); 
    } finally {
      setUpdatingId(null);
    }
  };

  if (contextLoading) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-600 animate-spin mb-4" strokeWidth={1.5} />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] animate-pulse">Syncing Portfolio...</span>
    </div>
  );

  if (cartItems.length === 0) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
        >
            <div className="w-24 h-24 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mb-8 shadow-sm">
                <Box className="w-10 h-10 text-gray-300" strokeWidth={1}/>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4 tracking-tight">Your Portfolio is Empty</h2>
            <p className="text-gray-500 mb-10 max-w-md font-light leading-relaxed">
                Begin curating your culinary space. Add masterpieces to your portfolio to request a personalized consultation.
            </p>
            <button 
                onClick={() => navigate('/products')} 
                className="bg-gray-900 hover:bg-amber-600 text-white px-10 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 hover:shadow-[0_10px_20px_rgba(217,119,6,0.2)] hover:-translate-y-1 flex items-center gap-3"
            >
                Return to Studio <ArrowRight className="w-4 h-4"/>
            </button>
        </motion.div>
    );
  }

  return (
    <div className="py-6 md:py-12">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gray-100 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
               <Sparkles className="w-4 h-4 text-amber-500" />
               <span className="text-amber-500 text-[10px] font-bold tracking-[0.3em] uppercase">Step 01</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-3 tracking-tight">Project Portfolio</h1>
            <p className="text-gray-500 text-sm font-light">Review your curated selection before engaging our experts.</p>
          </div>
          <span className="font-bold text-xs uppercase tracking-widest text-gray-400 mt-6 md:mt-0 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
             {cartItems.length} {cartItems.length === 1 ? 'Masterpiece' : 'Masterpieces'}
          </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        <div className="lg:w-2/3">
            <AnimatePresence>
            {cartItems.map((item) => {
                const product = item.product;
                if (!product) return null; 

                let displayImg = product.image;
                if (Array.isArray(displayImg)) {
                    displayImg = displayImg.length > 0 ? displayImg[0] : "";
                }
                const cleanPath = typeof displayImg === 'string' ? displayImg.replace(/\\/g, '/') : '';
                const finalImgUrl = displayImg && displayImg.startsWith('http') 
                    ? displayImg 
                    : `${BACKEND_URL}/${cleanPath}`;

                const isUpdating = updatingId === item._id;

                return (
                    <motion.div 
                        layout 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, x: -20 }} 
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        key={item._id} 
                        className={`flex gap-6 p-5 md:p-6 bg-white rounded-3xl border transition-all duration-300 mb-6 group ${isUpdating ? 'border-amber-200 opacity-60' : 'border-gray-100 hover:shadow-xl hover:border-amber-100'}`}
                    >
                        <div 
                            className="w-28 h-28 md:w-36 md:h-36 bg-[#F5F5F7] rounded-2xl p-3 flex-shrink-0 flex items-center justify-center cursor-pointer relative overflow-hidden" 
                            onClick={() => navigate(`/product-details/${product._id}`)}
                        >
                            <img 
                                src={finalImgUrl} 
                                alt={product.name} 
                                className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => { e.target.src = "https://placehold.co/200x200?text=No+Img" }}
                            />
                        </div>
                        
                        {/* 🔥 FIX 2: min-w-0 lagaya taaki text overflow na ho */}
                        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                            <div className="flex justify-between items-start gap-4">
                                <div className="min-w-0">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1.5 truncate">{product.brand || "Exclusive"}</p>
                                    <h3 className="font-bold text-gray-900 text-sm md:text-lg leading-snug cursor-pointer hover:text-amber-600 transition-colors line-clamp-2" onClick={() => navigate(`/product-details/${product._id}`)}>
                                        {product.name}
                                    </h3>
                                    {product.model && <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2 truncate">Model: {product.model}</p>}
                                </div>
                                <button 
                                    onClick={() => handleRemove(product._id, item._id)} 
                                    disabled={isUpdating}
                                    className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all flex-shrink-0"
                                >
                                    <X className="w-5 h-5"/>
                                </button>
                            </div>
                            
                            <div className="flex justify-between items-end mt-4 md:mt-0 border-t border-gray-50 pt-4 md:pt-0 md:border-none">
                                <div className="flex items-center border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
                                    <button 
                                        onClick={() => updateQty(product._id, item._id, item.quantity - 1)} 
                                        disabled={isUpdating}
                                        className="p-3 hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
                                    >
                                        <Minus className="w-3.5 h-3.5" strokeWidth={3}/>
                                    </button>
                                    
                                    <div className="w-10 flex justify-center items-center font-serif font-medium text-gray-900">
                                        {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" /> : item.quantity}
                                    </div>
                                    
                                    <button 
                                        onClick={() => updateQty(product._id, item._id, item.quantity + 1)} 
                                        disabled={isUpdating}
                                        className="p-3 hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
                                    >
                                        <Plus className="w-3.5 h-3.5" strokeWidth={3}/>
                                    </button>
                                </div>
                                
                                <div className="text-right">
                                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Est. Value</span>
                                    <span className="font-serif font-medium text-lg md:text-2xl text-gray-900">₹{((product.price || 0) * item.quantity).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
            </AnimatePresence>
        </div>

        <div className="lg:w-1/3">
            <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] sticky top-28"
            >
                <h3 className="text-xl font-serif text-gray-900 mb-8 border-b border-gray-100 pb-6">Consultation Summary</h3>
                
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Selected Appliances</span>
                        <span className="font-bold text-gray-900">{cartItems.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Service Tier</span>
                        <span className="font-bold text-amber-600 uppercase text-[10px] tracking-widest bg-amber-50 px-2 py-1 rounded">White-Glove</span>
                    </div>
                    
                    <div className="pt-6 mt-6 border-t border-gray-100">
                        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Estimated Portfolio Value</span>
                        <span className="text-4xl font-serif text-gray-900 tracking-tight">₹{totalValue.toLocaleString()}</span>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex gap-3 items-start mt-6">
                         <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                         <p className="text-[11px] text-gray-500 leading-relaxed">
                            This is an estimated catalog value. Official quotation, bulk discounts, and installation charges will be structured post-site consultation.
                         </p>
                    </div>
                </div>

                <button 
                    onClick={() => navigate('/consultation', { 
                        state: { cart: cartItems, total: totalValue } 
                    })}
                    className="w-full bg-gray-900 text-white py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-amber-600 transition-all duration-500 shadow-lg hover:shadow-[0_10px_20px_rgba(217,119,6,0.2)] hover:-translate-y-1 group"
                >
                    <PhoneCall className="w-4 h-4"/> 
                    Confirm & Proceed
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                </button>

                <div className="mt-8 flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-[11px] text-gray-500 font-medium">
                        <div className="bg-gray-100 p-1.5 rounded-full"><Calendar className="w-3.5 h-3.5 text-gray-700"/></div>
                        Priority Site Assessment
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-gray-500 font-medium">
                        <div className="bg-gray-100 p-1.5 rounded-full"><ShieldCheck className="w-3.5 h-3.5 text-gray-700"/></div>
                        100% Genuine Brand Warranty
                    </div>
                </div>
            </motion.div>
        </div>

      </div>
    </div>
  );
}

export default CartDetail;

