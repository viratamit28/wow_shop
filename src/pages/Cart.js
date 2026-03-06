import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// Components
import CartDetail from '../components/CartDetail';
import SuggestedProducts from '../components/SuggestedProduct'; 

const Cart = () => {
  // Page load hote hi hamesha top par scroll karega (Premium UX practice)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <motion.main 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#F5F5F7] font-sans pt-28 pb-10 selection:bg-amber-500 selection:text-white"
    >
      {/* SECTION 1: THE INQUIRY PORTFOLIO (Cart Details) */}
      <section className="container mx-auto px-6 max-w-7xl">
        <CartDetail />
      </section>
       
      {/* SECTION 2: COMPLEMENTARY RECOMMENDATIONS */}
      <section className="mt-20 pt-20 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <SuggestedProducts />
        </div>
      </section>

    </motion.main>
  );
}

export default Cart;