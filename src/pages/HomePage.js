// src/pages/HomePage.js
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

import { HeroSlider } from '../components/HeroSlider';
import { BrandPartners } from '../components/BrandPartners';
import { Categories } from '../components/Categories';
import KitchenDesign from '../components/KitchenDesign';
import LuxuryDemoSection from '../components/LuxuryDemoSection';
import ComparisonBanner from '../components/ComparisonBanner';
import KitchenSizer from '../components/KitchenSizer';
import { ExpertPromise } from '../components/ExpertPromise';

export default function HomePage() {

  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
      className="w-full bg-white flex flex-col overflow-hidden"
    >
      <HeroSlider />
      <KitchenDesign />

      <ComparisonBanner />
      <Categories />
      <KitchenSizer />
      <BrandPartners />
      <LuxuryDemoSection />
      <ExpertPromise />
    </motion.div>
  );
}