import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

// === ASSETS IMPORT ===
import imgOven from '../assests/oven.jpg';
import imgChimney from '../assests/chemni.jpg';
import imgFridge from '../assests/refrigarator.jpg';
import imgCountertop from '../assests/countertop.jpg';
import imgLaundry from '../assests/laundry.jpg';

// Content strictly from the provided Word Document
const categoryEducationData = {
  "Oven": {
    title: "Built-in Ovens",
    image: imgOven,
    intro: "Redefine modern cooking with exquisitely crafted built-in ovens that embody true luxury and innovation. Designed to blend seamlessly into high-end modular kitchens, they offer a refined aesthetic with flawless integration and minimalist elegance.",
    details: [
      "Engineered with advanced features like convection cooking, multi-function programs, and precision temperature control, they deliver exceptional results for baking, roasting, and grilling. Crafted for those who expect more from their kitchen, these luxury built-in electric ovens combine intelligent technology with effortless convenience.",
      "From intuitive controls to energy-efficient operation, every detail is designed to enhance comfort and sophistication. Perfect for contemporary homes, high-end built-in ovens are more than appliances—they are a statement of style, performance, and culinary excellence."
    ]
  },
  "Hob": {
    title: "Premium Hobs",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1600", 
    intro: "Transform everyday cooking into a refined experience with premium hobs engineered for precision and control. Designed as the heart of your kitchen, these luxury hobs deliver instant, adjustable heat for everything from slow simmering to high-intensity cooking.",
    details: [
      "Whether you choose gas hobs, built-in hobs, or advanced induction cooktops, each option ensures faster heating, consistent flame or temperature control, and improved energy efficiency. With features like multi-burner configurations, auto-ignition, flame failure safety, and touch controls, high-end hobs make cooking safer, quicker, and more intuitive.",
      "They allow you to prepare multiple dishes simultaneously while maintaining perfect heat balance. Crafted for modern lifestyles, premium built-in hobs not only enhance cooking performance but also bring elegance and seamless functionality to sophisticated kitchens."
    ]
  },
  "Hood": { 
    title: "Designer Chimneys",
    image: imgChimney,
    intro: "Experience a cleaner, smarter kitchen with designer chimneys that do far more than just complement your interiors. These premium kitchen chimneys are designed to efficiently remove smoke, oil particles, heat, and strong cooking odors.",
    details: [
      "With powerful suction capacity, they instantly draw in fumes and grease, preventing them from settling on walls, cabinets, and countertops. Equipped with features like auto-clean technology, filterless operation, touch controls, and motion sensors, luxury chimneys reduce maintenance efforts and make daily use effortless.",
      "They also improve visibility while cooking by eliminating steam and excess heat, creating a more comfortable cooking environment. Ideal for modern homes, high-end designer chimneys simplify kitchen upkeep, enhance hygiene, and bring both convenience and elegance."
    ]
  },
  "Refrigerator": {
    title: "Refrigerators",
    image: imgFridge,
    intro: "Redefine food storage with premium refrigerators designed to deliver superior cooling performance and refined elegance. These luxury refrigerators go beyond basic storage, maintaining optimal temperature and humidity levels.",
    details: [
      "With advanced cooling technologies like multi-airflow systems and frost-free operation, they ensure even cooling across every shelf to keep fruits, vegetables, dairy, and beverages fresh for longer. Designed for convenience, high-end refrigerators feature spacious compartments, smart organization, and energy-efficient performance.",
      "Options like double-door, side-by-side, and smart refrigerators offer enhanced accessibility and intelligent controls. Perfect for contemporary homes, premium fridges simplify daily living by preserving freshness, reducing food waste, and adding a sophisticated touch to your space."
    ]
  },
  "Countertop": {
    title: "Countertops",
    image: imgCountertop,
    intro: "Upgrade your kitchen foundation with premium countertops that combine durability, functionality, and refined aesthetics. Designed to withstand daily use, these luxury surfaces provide a strong, heat-resistant, and easy-to-clean workspace.",
    details: [
      "Whether crafted from granite, quartz, or other high-end materials, they offer excellent resistance to scratches, stains, and moisture. Built for both performance and style, high-end countertops create a seamless workspace that enhances efficiency while maintaining a polished, sophisticated look.",
      "Their smooth, non-porous surfaces promote better hygiene and simplify maintenance, making everyday kitchen tasks more convenient. Ideal for modern homes, designer countertops not only support your cooking needs but also elevate the overall appeal of your kitchen with timeless elegance."
    ]
  },
  "Washing": {
    title: "Washing Machines",
    image: imgLaundry,
    intro: "Indulge in a superior standard of fabric care with premium washing machines crafted for luxury living and exceptional performance. They deliver deep, gentle cleaning while preserving the richness and texture of every fabric.",
    details: [
      "These luxury washing machines are engineered with advanced wash technologies, intelligent sensors, and precision drum movements. From delicate garments to heavy loads, they ensure impeccable results with minimal effort. Designed for modern sophistication, high-end washing machines feature whisper-quiet operation and seamless smart controls.",
      "With refined aesthetics, spacious capacity, and energy-efficient performance that adapts intuitively to your laundry needs, they elevate both functionality and style. Perfect for those who expect nothing but excellence, premium washers transform everyday laundry into a seamless experience."
    ]
  }
};

