import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// --- Context Providers ---
import { AuthProvider } from "./context/AuthContext";

// --- Layout Components ---
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

// --- Main Pages ---
import HomePage from "./pages/HomePage";
import Cart from "./pages/Cart";
import ConsultationPage from "./pages/ConsultationPage";
import ProfilePage from "./pages/ProfilePage";
import VisitPage from "./pages/VisitPage";
import AddProductPage from "./pages/AddProductPage";

// --- Functional Components / Secondary Pages ---
import ChooseLayout from "./components/ChooseLayout";
import ProductDetailsPage from "./components/ProductDetailsPage";
import CategoryPage from "./components/CategoryPage";
import ZoneProductsPage from "./components/ZoneProductsPage";
import BrandPage from "./components/BrandPage";
import ProductGridComponent from "./components/ProductGridComponent";

// --- Expert & Knowledge Base ---
import { KnowledgeLibrary } from "./pages/KnowledgeLibrary";
import { ExpertGuidance } from "./pages/ExpertGuidance";
import { ArticleDetail } from "./pages/ArticleDetail";

function App() {
  return (
    <AuthProvider>
      <div className="App flex flex-col min-h-screen bg-white">
        <Header />

        <main className="flex-grow">
          <Routes>
            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductGridComponent />} />
            <Route path="/products" element={<ZoneProductsPage />} />
            <Route path="/product-details/:id" element={<ProductDetailsPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/brand/:brandName" element={<BrandPage />} />
            <Route path="/kitchen-layout/:id" element={<ChooseLayout />} />
            <Route path="/visit" element={<VisitPage />} />
            
            {/* ================= EXPERT SECTION ================= */}
            <Route path="/expert" element={<ExpertGuidance />} />
            <Route path="/expert/knowledge" element={<KnowledgeLibrary />} />
            <Route path="/expert/guidance" element={<ExpertGuidance />} />
            <Route path="/expert/article/:id" element={<ArticleDetail />} />

            {/* ================= PRIVATE / USER ROUTES ================= */}
            {/* Note: Production me inko ProtectedRoute component se wrap karna chahiye */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/consultation" element={<ConsultationPage />} />
            
            <Route 
              path="/orders" 
              element={
                <div className="mt-32 flex justify-center items-center text-2xl font-bold text-gray-400">
                  My Orders History (Coming Soon)
                </div>
              } 
            />

            {/* ================= ADMIN ROUTES ================= */}
            <Route path="/admin/add-product" element={<AddProductPage />} />

            {/* ================= 404 NOT FOUND ================= */}
            <Route 
              path="*" 
              element={
                <div className="mt-32 flex flex-col items-center justify-center">
                  <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
                  <p className="text-xl text-gray-600">Page Not Found</p>
                </div>
              } 
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;