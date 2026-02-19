import React, { useState } from "react";
import { ArrowRight, Check, Calendar, Clock, Star, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- CONFIGURATION ---
const LUXURY_BG_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80";
const DATES_TO_GENERATE = 7;
const TIME_SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];

export function BookingConsultation({ isOpen, onClose }) {
  const [step, setStep] = useState(0); 
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generate Dates
  const dates = Array.from({ length: DATES_TO_GENERATE }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dayName: d.toLocaleDateString("en-US", { weekday: "long" }),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      fullDate: d.toISOString().split("T")[0],
    };
  });

  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep((prev) => prev + 1);
    }, 800);
  };

  // --- ANIMATIONS ---
  const spotlightVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "circOut" } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } }
  };

  return (
    <section className="relative w-full h-screen bg-black text-white font-luxury-sans overflow-hidden flex items-center justify-center">
      
      {/* 1. DARK CINEMATIC BACKGROUND (No Blur) */}
      <div className="absolute inset-0 z-0">
        <img 
            src={LUXURY_BG_IMAGE} 
            alt="Background" 
            className="w-full h-full object-cover opacity-20" // Very dark image
        />
        {/* Heavy Vignette to focus center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)]" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* 2. THE SPOTLIGHT BEAM (Lighting Effect) */}
      {/* Yeh wo light hai jo upar se content par gir rahi hai */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-b from-white/10 via-transparent to-transparent blur-[80px] pointer-events-none z-0" />
      
      {/* 3. MAIN CONTENT CONTAINER */}
      <div className="relative z-10 w-full max-w-5xl p-6">
        <AnimatePresence mode="wait">
          
          {/* --- STEP 0: INTRO (The Invitation) --- */}
          {step === 0 && (
            <motion.div
              key="step0"
              variants={spotlightVariants}
              initial="hidden" animate="visible" exit="exit"
              className="flex flex-col items-center text-center"
            >
              {/* Glowing Top Line */}
              <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent mb-8" />

              <div className="border border-[#D4AF37] px-6 py-2 mb-8 bg-black">
                  <span className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] font-bold">Exclusive Access</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-luxury-serif text-white mb-8 leading-none tracking-tight">
                Design <span className="text-[#D4AF37] italic">Sanctuary</span>
              </h1>
              
              <p className="text-neutral-400 text-lg font-light max-w-lg mx-auto leading-relaxed mb-12">
                A private consultation to craft your culinary legacy. Reserve your moment with our architects.
              </p>

              <button
                onClick={() => setStep(1)}
                className="group relative px-12 py-4 bg-transparent border border-white/20 hover:border-[#D4AF37] transition-colors duration-500"
              >
                <span className="text-xs font-bold uppercase tracking-[0.3em] group-hover:text-[#D4AF37] transition-colors">Enter</span>
                {/* Button Glow Effect */}
                <div className="absolute inset-0 bg-[#D4AF37]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </motion.div>
          )}

          {/* --- STEP 1: DATE (The Grid) --- */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={spotlightVariants}
              initial="hidden" animate="visible" exit="exit"
              className="w-full max-w-4xl mx-auto"
            >
              <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
                <div>
                    <p className="text-[#D4AF37] text-xs uppercase tracking-[0.3em] mb-2">Step 01</p>
                    <h2 className="text-4xl font-luxury-serif text-white">Choose a Date</h2>
                </div>
                <button onClick={() => setStep(0)} className="text-white/40 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest"><ChevronLeft className="w-4 h-4"/> Back</button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px bg-white/10 border border-white/10"> 
                {/* Gap-px creates the grid lines look */}
                {dates.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedDate(item); handleNext(); }}
                    className="group relative h-48 bg-black hover:bg-[#0a0a0a] transition-colors flex flex-col items-center justify-center gap-4 overflow-hidden"
                  >
                    {/* The Spotlight Hover Effect inside card */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 group-hover:text-[#D4AF37] transition-colors relative z-10">{item.month}</span>
                    <span className="text-5xl font-luxury-serif text-white group-hover:scale-110 transition-transform duration-500 relative z-10">{item.dayNumber}</span>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 relative z-10">{item.dayName.substring(0,3)}</span>
                    
                    {/* Bottom Active Line */}
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#D4AF37] scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </button>
                ))}
              </div>
              
              {loading && <div className="mt-8 text-center text-[#D4AF37] text-xs uppercase tracking-widest animate-pulse">Syncing Calendar...</div>}
            </motion.div>
          )}

          {/* --- STEP 2: TIME (The List) --- */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={spotlightVariants}
              initial="hidden" animate="visible" exit="exit"
              className="w-full max-w-2xl mx-auto"
            >
              <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
                <div>
                    <p className="text-[#D4AF37] text-xs uppercase tracking-[0.3em] mb-2">Step 02</p>
                    <h2 className="text-4xl font-luxury-serif text-white">Select Time</h2>
                    <p className="text-neutral-500 text-sm mt-1 uppercase tracking-wider">{selectedDate?.dayName}, {selectedDate?.dayNumber} {selectedDate?.month}</p>
                </div>
                <button onClick={() => setStep(1)} className="text-white/40 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest"><ChevronLeft className="w-4 h-4"/> Back</button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {TIME_SLOTS.map((time, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedTime(time); handleNext(); }}
                    className="relative py-6 border border-white/10 bg-black hover:border-[#D4AF37] text-xl font-luxury-serif tracking-widest group transition-all duration-300"
                  >
                    <span className="relative z-10 group-hover:text-[#D4AF37] transition-colors">{time}</span>
                    {/* Corner accents for tech feel */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30 group-hover:border-[#D4AF37] transition-colors" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30 group-hover:border-[#D4AF37] transition-colors" />
                  </button>
                ))}
              </div>
              
              {loading && <div className="mt-8 text-center text-[#D4AF37] text-xs uppercase tracking-widest animate-pulse">Confirming Slot...</div>}
            </motion.div>
          )}

          {/* --- STEP 3: CONFIRMED (The Revelation) --- */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={spotlightVariants}
              initial="hidden" animate="visible" exit="exit"
              className="flex flex-col items-center justify-center text-center relative"
            >
              {/* Backlight Burst */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/10 blur-[100px] rounded-full -z-10" />

              <div className="w-16 h-16 border border-[#D4AF37] flex items-center justify-center mb-8 rotate-45">
                 <div className="w-12 h-12 bg-[#D4AF37] flex items-center justify-center -rotate-45">
                    <Check className="w-6 h-6 text-black" />
                 </div>
              </div>

              <h2 className="text-6xl font-luxury-serif text-white mb-6">Confirmed</h2>
              
              <div className="flex flex-col items-center gap-2 mb-12">
                <p className="text-neutral-400 text-xs uppercase tracking-[0.3em]">Your Appointment</p>
                <div className="text-2xl text-white font-light border-y border-white/10 py-4 px-12">
                  {selectedDate?.dayNumber} {selectedDate?.month} <span className="mx-4 text-[#D4AF37]">//</span> {selectedTime}
                </div>
              </div>

              <button 
                onClick={() => { if(onClose) onClose(); else window.location.reload(); }}
                className="text-white/50 hover:text-white text-[10px] uppercase tracking-[0.3em] transition-colors hover:underline decoration-[#D4AF37] underline-offset-8"
              >
                Close Invitation
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  );
}