import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const collections = [
  {
    id: 1,
    title: "The Midnight Edition",
    description: "Bold black glass finishes that make a statement.",
    tag: "Best for Modern Interiors",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80", // Dark/Black Kitchen
    link: "/collections/midnight"
  },
  {
    id: 2,
    title: "The Invisible Kitchen",
    description: "Seamlessly integrates behind your cabinet doors.",
    tag: "For the Minimalist",
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80", // White/Hidden
    link: "/collections/invisible"
  },
  {
    id: 3,
    title: "The Chef's Studio",
    description: "Robust stainless steel engineering for heavy cooking.",
    tag: "For the Serious Cook",
    image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80", // Industrial/Steel
    link: "/collections/chef"
  }
];

export function CuratedCollections() {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-amber-600 font-bold tracking-[0.25em] text-xs uppercase mb-3 block"
          >
            Curated For You
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 leading-tight"
          >
            Define Your Kitchen's <br/><span className="italic text-gray-500">Personality.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 font-light text-sm md:text-base"
          >
            Don't mix and match. Choose coordinated sets designed to work together perfectly.
          </motion.p>
        </div>

        {/* --- GRID CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group cursor-pointer flex flex-col"
              onClick={() => navigate(item.link)}
            >
              {/* IMAGE CONTAINER */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-6">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay (Subtle) */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                
                {/* Floating Tag */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-sm">
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="text-center px-4">
                <h3 className="text-2xl font-serif text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 font-light mb-4 leading-relaxed">
                  {item.description}
                </p>
                <button className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 border-b border-gray-300 pb-1 group-hover:border-amber-600 group-hover:text-amber-600 transition-all">
                  View Collection <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}