import React from 'react'
import {Header} from '../components/Header';
import ProductGridComponent from '../components/ProductGridComponent';
import { Footer } from '../components/Footer';
import ChooseLayout from '../components/ChooseLayout';

const KitchenLayoutDetail = () => {
  return (
    <div>
      <Header />
      <div className='mt-20'>
      <ChooseLayout/>

      </div>
      <ProductGridComponent/>
      <Footer />
    </div>
  )
}

export default KitchenLayoutDetail;