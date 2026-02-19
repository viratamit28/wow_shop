import React from 'react';
import { PhoneCall, MapPin, CalendarCheck } from 'lucide-react';
import { motion } from 'framer-motion';

// Note: 'openModal' prop hum baad mein pass karenge Context se
export const PreFooter = ({ onOpenModal }) => {
  return (
    <section className="w-full bg-[#111] border-t border-white/10 py-20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#C5A059]/30 rounded-full bg-[#C5A059]/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="text-[#C5A059] text-xs font-bold uppercase tracking-widest">Expert Support</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Still Confused About Dimensions?
          </h2>
          <p className="text-white/60 text-lg mb-10 leading-relaxed">
            Don't risk a wrong fit. Our technical team can visit your site to measure cuts, electrical points, and suggest the perfect matching appliances.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button 
              onClick={onOpenModal}
              className="px-8 py-4 bg-[#C5A059] text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-all flex items-center gap-2"
            >
              <CalendarCheck className="w-5 h-5" /> Book Site Visit
            </button>
            
            <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest text-sm hover:border-[#C5A059] hover:text-[#C5A059] transition-all flex items-center gap-2">
              <PhoneCall className="w-5 h-5" /> Request Callback
            </button>
          </div>

          {/* Trust Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/5">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-serif text-white mb-1">500+</span>
              <span className="text-white/40 text-xs uppercase tracking-widest">Luxury Kitchens</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-serif text-white mb-1">100%</span>
              <span className="text-white/40 text-xs uppercase tracking-widest">Genuine Parts</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-serif text-white mb-1">Top 3</span>
              <span className="text-white/40 text-xs uppercase tracking-widest">Brand Partners</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PreFooter;