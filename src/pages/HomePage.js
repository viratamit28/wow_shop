// src/pages/HomePage.js
import React from 'react';
import { Header } from '../components/Header';
import { Footer } from "../components/Footer";
import { HeroSlider } from '../components/HeroSlider';
// import { Testimonials } from '../components/Testimonials';
import { BrandPartners } from '../components/BrandPartners';
import { Categories } from '../components/Categories';
import KitchenDesign from '../components/KitchenDesign';
// import FreeShippingFeatures from '../components/FreeShippingFeatures';
import NewsLetter from '../components/LuxuryDemoSection';
import ComparisonBanner from '../components/ComparisonBanner';
import { KitchenSizer } from '../components/KitchenSizer';


function HomePage() {
  return (
    <div>
      <Header />
      <HeroSlider />
      {/* <FreeShippingFeatures /> */}
      <KitchenDesign />
      <Categories />
      <KitchenSizer />
      {/* <Testimonials /> */}
      <NewsLetter/>
      <BrandPartners />
      <ComparisonBanner />
      <Footer />
    </div>
  );
}

export default HomePage;