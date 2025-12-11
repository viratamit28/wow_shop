import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // 👇 Auth Context Import

export default function CartDetail() {
  const navigate = useNavigate();
  
  // 👇 1. 'refreshCart' bhi nikala taaki Header update ho sake
  const { token, refreshCart } = useContext(AuthContext); 
  
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Cart from Database
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        setLoading(false);
        return; 
      }

      try {
        const res = await axios.get('http://localhost:5000/api/cart', {
          headers: { 'auth-token': token }
        });
        
        const formattedCart = res.data.map(item => ({
          id: item.productId._id,
          title: item.productId.name,
          brand: item.productId.brand || "Generic",
          price: item.productId.price,
          image: item.productId.image,
          quantity: item.quantity
        }));

        setCart(formattedCart);
      } catch (err) {
        console.error("Error loading cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  // Calculations
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // 👇 2. Update Quantity (Ab Header bhi update hoga)
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    // Optimistic UI Update (Turant dikhao)
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));

    if (token) {
      try {
        // Backend API call to update quantity
        await axios.post('http://localhost:5000/api/cart/update', 
          { productId, quantity: newQuantity }, 
          { headers: { 'auth-token': token } }
        );
        
        // 👇 MAGIC LINE: Ye Header aur baki jagah sync karega
        refreshCart(); 

      } catch (err) {
        console.error("Failed to update quantity", err);
      }
    }
  };

  // 👇 3. Remove Item (Header Update ke saath)
  const removeFromCart = async (productId) => {
    // UI se hatao
    setCart(prev => prev.filter(item => item.id !== productId));

    if (token) {
      try {
        await axios.post('http://localhost:5000/api/cart/remove', 
          { productId }, 
          { headers: { 'auth-token': token } }
        );
        
        // 👇 MAGIC LINE: Header turant update hoga
        refreshCart();

      } catch (err) {
        console.error("Failed to remove item", err);
      }
    }
  };

  const clearCart = () => {
    setCart([]);
    // Note: Agar backend me clear all ka route banaya ho to yahan call karna
    // Abhi ke liye UI clear kar rahe hain
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout', { state: { cart, total: calculateTotal() } });
  };

  const continueShopping = () => {
    navigate('/');
  };

  if (loading) return <div className="text-center py-20">Loading Cart...</div>;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 pt-40">
        <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="bg-white rounded-2xl shadow-sm p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-6">🛒</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any products to your cart yet.
              </p>
              <button onClick={continueShopping} className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300">
                Start Shopping
              </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-40">
      <div className="max-w-7xl mt-6 mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left mb-8">
          <h1 className="text-4xl md:text-5xl font-light mb-2">
            Shopping <span className="font-semibold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Cart</span>
          </h1>
          <p className="text-gray-600">
            {calculateTotalItems()} Items in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
             
             {/* Action Bar */}
             <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200">
                <span className="font-semibold text-gray-700">Products</span>
                {/* Clear Cart Logic backend par depend karega, abhi sirf text hai */}
                <span className="text-gray-400 text-sm">Review your items</span>
             </div>

             {/* Items */}
             <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow">
                    
                    {/* Image */}
                    <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                       <img src={item.image} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                       <div>
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">Brand: {item.brand}</p>
                          <p className="text-xl font-bold text-teal-600">₹{item.price.toLocaleString()}</p>
                       </div>

                       <div className="flex justify-between items-end mt-4">
                          {/* Quantity */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                             <button 
                               onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                               disabled={item.quantity <= 1}
                               className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                             >-</button>
                             <span className="px-3 font-semibold">{item.quantity}</span>
                             <button 
                               onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                               className="px-3 py-1 hover:bg-gray-100"
                             >+</button>
                          </div>

                          {/* Remove */}
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-sm font-medium underline">
                             Remove
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
             </div>

             <button onClick={continueShopping} className="text-gray-600 font-medium hover:text-black flex items-center gap-2 mt-4">
                ← Continue Shopping
             </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({calculateTotalItems()} items)</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18%)</span>
                  <span>₹{(calculateTotal() * 0.18).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span>₹{(calculateTotal() * 1.18).toLocaleString()}</span>
              </div>

              <button
                onClick={proceedToCheckout}
                className="w-full bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-center text-gray-400 mt-4">
                🔒 Secure checkout powered by Stripe/Razorpay
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}