// src/pages/HomePage.js
import React from 'react';
import { Header } from '../components/Header';
import { Footer } from "../components/Footer";
import { HeroSlider } from '../components/HeroSlider';
// import { Testimonials } from '../components/Testimonials';
import { BrandPartners } from '../components/BrandPartners';
import { Categories } from '../components/Categories';
import KitchenDesign from '../components/KitchenDesign';
import FreeShippingFeatures from '../components/FreeShippingFeatures';
import NewsLetter from '../components/LuxuryDemoSection';


function HomePage() {
  return (
    <div>
      <Header />
      <HeroSlider />
      <FreeShippingFeatures />
      <KitchenDesign />
      <BrandPartners />
      <Categories />
      {/* <Testimonials /> */}
      <NewsLetter/>
      <Footer />
    </div>
  );
}

export default HomePage;