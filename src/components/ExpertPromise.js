import React from "react";
import { ShieldCheck, Users, Ruler } from "lucide-react";
import { motion } from "framer-motion";
import authorise from '../assests/authorised dealer.png';
import site from '../assests/site.png';

export function ExpertPromise() {
  return (
    <section className="py-20 bg-[#F5F5F7] border-t border-gray-200">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm mb-4">
             <ShieldCheck className="w-4 h-4 text-amber-600" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">The Wow_Shop Guarantee</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
            Service Beyond Sales.
          </h2>
        </div>

        {/* --- PILLARS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          
          {/* Pillar 1: Authenticity */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="flex flex-col items-center text-center"
          >
             <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-4 border-white shadow-md">
                {/* Placeholder for Brand Logos Image */}
                <img 
                  src={authorise}
                  alt="Authentic Brands" 
                  className="w-full h-full object-cover"
                />
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-2 font-serif">Authorized Dealership</h3>
             <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
               We are official partners for Siemens, Bosch, and Faber. Zero third-party sourcing, 100% genuine warranty.
             </p>
          </motion.div>

          {/* Pillar 2: Guidance */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="flex flex-col items-center text-center relative"
          >
             {/* Decorative Connector Line for Desktop */}
             <div className="hidden md:block absolute top-10 -left-[50%] -right-[50%] h-[1px] bg-gray-300 -z-10" />
             
             <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-4 border-white shadow-md relative z-10">
                {/* Placeholder for Consultant Image */}
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80" 
                  alt="Expert Consultant" 
                  className="w-full h-full object-cover"
                />
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-2 font-serif">Personal Expert Assigned</h3>
             <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
               Get a dedicated consultant who guides you from selection to installation. No more call center loops.
             </p>
          </motion.div>

          {/* Pillar 3: Execution */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.4 }}
             className="flex flex-col items-center text-center"
          >
             <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-4 border-white shadow-md">
                {/* Placeholder for Engineer/Site Image */}
                <img 
                  src={site} 
                  alt="Site Check" 
                  className="w-full h-full object-cover"
                />
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-2 font-serif">Site Feasibility Check</h3>
             <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
               We verify your kitchen's dimensions and electrical points before dispatch to ensure a perfect fit.
             </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}