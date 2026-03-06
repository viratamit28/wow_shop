import React, { useEffect } from 'react';


import ChooseLayout from '../components/ChooseLayout';
import ComparisonBanner from '../components/ComparisonBanner';

const KitchenLayoutDetail = () => {
  // 🔥 PRODUCTION FIX: Page load hone par hamesha top par scroll karega
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    // 🔥 FIX: Flex aur min-h-screen taaki Footer hamesha bottom par rahe
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] font-sans">
      
    
      {/* Main content area:
        pt-24 (padding-top) lagaya hai taaki fixed Header content ke upar overlap na kare.
      */}
      <main className="flex-grow pt-24 pb-12">
        
        {/* Section 1: Choose Layout */}
        <section className="mb-16 md:mb-24">
          <ChooseLayout />
        </section>

        {/* Section 2: Comparison Tool (Jo humne kal perfect kiya tha) */}
        <section className="mb-16 md:mb-24">
          <ComparisonBanner />
        </section>

        {/* Section 3: Product Grid */}
        <section className="mb-10">
          {/* <ProductGridComponent /> */}
        </section>

      </main>

    </div>
  );
};

export default KitchenLayoutDetail;