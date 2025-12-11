import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  // 👇 Global Cart Count
  const [cartCount, setCartCount] = useState(0);

  // Function to refresh user and cart
  const loadUserAndCart = async (currentToken) => {
    if (currentToken) {
      try {
        // 1. Load User
        const userRes = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { "auth-token": currentToken }
        });
        setUser(userRes.data);

        // 2. Load Cart Count (Directly from DB)
        const cartRes = await axios.get("http://localhost:5000/api/cart", {
          headers: { "auth-token": currentToken }
        });
        // Total quantity calculate karo
        const count = cartRes.data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);

      } catch (error) {
        console.error("Auth Error", error);
        logout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUserAndCart(token);
  }, [token]);

  // 👇 Ye function hum components se call karenge jab bhi cart update hoga
  const refreshCart = () => {
    if (token) loadUserAndCart(token);
  };

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(userData);
    loadUserAndCart(token); // Login ke baad turant load karo
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setCartCount(0);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, cartCount, refreshCart }}>
      {children}
    </AuthContext.Provider>
  );
};