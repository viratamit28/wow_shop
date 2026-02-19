import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ScanLine, Maximize, Move3d } from "lucide-react";

export function ProblemSolver() {
  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          
          {/* 1. LEFT SIDE: CONTENT (The Pitch) */}
          <div className="text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 leading-tight mb-6">
                Stop Guessing. <br />
                <span className="italic text-gray-500">Start Designing.</span>
              </h2>
              
              <p className="text-gray-600 text-lg font-light leading-relaxed max-w-md">
                Don't rely on imagination. Upload your kitchen photo and see exactly how our appliances fit—in seconds.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <button className="group flex items-center gap-3 text-sm uppercase tracking-[0.2em] font-bold text-amber-700 hover:text-amber-900 transition-colors">
                See How It Works
                <span className="bg-amber-100 p-2 rounded-full group-hover:bg-amber-200 transition-colors">
                   <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </motion.div>
          </div>

          {/* 2. RIGHT SIDE: VISUAL (The "Fake" Software Look) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full aspect-[4/3] md:aspect-square lg:aspect-[4/3]"
          >
            {/* Background Image (Representing User's Kitchen) */}
            <div className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl shadow-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80" 
                alt="Kitchen Visualizer Interface" 
                className="w-full h-full object-cover filter brightness-[0.9]"
              />
              
              {/* Overlay Gradient to make UI pop */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
            </div>

            {/* --- UI ELEMENTS (To make it look like an App without Video) --- */}
            
            {/* Element 1: The "Scanner" Line (Animation) */}
            <motion.div 
                animate={{ top: ["10%", "80%", "10%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[1px] bg-amber-400/80 shadow-[0_0_10px_rgba(251,191,36,0.5)] z-10 mx-4"
            />

            {/* Element 2: Floating "Dimensions" Tag */}
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-10 bg-white/90 backdrop-blur-md p-3 rounded-md shadow-lg border border-white/50 z-20 max-w-[150px]"
            >
                <div className="flex items-center gap-2 mb-1">
                    <Maximize className="w-3 h-3 text-amber-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-800">Perfect Fit</span>
                </div>
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-green-500 rounded-full" />
                </div>
                <p className="text-[9px] text-gray-500 mt-1">Checking dimensions...</p>
            </motion.div>

            {/* Element 3: "3D View" Button Mockup */}
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
                <div className="bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 text-xs uppercase tracking-widest shadow-xl">
                    <Move3d className="w-4 h-4 text-amber-500" />
                    3D View Active
                </div>
            </div>

            {/* Element 4: Center Focus Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white/30 rounded-full flex items-center justify-center">
                 <div className="w-16 h-16 border border-white/60 rounded-full animate-ping opacity-20" />
                 <div className="w-2 h-2 bg-white rounded-full" />
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}