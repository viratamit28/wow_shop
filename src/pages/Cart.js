import React from 'react'
import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import CartDetail from '../components/CartDetail';
import SuggestedProducts from '../components/SuggestedProduct';

const Cart = () => {
  return (
    <div>
      <Header/>
       <CartDetail/>
       <SuggestedProducts/>
      <Footer/>
    </div>
  )
}

export default Cart;