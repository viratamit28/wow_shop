import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 👈 1. IMPORT THIS
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Star, Users } from "lucide-react";

const slides = [
  {
    id: 1,
    category: "New Arrival",
    title: "Breathe Pure Luxury",
    description: "Experience whisper-quiet performance with our premium range of designer kitchen hoods.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop", 
    cta: "Explore Hoods",
    path: "/category/hoods" // 👈 2. LINK ADDED (To Products Page)
  },
  {
    id: 2,
    category: "German Engineering",
    title: "Precision Meets Perfection",
    description: "Master the art of cooking with built-in ovens designed for professional chefs at home.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80", 
    cta: "Discover More",
    path: "/products" // 👈 2. LINK ADDED (To Products Page)
  },
  {
    id: 3,
    category: "Kitchen Studio",
    title: "Visualize Before You Buy",
    description: "Don't guess. See exactly how these appliances fit your space with our 3D Studio.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
    cta: "Try 3D Studio",
    path: "/studio" // 👈 2. LINK ADDED (To Studio Page)
  },
];

export function HeroSlider() {
  const navigate = useNavigate(); // 👈 3. INITIALIZE NAVIGATION
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, [autoplay, current]);

  const handleNext = () => {
    setAutoplay(false);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setAutoplay(false);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // --- ANIMATIONS ---
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    }),
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } }
  };

  const imageVariants = {
    initial: { scale: 1.1 },
    animate: { scale: 1, transition: { duration: 8, ease: "easeOut" } }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#F5F5F7] text-gray-900">
      
      {/* 1. BACKGROUND IMAGE LAYER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }} 
        >
          <motion.img
            src={slides[current].image}
            alt={slides[current].title}
            className="h-full w-full object-cover"
            variants={imageVariants}
            initial="initial"
            animate="animate"
          />
          
          {/* IMPORTANT: The "Matte" Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F5F7] via-[#F5F5F7]/80 to-transparent md:via-[#F5F5F7]/40" />
          
          {/* Mobile bottom fade for readability */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#F5F5F7] to-transparent md:hidden" />
        </motion.div>
      </AnimatePresence>

      {/* 2. MAIN TEXT CONTENT */}
      <div className="absolute inset-0 flex items-center px-6 md:px-20 lg:px-24">
        <div className="w-full max-w-2xl overflow-hidden z-10 pt-20 md:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[current].id}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              {/* Category */}
              <motion.div custom={0} variants={textVariants} className="flex items-center gap-4">
                <span className="h-[1px] w-8 md:w-12 bg-amber-600"></span>
                <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-amber-700 uppercase">
                  {slides[current].category}
                </span>
              </motion.div>

              {/* Headline (Serif & Dark) */}
              <motion.h1 
                custom={1} 
                variants={textVariants} 
                className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium text-gray-900 leading-[1.1]"
              >
                {slides[current].title}
              </motion.h1>

              {/* Description (Grey & Sans-serif) */}
              <motion.p 
                custom={2} 
                variants={textVariants} 
                className="max-w-md text-sm md:text-lg text-gray-600 font-light leading-relaxed"
              >
                {slides[current].description}
              </motion.p>

              {/* CTA Button (Solid Dark with Hover) */}
              <motion.div custom={3} variants={textVariants} className="pt-4">
                <button 
                  onClick={() => navigate(slides[current].path)} // 👈 4. CLICK HANDLER ADDED
                  className="group flex items-center gap-3 bg-gray-900 text-white px-8 py-4 text-xs md:text-sm uppercase tracking-widest hover:bg-amber-600 transition-all duration-300 rounded-sm shadow-lg shadow-gray-200"
                >
                  {slides[current].cta}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 3. NAVIGATION CONTROLS (Bottom Right) */}
      <div className="absolute bottom-24 right-6 md:right-20 flex items-center gap-6 z-20">
        
        {/* Pagination Number */}
        <div className="flex items-baseline gap-1 text-gray-900 font-serif">
            <span className="text-3xl">0{current + 1}</span>
            <span className="text-sm text-gray-400">/ 0{slides.length}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={handlePrev}
            className="h-12 w-12 border border-gray-300 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 text-gray-600 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={handleNext}
            className="h-12 w-12 border border-gray-300 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 text-gray-600 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 4. PROGRESS BAR (Subtle at bottom) */}
      <div className="absolute bottom-20 left-6 md:left-24 w-24 md:w-48 h-[2px] bg-gray-200 z-20">
        <motion.div 
            key={current}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 6, ease: "linear" }}
            className="h-full bg-amber-600"
        />
      </div>

      {/* 5. BOTTOM TRUST STRIP (Consistent with Header Theme) */}
      <div className="absolute bottom-0 left-0 w-full z-20 border-t border-gray-200 bg-white/80 backdrop-blur-md py-4 md:py-5">
        <div className="container mx-auto px-6">
          <div className="flex justify-between md:justify-center items-center gap-4 md:gap-16 text-[10px] md:text-xs uppercase tracking-[0.15em] text-gray-600 font-bold">
            
            <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600 hidden md:block" />
                <span>Authorized Partners</span>
            </div>
            
            <span className="text-gray-300 hidden md:block">|</span>
            
            <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-600 hidden md:block" />
                <span>Expert Guidance</span>
            </div>
            
            <span className="text-gray-300 hidden md:block">|</span>

            <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 hidden md:block" />
                <span>Genuine Warranty</span>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}