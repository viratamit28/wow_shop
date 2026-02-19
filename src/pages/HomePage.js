// src/pages/HomePage.js
import React from 'react';
import { Header } from '../components/Header';
import { Footer } from "../components/Footer";
import { HeroSlider } from '../components/HeroSlider';
import { BrandPartners } from '../components/BrandPartners';
import { Categories } from '../components/Categories';
import KitchenDesign from '../components/KitchenDesign';
import { BookingConsultation as NewsLetter } from '../components/LuxuryDemoSection';
import ComparisonBanner from '../components/ComparisonBanner';
import KitchenSizer  from '../components/KitchenSizer';
import { ExpertPromise } from '../components/ExpertPromise';

// import ProductGridComponent from '../components/ui/ProductGridComponent';

function HomePage() {
  return (
    <div>
      <Header />
      <HeroSlider />
      <KitchenDesign />
      <ExpertPromise />
      <Categories />
      <KitchenSizer />
      <BrandPartners />
      <ComparisonBanner />
      <NewsLetter/>
      {/* <ProductGridComponent />  */}
      <Footer />
    </div>
  );
}

export default HomePage;