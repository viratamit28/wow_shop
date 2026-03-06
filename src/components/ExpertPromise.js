import React, { useState } from "react"; // 🔥 1. Added useState
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, UserCheck, Ruler, Award } from "lucide-react";
import { motion } from "framer-motion";

// Local Assets
import authorise from '../assests/authorised dealer.png';
import site from '../assests/site.png';

// 🔥 2. Import your Consultation Modal
import { BookingConsultation } from "./BookingConsultation"; 

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

export function ExpertPromise() {
  const navigate = useNavigate();
  // 🔥 3. Modal State Added
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-24 md:py-32 bg-[#FAFAFA] border-t border-gray-200 overflow-hidden relative font-sans">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* === HEADER === */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="inline-flex items-center gap-2.5 bg-white px-5 py-2 rounded-full mb-6 border border-gray-100 shadow-sm"
              >
                 <ShieldCheck className="w-4 h-4 text-amber-600" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600">The wow_shop Guarantee</span>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 tracking-tight leading-[1.1]"
              >
                Service Beyond <br/><span className="italic text-gray-400 font-light">The Sale.</span>
              </motion.h2>
            </div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                <p className="text-gray-500 font-light max-w-sm text-sm md:text-base leading-relaxed">
                    Investing in luxury appliances requires absolute precision. We don't just deliver boxes; we engineer your kitchen's heartbeat.
                </p>
            </motion.div>
        </div>

        {/* === THE PROMISE CARDS === */}
        <motion.div 
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          
          <motion.div variants={itemVariants} className="group flex flex-col bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2">
             <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-amber-600 transition-colors duration-500">
                <Award className="w-8 h-8 text-amber-600 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
             </div>
             <h3 className="text-2xl font-serif text-gray-900 mb-4 tracking-tight">Authorized Dealership</h3>
             <p className="text-sm text-gray-500 leading-relaxed font-light mb-8 flex-1">
               Official partners for Siemens, Bosch, and Faber. Zero third-party sourcing ensures 100% genuine products and priority brand warranty.
             </p>
             <div className="w-full h-32 rounded-xl overflow-hidden bg-gray-50 relative mt-auto">
                <img src={authorise} alt="Authentic Brands" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
             </div>
          </motion.div>

          <motion.div variants={itemVariants} className="group flex flex-col bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
             <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-amber-600 transition-colors duration-500">
                <UserCheck className="w-8 h-8 text-amber-600 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
             </div>
             <h3 className="text-2xl font-serif text-gray-900 mb-4 tracking-tight">Personal Architect</h3>
             <p className="text-sm text-gray-500 leading-relaxed font-light mb-8 flex-1">
               Get a dedicated consultant who guides you from appliance selection to technical installation. No call centers, just direct expert access.
             </p>
             <div className="w-full h-32 rounded-xl overflow-hidden bg-gray-900 relative mt-auto group-hover:shadow-inner transition-all">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80" alt="Expert Consultant" className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80" />
             </div>
          </motion.div>

          <motion.div variants={itemVariants} className="group flex flex-col bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2">
             <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-amber-600 transition-colors duration-500">
                <Ruler className="w-8 h-8 text-amber-600 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
             </div>
             <h3 className="text-2xl font-serif text-gray-900 mb-4 tracking-tight">Site Feasibility Check</h3>
             <p className="text-sm text-gray-500 leading-relaxed font-light mb-8 flex-1">
               Before dispatch, our technical team verifies your kitchen's core dimensions, cut-outs, and electrical points to ensure a flawless, zero-error fit.
             </p>
             <div className="w-full h-32 rounded-xl overflow-hidden bg-gray-50 relative mt-auto">
                <img src={site} alt="Site Check" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
             </div>
          </motion.div>

        </motion.div>

        {/* === BOTTOM CALL TO ACTION === */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 text-center flex flex-col items-center border-t border-gray-200 pt-16"
        >
            <h3 className="text-2xl font-serif text-gray-900 mb-4">Ready to elevate your kitchen?</h3>
            <p className="text-sm text-gray-500 font-light mb-8 max-w-md">
              Claim your complimentary site visit and architectural consultation today.
            </p>
            
            
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="group flex items-center gap-4 bg-gray-900 text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-amber-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Request Expert Visit
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                 <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
        </motion.div>

      </div>

      
      <BookingConsultation 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </section>
  );
}