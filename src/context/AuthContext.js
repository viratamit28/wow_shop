import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  
  // 👇 Cart State (Items array) and Count
  const [cart, setCart] = useState([]); 
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

        // 2. Load Cart Data from DB
        const cartRes = await axios.get("http://localhost:5000/api/cart", {
          headers: { "auth-token": currentToken }
        });
        
        // Data set karo
        setCart(cartRes.data);
        
        // Total quantity calculate karo
        const count = cartRes.data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);

      } catch (error) {
        console.error("Auth Error", error);
        // Agar token expire ho gaya, to logout karo
        if(error.response && error.response.status === 401){
            logout();
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUserAndCart(token);
  }, [token]);

  // 👇 ADD TO CART FUNCTION (Global Helper)
  const addToCart = async (product, quantity = 1) => {
      // Logic for adding (Backend Call)
      // Aap chaho toh ise implement kar sakte ho ya existing logic use karo
      refreshCart();
  };

  // 👇 REMOVE FROM CART FUNCTION (The Fix)
  const removeFromCart = async (productId) => {
    // 1. Pehle Screen se hata do (Optimistic Update)
    const updatedCart = cart.filter(item => {
         const itemId = item.productId?._id || item.productId || item._id;
         return itemId !== productId;
    });
    setCart(updatedCart);
    setCartCount(updatedCart.reduce((sum, item) => sum + item.quantity, 0));

    // 2. Database se Delete call karo
    if (token) {
      try {
        await axios.delete(`http://localhost:5000/api/cart/delete/${productId}`, {
          headers: { "auth-token": token }
        });
        console.log("Deleted from DB");
      } catch (error) {
        console.error("Delete Error", error);
        refreshCart(); // Agar fail hua to wapis load karlo
      }
    }
  };

  const refreshCart = () => {
    if (token) loadUserAndCart(token);
  };

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(userData);
    // loadUserAndCart effect se apne aap call ho jayega
  };

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
        cart,      // 👈 Ab Cart items bhi context me hain
        cartCount, 
        refreshCart,
        removeFromCart, // 👈 New Function exposed
        addToCart
    }}>
      {children}
    </AuthContext.Provider>
  );
};