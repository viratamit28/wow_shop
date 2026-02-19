import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Trash2, Plus, Minus, PhoneCall, Calendar, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// 🔥 CLOUDINARY CONFIG (Image Display Fix ke liye)
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dcljdkqer/image/upload/";

const CartDetail = () => {
  const { token, refreshCart, removeFromCart } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);

  // 1. Fetch Cart Data
  useEffect(() => {
    fetchCart();
  }, [token]);

  const fetchCart = async () => {
    if(!token) { setLoading(false); return; }
    try {
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { 'auth-token': token }
      });
      // Formatting data safely
      const formattedItems = res.data.map(item => ({
         _id: item._id, 
         product: item.productId, 
         quantity: item.quantity
      }));
      
      setCartItems(formattedItems);
      calculateTotal(formattedItems);
      setLoading(false);
    } catch (err) {
      console.error("Cart error", err);
      setLoading(false);
    }
  };

  // 2. Calculate Total
  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => {
        // Agar product delete ho gaya ho toh crash na ho
        if (!item.product) return acc;
        return acc + ((item.product.price || 0) * item.quantity);
    }, 0);
    setTotalValue(total);
  };

  // 3. Update Quantity
  const updateQty = async (itemId, newQty) => {
    if(newQty < 1) return;
    
    // Optimistic Update
    const updatedItems = cartItems.map(item => 
        item._id === itemId ? { ...item, quantity: newQty } : item
    );
    setCartItems(updatedItems);
    calculateTotal(updatedItems);

    try {
        await axios.post('http://localhost:5000/api/cart/update', 
            { itemId, quantity: newQty }, 
            { headers: { 'auth-token': token } }
        );
        refreshCart();
    } catch (err) {
        console.error("Update failed");
    }
  };

  // 4. Remove Item
  const handleRemove = async (productId, itemId) => {
    const updatedItems = cartItems.filter(item => item._id !== itemId);
    setCartItems(updatedItems);
    calculateTotal(updatedItems);

    await removeFromCart(productId);
  };

  if (loading) return <div className="p-20 text-center text-gray-400 tracking-widest">LOADING SELECTION...</div>;

  if (cartItems.length === 0) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-gray-400"/>
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Your Selection List is Empty</h2>
            <p className="text-gray-500 mb-8 max-w-md">Start adding appliances to your project list. Our experts will help you with the best configuration.</p>
            <button onClick={() => navigate('/')} className="bg-black text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-gray-800 transition-all">
                Browse Catalog
            </button>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pt-32">
      <div className="flex items-end justify-between mb-10 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">My Project Selection</h1>
            <p className="text-gray-500">Review your appliances before finalizing the consultation.</p>
          </div>
          <span className="font-bold text-lg hidden md:block">{cartItems.length} Items</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* LEFT: LIST ITEMS */}
        <div className="lg:w-2/3 space-y-6">
            {cartItems.map((item) => {
                const product = item.product;
                if (!product) return null; // Agar product DB se delete ho gaya ho toh skip karo

                // 🔥 IMAGE FIX LOGIC START
                let displayImg = product.image;
                // 1. Agar Array hai (New Data), toh pehli image lo
                if (Array.isArray(displayImg)) {
                    displayImg = displayImg.length > 0 ? displayImg[0] : "";
                }
                // 2. Agar Cloudinary ID hai (bina http), toh Link banao
                const finalImgUrl = displayImg && displayImg.startsWith('http') 
                    ? displayImg 
                    : `${CLOUDINARY_BASE_URL}${displayImg}.jpg`;
                // 🔥 IMAGE FIX LOGIC END

                return (
                    <div key={item._id} className="flex gap-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-24 h-24 bg-gray-50 rounded-xl p-2 flex-shrink-0 flex items-center justify-center cursor-pointer" onClick={() => navigate(`/product-details/${product._id}`)}>
                            <img 
                                src={finalImgUrl} 
                                alt={product.name} 
                                className="max-w-full max-h-full object-contain mix-blend-multiply"
                                onError={(e) => { e.target.src = "https://placehold.co/100x100?text=No+Img" }}
                            />
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">{product.brand}</p>
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight cursor-pointer hover:text-amber-600 transition-colors" onClick={() => navigate(`/product-details/${product._id}`)}>
                                        {product.name}
                                    </h3>
                                    {/* Agar Model No hai toh dikhao */}
                                    {product.model && <p className="text-xs text-gray-400 mt-1">Model: {product.model}</p>}
                                </div>
                                <button 
                                    onClick={() => handleRemove(product._id, item._id)} 
                                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                >
                                    <Trash2 className="w-5 h-5"/>
                                </button>
                            </div>
                            
                            <div className="flex justify-between items-end mt-4">
                                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                    <button onClick={() => updateQty(item._id, item.quantity - 1)} className="p-2 hover:bg-gray-200 rounded-l-lg"><Minus className="w-3 h-3"/></button>
                                    <span className="text-sm font-bold w-8 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQty(item._id, item.quantity + 1)} className="p-2 hover:bg-gray-200 rounded-r-lg"><Plus className="w-3 h-3"/></button>
                                </div>
                                
                                <div className="text-right">
                                    <span className="block text-xs text-gray-400 uppercase">Est. Price</span>
                                    <span className="font-bold text-xl text-gray-900">₹{((product.price || 0) * item.quantity).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* RIGHT: SUMMARY & CONSULTATION ACTION */}
        <div className="lg:w-1/3">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl sticky top-24">
                <h3 className="text-lg font-bold mb-6 font-serif">Project Estimate</h3>
                
                <div className="space-y-4 mb-6 border-b border-gray-100 pb-6">
                    <div className="flex justify-between text-gray-600">
                        <span>Selected Items</span>
                        <span>{cartItems.length}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                        <span>Total Estimate</span>
                        <span>₹{totalValue.toLocaleString()}</span>
                    </div>
                    
                    <div className="bg-amber-50 text-amber-800 text-xs p-4 rounded-xl leading-relaxed mt-4 border border-amber-100">
                          <strong>Note:</strong> This is an estimated catalog price. Final project price, bulk discounts & installation charges will be shared by our expert during consultation.
                    </div>
                </div>

                <button 
                    onClick={() => navigate('/consultation', { 
                        state: { 
                            cart: cartItems, 
                            total: totalValue 
                        } 
                    })}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg group"
                >
                    <PhoneCall className="w-5 h-5"/> 
                    Book Expert Consultation
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                </button>

                <div className="mt-6 flex flex-col gap-3 text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400"/> Free Site Visit & Measurement
                    </div>
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400"/> Official GST Quotation
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

export default CartDetail;