import './App.css';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import KitchenLayoutDetail from './pages/KitchenLayoutDetail';
import Cart from './pages/Cart';
import VisitPage from './pages/VisitPage';
import ZoneProductsPage from './components/ZoneProductsPage';

function App() {
  return (
    <div className="App">
    
      
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/products" element={<Products />} /> */}
            {/* <Route path="/products/:id" element={<ProductDetail />} /> */}
          <Route path="/cart" element={<Cart/>} />
          <Route path="/visit" element={<VisitPage/>} />

          <Route path="/kitchen-layout/:id" element={<KitchenLayoutDetail />} />
          <Route path="/view-all-products" element={<ZoneProductsPage />} />
        </Routes>
      
   
    </div>
  );
}

export default App;