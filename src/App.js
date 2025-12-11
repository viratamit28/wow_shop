import './App.css';
import { Routes, Route } from 'react-router-dom'; // Note: Router/BrowserRouter hata diya yahan se

// Context & Components
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';

// Pages
import HomePage from './pages/HomePage';
import KitchenLayoutDetail from './pages/KitchenLayoutDetail';
import Cart from './pages/Cart';
import VisitPage from './pages/VisitPage';
import ZoneProductsPage from './components/ZoneProductsPage';

function App() {
  return (
    // 👇 AuthProvider rahega, par Router hat gaya
    <AuthProvider>
      <div className="App">
        
        {/* Header har page par dikhega */}
        <Header /> 

        {/* Routes badalne par content badlega */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/visit" element={<VisitPage/>} />
          <Route path="/kitchen-layout/:id" element={<KitchenLayoutDetail />} />
          <Route path="/view-all-products" element={<ZoneProductsPage />} />
        </Routes>
        
      </div>
    </AuthProvider>
  );
}

export default App;