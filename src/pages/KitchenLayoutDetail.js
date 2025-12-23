import React from 'react'
import {Header} from '../components/Header';
import ProductGridComponent from '../components/ProductGridComponent';
import { Footer } from '../components/Footer';
import ChooseLayout from '../components/ChooseLayout';
// import ComparisonBanner from '../components/ComparisonBanner';

const KitchenLayoutDetail = () => {
  return (
    <div>
      <Header />
      <div className='mt-20' >
      <ChooseLayout/>
      {/* <ComparisonBanner /> */}

      </div>
      <ProductGridComponent/>
      <Footer />
    </div>
  )
}

export default KitchenLayoutDetail;