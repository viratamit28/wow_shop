import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';

// Components (Global)
import { Header } from './components/Header';
import { Footer } from './components/Footer'; // Agar footer global rakhna hai

// Pages & Components (Updated Links)
import HomePage from './pages/HomePage';
import Cart from './pages/Cart';
import VisitPage from './pages/VisitPage';

// 👇 Ye wo naye features hain jo humne abhi banaye hain
import ChooseLayout from './components/ChooseLayout';         // Visualizer
import ProductDetailsPage from './components/ProductDetailsPage'; // Compare & Details
import CategoryPage from './components/CategoryPage';         // Filter Page
import ZoneProductsPage from './components/ZoneProductsPage'; // Existing
import BrandPage from './components/BrandPage';               // Existing

function App() {
  return (
    <AuthProvider>
      <div className="App">
        
        {/* Header sab pages ke upar dikhega */}
        <Header /> 

        <Routes>
          {/* 1. Home Page */}
          <Route path="/" element={<HomePage />} />

          {/* 2. Visualizer Flow (Main Tool) */}
          {/* Note: Maine KitchenLayoutDetail hata kar seedha ChooseLayout lagaya hai taaki naya design dikhe */}
          <Route path="/kitchen-layout/:id" element={<ChooseLayout />} />

          {/* 3. Product Details (With Manual Compare) */}
          <Route path="/product-details/:id" element={<ProductDetailsPage />} />

          {/* 4. Category Browsing (Ovens, Hobs, etc.) */}
          <Route path="/category/:slug" element={<CategoryPage />} />

          {/* 5. Other Pages */}
          <Route path="/cart" element={<Cart/>} />
          <Route path="/visit" element={<VisitPage/>} />
          <Route path="/view-all-products" element={<ZoneProductsPage />} />
          <Route path="/brand/:brandSlug" element={<BrandPage />} />
          
          {/* 6. 3D Tour Placeholder */}
          <Route path="/3d-tour" element={<div className="mt-32 text-center text-2xl">3D Tour Coming Soon...</div>} />

        </Routes>
        
        {/* Footer sab pages ke niche (Optional) */}
        {/* <Footer /> */} 
      </div>
    </AuthProvider>
  );
}

export default App;