import React from 'react';
// Header aur Footer App.js me hain, yahan dubara mat lagao warna double dikhenge
import CartDetail from '../components/CartDetail';
import SuggestedProducts from '../components/SuggestedProduct'; // Ensure this file exists
import {Footer} from '../components/Footer';

const Cart = () => {
  return (
    <div>
       {/* Main Cart Logic Component */}
       <CartDetail/>
       
       {/* Recommendations (Optional) */}
       <div >
          <SuggestedProducts/>
       </div>
       {/* Footer */}
       <Footer />
    </div>
  )
}

export default Cart;