import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";

// Context
import { AuthProvider } from "./context/AuthContext";

// Components (Global)
import { Header } from "./components/Header";

// Pages - Main Flow
import HomePage from "./pages/HomePage";
import Cart from "./pages/Cart";

// 👇 IMPORT THIS FILE (Ensure ye file 'src/pages' folder me bani ho)
import ConsultationPage from "./pages/ConsultationPage";

// Pages - Features
import ChooseLayout from "./components/ChooseLayout";
import ProductDetailsPage from "./components/ProductDetailsPage";
import CategoryPage from "./components/CategoryPage";
import ZoneProductsPage from "./components/ZoneProductsPage";
import BrandPage from "./components/BrandPage";
import VisitPage from "./pages/VisitPage";

import { KnowledgeLibrary } from "./pages/KnowledgeLibrary";
import { ExpertGuidance } from "./pages/ExpertGuidance";

import { ArticleDetail } from "./pages/ArticleDetail";
// Pehle upar import karo
import AddProductPage from "./pages/AddProductPage";
import { Footer } from "./components/Footer";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Header />

        <Routes>
          {/* --- 1. DISCOVERY PHASE --- */}
          <Route path="/" element={<HomePage />} />

          <Route path="/kitchen-layout/:id" element={<ChooseLayout />} />
          <Route path="/products" element={<ZoneProductsPage />} />
          <Route path="/product-details/:id" element={<ProductDetailsPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/brand/:brandName" element={<BrandPage />} />
          <Route path="/visit" element={<VisitPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/expert/knowledge" element={<KnowledgeLibrary />} />
          <Route path="/expert/guidance" element={<ExpertGuidance />} />
          <Route path="/expert" element={<ExpertGuidance />} />
          <Route path="/expert/article/:id" element={<ArticleDetail />} />

          <Route path="/admin/add-product" element={<AddProductPage />} />
          {/* --- 2. PURCHASING PHASE (Cart) --- */}
          <Route path="/cart" element={<Cart />} />

         
          {/* 👇 YE ROUTE ADD KARO */}
          <Route path="/consultation" element={<ConsultationPage />} />

          {/* Orders Route (Optional/Future) */}
          <Route
            path="/orders"
            element={
              <div className="mt-32 text-center text-2xl font-bold">
                My Orders History (Coming Soon)
              </div>
            }
          />
        </Routes>
      </div>
      <Footer />
    </AuthProvider>
  );
}

export default App;
