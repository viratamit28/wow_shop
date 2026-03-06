import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const BASE_URL = `${BACKEND_URL}/api`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  
  const [cart, setCart] = useState([]); 
  const [cartCount, setCartCount] = useState(0);

  // --- CORE LOADER: USER & CART ---
  const loadUserAndCart = async (currentToken) => {
    if (!currentToken) {
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch User Profile
      // (Bhai check kar lena ki tere backend index.js me auth routes '/api/user' pe mounted ho)
      const userRes = await axios.get(`${BASE_URL}/user/profile`, {
        headers: { "auth-token": currentToken }
      });
      setUser(userRes.data);

      // 2. Fetch Cart Data (Populated array with product details)
      const cartRes = await axios.get(`${BASE_URL}/cart`, {
        headers: { "auth-token": currentToken }
      });
      
      const cartData = Array.isArray(cartRes.data) ? cartRes.data : [];
      setCart(cartData);
      
      // Calculate Total Quantity
      const count = cartData.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(count);

    } catch (error) {
      console.error("Session Error:", error.message);
      // Auto-logout if token is invalid or expired
      if(error.response?.status === 401 || error.response?.status === 403 || error.response?.status === 400){
          logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserAndCart(token);
  }, [token]);

  // --- ACTIONS ---
  const refreshCart = () => {
    if (token) loadUserAndCart(token);
  };

  const removeFromCart = async (productId) => {
    // 1. UI Optimistic Update (Immediate Response 🚀)
    const updatedCart = cart.filter(item => {
        const itemId = item.productId?._id || item.productId || item._id;
        return itemId !== productId;
    });
    setCart(updatedCart);
    setCartCount(updatedCart.reduce((sum, item) => sum + (item.quantity || 1), 0));

    // 2. Sync with Backend
    if (token) {
      try {
        await axios.delete(`${BASE_URL}/cart/delete/${productId}`, {
          headers: { "auth-token": token }
        });
      } catch (error) {
        console.error("Delete Sync Error:", error.message);
        refreshCart(); // Rollback agar backend se API fail ho jaye
      }
    }
  };

  // Jab user login karega
  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    // user set karne ki zaroorat nahi, useEffect khud loadUserAndCart trigger kar dega
  };

  // Jab user logout karega
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setCart([]);
    setCartCount(0);
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        token, 
        login, 
        logout, 
        loading, 
        cart, 
        cartCount, 
        refreshCart,
        removeFromCart
    }}>
      {children}
    </AuthContext.Provider>
  );
};