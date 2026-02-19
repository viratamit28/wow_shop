import React from "react";
import { motion } from "framer-motion";

export const PageHero = ({ title, subtitle, image, label }) => {
  return (
    <div className="relative w-full h-[65vh] flex items-center overflow-hidden bg-black">
      
      {/* 1. Background Image (Full Screen) */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </motion.div>

      {/* 2. Content Container - MAIN FIX HERE */}
      {/* 'pt-32' add kiya hai taaki text header ke neeche aaye */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 pt-32">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
        >
            {label && (
                <span className="text-amber-500 font-bold tracking-widest text-xs uppercase mb-3 block">
                    {label}
                </span>
            )}
            <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 leading-tight">
                {title}
            </h1>
            <p className="text-gray-300 text-xl font-light max-w-xl leading-relaxed">
                {subtitle}
            </p>
        </motion.div>
      </div>
    </div>
  );
};