// src/components/HeroSlider.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Star, Users } from "lucide-react";
// 🔥 FIX 1: Modal Import kiya
import { BookingConsultation } from "./BookingConsultation"; 

const slides = [
  {
    id: 1,
    category: "New Arrival",
    title: "Breathe Pure Luxury",
    description: "Experience whisper-quiet performance with our premium range of designer kitchen hoods.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop", 
    cta: "Explore Chimneys",
    path: "/products?category=Chimneys",
    action: "link" 
  },
  {
    id: 2,
    category: "German Engineering",
    title: "Precision Meets Perfection",
    description: "Master the art of cooking with built-in ovens designed for professional chefs at home.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80", 
    cta: "Discover Ovens",
    path: "/products?category=Ovens",
    action: "link"
  },
  {
    id: 3,
    category: "Kitchen Studio",
    title: "Visualize Before You Buy",
    description: "Don't guess. See exactly how these appliances fit your space with our 3D Studio.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
    cta: "Book Consultation",
    path: "#",
    action: "modal" // 🔥 FIX 2: Ye flag button ko batayega ki modal kholna hai
  },
];

export function HeroSlider() {
  const navigate = useNavigate(); 
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  // 🔥 FIX 3: Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!autoplay || isModalOpen) return; // Agar modal open hai, toh slider auto-play band ho jayega
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, [autoplay, slides.length, isModalOpen]);

  const handleNext = () => {
    setAutoplay(false);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setAutoplay(false);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // 🔥 FIX 4: Click Handler (Route vs Modal)
  const handleCtaClick = (slide) => {
    if (slide.action === "modal") {
      setIsModalOpen(true);
      setAutoplay(false); // Pause slider
    } else {
      navigate(slide.path);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black font-sans">
      
      {/* Background Images */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <img src={slides[current].image} alt={slides[current].title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Text Content */}
      <div className="absolute inset-0 flex items-center z-10">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="w-full max-w-2xl pt-20 md:pt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={slides[current].id}
                variants={containerVariants} initial="hidden" animate="visible" exit="exit"
                className="space-y-6 md:space-y-8"
              >
                <motion.div variants={itemVariants} className="flex items-center gap-4">
                  <span className="h-[1px] w-8 md:w-16 bg-amber-500"></span>
                  <span className="text-[10px] md:text-[11px] font-bold tracking-[0.3em] text-amber-500 uppercase">
                    {slides[current].category}
                  </span>
                </motion.div>

                <motion.h1 variants={itemVariants} className="font-serif text-5xl md:text-7xl lg:text-[5rem] font-medium text-white leading-[1.05] tracking-tight drop-shadow-lg">
                  {slides[current].title}
                </motion.h1>

                <motion.p variants={itemVariants} className="max-w-md text-sm md:text-lg text-gray-300 font-light leading-relaxed drop-shadow-md">
                  {slides[current].description}
                </motion.p>

                <motion.div variants={itemVariants} className="pt-4">
                  <button 
                    onClick={() => handleCtaClick(slides[current])} 
                    className="group flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-amber-600 hover:border-amber-600 transition-all duration-500 rounded-full shadow-lg"
                  >
                    {slides[current].cta}
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                       <ArrowRight className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Controls & Progress Bar */}
      <div className="absolute bottom-28 md:bottom-24 right-6 md:right-12 lg:right-24 flex flex-col md:flex-row items-end md:items-center gap-6 md:gap-10 z-20">
        <div className="flex items-baseline gap-2 text-white font-serif drop-shadow-md">
            <span className="text-3xl md:text-4xl font-medium">{current + 1}</span>
            <span className="text-sm text-gray-400 font-light">/ {slides.length}</span>
        </div>
        <div className="flex gap-4">
          <button onClick={handlePrev} className="h-12 w-12 border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 transition-all duration-500 text-white rounded-full"><ChevronLeft className="h-5 w-5" /></button>
          <button onClick={handleNext} className="h-12 w-12 border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 transition-all duration-500 text-white rounded-full"><ChevronRight className="h-5 w-5" /></button>
        </div>
      </div>

      <div className="absolute bottom-28 md:bottom-24 left-6 md:left-12 lg:left-24 w-32 md:w-64 h-[2px] bg-white/20 z-20 overflow-hidden">
        <motion.div key={current} initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 6, ease: "linear" }} className="h-full bg-amber-500"/>
      </div>

      {/* Trust Bar */}
      <div className="absolute bottom-0 left-0 w-full z-20 border-t border-white/10 bg-black/40 backdrop-blur-xl py-5">
        <div className="container mx-auto px-6">
          <div className="flex justify-between md:justify-center items-center gap-4 md:gap-16 text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-gray-300 font-bold">
            <div className="flex items-center gap-3 hover:text-amber-500 transition-colors cursor-default"><Users className="w-4 h-4 text-amber-500 hidden sm:block" /><span>Authorized Partners</span></div>
            <span className="text-gray-600 hidden md:block">|</span>
            <div className="flex items-center gap-3 hover:text-amber-500 transition-colors cursor-default"><Star className="w-4 h-4 text-amber-500 hidden sm:block" /><span>Expert Guidance</span></div>
            <span className="text-gray-600 hidden md:block">|</span>
            <div className="flex items-center gap-3 hover:text-amber-500 transition-colors cursor-default"><ShieldCheck className="w-4 h-4 text-amber-500 hidden sm:block" /><span>Genuine Warranty</span></div>
          </div>
        </div>
      </div>

      {/* 🔥 FIX 5: Render Modal */}
      <BookingConsultation 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </section>
  );
}