export default function CategoryEducation({ category, type }) {
  const activeKey = category || type;
  
  const matchedKey = Object.keys(categoryEducationData).find(k => 
    activeKey && activeKey.toLowerCase().includes(k.toLowerCase())
  );

  const data = matchedKey ? categoryEducationData[matchedKey] : null;

  if (!data) return null;

  return (
    <section className="bg-[#F9FAFB] py-16 md:py-24 lg:py-32 relative overflow-hidden font-sans border-b border-gray-100">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-12 relative flex flex-col lg:flex-row items-center lg:min-h-[650px]">
        
        {/* === BACKGROUND IMAGE (Right Aligned on Desktop, Top on Mobile) === */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[60%] h-[50vh] lg:h-[90%] rounded-[2rem] lg:rounded-l-[3rem] overflow-hidden shadow-2xl relative z-0"
        >
          <img 
            src={data.image} 
            alt={data.title} 
            className="w-full h-full object-cover filter brightness-[0.9] transition-transform duration-[4s] hover:scale-105" 
          />
          {/* Elegant Dark Gradient for Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent mix-blend-overlay" />
          
          {/* Subtle Vertical Text Badge */}
          <div className="hidden lg:block absolute bottom-12 right-12 text-white/50 origin-bottom-right -rotate-90 text-[9px] uppercase tracking-[0.4em] font-bold">
            Curated Excellence
          </div>
        </motion.div>

        {/* === FOREGROUND TEXT CARD (Overlapping magically) === */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full lg:w-[50%] mt-[-100px] lg:mt-0 bg-white/95 backdrop-blur-xl p-8 sm:p-10 md:p-14 lg:p-20 rounded-[2.5rem] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.1)] border border-white"
        >
          {/* Decorative Overline */}
          <div className="flex items-center gap-4 mb-8 md:mb-10">
            <span className="w-10 h-[1.5px] bg-amber-600"></span>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-gray-400">
              The Masterclass
            </span>
          </div>

          {/* Big Elegant Title */}
          <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-serif text-gray-900 mb-8 leading-[1.1] tracking-tight">
            {data.title}
          </h2>

          {/* Intro text (Magazine Pull-Quote Style) */}
          <div className="relative mb-12">
            <Quote className="absolute -top-3 -left-4 w-12 h-12 text-gray-100 -z-10 rotate-180" />
            <p className="text-base md:text-lg text-gray-800 font-light leading-relaxed pl-4 border-l-[3px] border-amber-500">
              {data.intro}
            </p>
          </div>

          {/* Detailed Paragraphs with Editorial Numbering */}
          <div className="space-y-8 md:space-y-10">
            {data.details.map((paragraph, index) => (
              <div key={index} className="flex gap-5 md:gap-6 group">
                {/* Minimalist Editorial Numbering (01, 02) */}
                <div className="flex flex-col items-center gap-2 shrink-0 pt-1">
                  <span className="text-[10px] font-bold text-amber-600 tracking-widest">
                    0{index + 1}
                  </span>
                  <div className="w-[1px] h-full min-h-[40px] bg-gray-100 group-hover:bg-amber-300 transition-colors duration-500"></div>
                </div>
                
                <p className="text-sm md:text-base text-gray-500 font-light leading-relaxed group-hover:text-gray-900 transition-colors duration-500">
                  {paragraph}
                </p>
              </div>
            ))}
          </div>

        </motion.div>

      </div>
    </section>
  );
}