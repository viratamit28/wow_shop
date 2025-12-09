import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CartDetail() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
  }, [cart]);

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate total items count
  const calculateTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Increment quantity
  const incrementQuantity = (productId) => {
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  // Decrement quantity
  const decrementQuantity = (productId) => {
    setCart(cart.map(item =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('shoppingCart');
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout', { state: { cart, total: calculateTotal() } });
  };

  // Continue shopping
  const continueShopping = () => {
    navigate('/products');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart</h1>
              <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-6">🛒</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any products to your cart yet. Start shopping to discover amazing deals!
              </p>
              <button
                onClick={continueShopping}
                className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-40">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
         <div className="text-left">
          <h1 className="text-5xl md:text-6xl font-light mb-6">
          Shopping <span className="font-semibold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Cart</span>
          </h1>

          <p className="text-gray-600 mt-6 mb-2">
            {calculateTotalItems()} {calculateTotalItems() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Cart Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                  >
                    
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-40 h-40 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 text-left">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 text-left">Brand: {item.brand}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-sm font-medium text-gray-700">Quantity:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => decrementQuantity(item.id)}
                              className="w-8 h-8  border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <span className="text-lg">−</span>
                            </button>
                            <span className="w-12 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => incrementQuantity(item.id)}
                              className="w-8 h-8  border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <span className="text-lg">+</span>
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold text-green-600">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                          {item.oldPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹{(item.oldPrice * item.quantity).toLocaleString()}
                            </span>
                          )}
                          <span className="text-sm text-gray-600">
                            (₹{item.price.toLocaleString()} each)
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping Button */}
            <div className="mt-6">
              <button
                onClick={continueShopping}
                className="w-full py-3 border-2 border-black text-black rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-300"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6  top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({calculateTotalItems()})</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span>₹{(calculateTotal() * 0.18).toLocaleString()}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-green-600">
                      ₹{(calculateTotal() + (calculateTotal() * 0.18)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={proceedToCheckout}
                className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300 mb-4"
              >
                Proceed to Checkout
              </button>

              {/* Security Badge */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
                <p className="text-xs text-gray-500">
                  Your payment information is encrypted and secure
                </p>
              </div>

              {/* Additional Features */}
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span>🔄</span>
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>🚚</span>
                  <span>Free shipping on orders over ₹5000</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>🔒</span>
                  <span>Secure payment processing</span>
                </div>
              </div>
            </div>

            {/* Promo Code (Optional) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Have a promo code?</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}