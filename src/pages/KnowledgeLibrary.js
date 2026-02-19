import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, Play } from "lucide-react";
import { PageHero } from "../components/PageHero"; 

// --- DATA ---
const libraryData = {
  guides: [
    { id: 1, category: "Cooking", title: "The Ultimate Hob Buying Guide 2026", readTime: "8 Min", image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2000&auto=format&fit=crop" },
    { id: 2, category: "Ventilation", title: "Chimney Suction: How much do you really need?", readTime: "5 Min", image: "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=2000&auto=format&fit=crop" },
    { id: 3, category: "Cleaning", title: "Built-in vs Freestanding Dishwashers", readTime: "6 Min", image: "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?q=80&w=2000&auto=format&fit=crop" },
  ],
  care: [
    { id: 4, category: "Maintenance", title: "Descaling Your Coffee Machine: A Ritual", readTime: "4 Min", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2000&auto=format&fit=crop" },
    { id: 5, category: "Long Life", title: "5 Tips to extend your Washing Machine life", readTime: "3 Min", image: "https://images.unsplash.com/photo-1626806775351-538068b59a81?q=80&w=2000&auto=format&fit=crop" },
  ],
  planning: [
    { id: 6, category: "Design", title: "The Golden Triangle Rule in Kitchen Design", readTime: "10 Min", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2000&auto=format&fit=crop" },
  ],
  warranty: [
    { id: 7, category: "Policy", title: "Understanding Your 2-Year Comprehensive Warranty", readTime: "3 Min", image: "https://images.unsplash.com/photo-1631541909061-71e349d1f241?q=80&w=2000&auto=format&fit=crop" },
  ]
};

const tabs = [
  { id: "guides", label: "Buying Guides" },
  { id: "care", label: "Appliance Care" },
  { id: "planning", label: "Kitchen Planning" },
  { id: "warranty", label: "Warranty Info" },
];

// --- SUB-COMPONENT: ARTICLE CARD ---
const ArticleCard = ({ item }) => (
  <motion.div 
    layout
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
    className="group cursor-pointer flex flex-col gap-4"
  >
    <div className="overflow-hidden aspect-[4/3] relative bg-gray-100 rounded-sm">
      <img 
        src={item.image} 
        alt={item.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0 grayscale-[15%]" 
      />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
        {item.category}
      </div>
    </div>
    <div>
      <div className="flex items-center gap-3 text-xs text-gray-400 mb-2 uppercase tracking-wider font-medium">
         <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {item.readTime} Read</span>
      </div>
      <h3 className="text-xl font-serif font-medium leading-snug group-hover:text-amber-700 transition-colors">
        {item.title}
      </h3>
      <div className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
        Read Article <ArrowRight className="w-3 h-3 text-amber-600"/>
      </div>
    </div>
  </motion.div>
);

// --- SUB-COMPONENT: VIDEO SECTION ---
const VideoSection = () => (
    <div className="bg-gray-900 text-white py-24 relative overflow-hidden my-20">
        <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
                <span className="text-amber-500 font-bold tracking-widest text-xs uppercase mb-4 block">Expert Masterclass</span>
                <h2 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">Why Smart Ovens are the future.</h2>
                <p className="text-gray-400 mb-8 max-w-md text-lg font-light leading-relaxed">
                    Join our Senior Expert, Rajesh, as he breaks down the myths about convection cooking, power consumption, and AI features.
                </p>
                <button className="group flex items-center gap-3 border-b border-white pb-1 hover:text-amber-500 hover:border-amber-500 transition-all text-sm uppercase tracking-widest">
                    Watch Episode <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                </button>
            </div>
            <div className="flex-1 w-full relative group cursor-pointer">
                {/* Decorative border */}
                <div className="absolute -inset-2 border border-gray-700 rounded-sm translate-x-2 translate-y-2"></div>
                <div className="relative aspect-video bg-gray-800 rounded-sm overflow-hidden shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1556909212-d5b604dba0c6?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500" alt="Video Thumb"/>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-8 h-8 text-white fill-current ml-1" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- SUB-COMPONENT: NEWSLETTER ---
const Newsletter = () => (
    <div className="container mx-auto px-6 md:px-12 py-20 border-t border-gray-100 text-center">
        <h3 className="text-3xl md:text-4xl font-serif mb-4">Join the Inner Circle</h3>
        <p className="text-gray-500 mb-10 font-light">Get weekly appliance care tips, warranty alerts, and exclusive design guides.</p>
        <div className="flex max-w-md mx-auto border-b border-black pb-2 focus-within:border-amber-600 transition-colors">
            <input type="email" placeholder="Your email address" className="flex-1 outline-none text-black placeholder:text-gray-400 bg-transparent text-lg" />
            <button className="text-xs font-bold uppercase tracking-widest hover:text-amber-600 px-4">Subscribe</button>
        </div>
    </div>
);

// --- MAIN PAGE ---
export function KnowledgeLibrary() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get("tab") || "guides";
  
  const currentData = libraryData[activeTab] || [];

  return (
    <div className="pt-0 min-h-screen bg-white">
      
      {/* 1. HERO */}
      <PageHero 
        title="The Edit." 
        subtitle="A curated collection of expert wisdom to help you buy better, cook smarter, and live beautifully."
        label="Knowledge Library"
        image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
      />

      {/* 2. STICKY TABS */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-100 py-5">
        <div className="container mx-auto px-6 flex justify-center gap-8 md:gap-16 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSearchParams({ tab: tab.id })}
                className={`text-xs md:text-sm font-bold uppercase tracking-widest transition-colors relative pb-2 ${
                  activeTab === tab.id ? "text-black" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                    <motion.div 
                        layoutId="activeTab" 
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-600" 
                    />
                )}
              </button>
            ))}
        </div>
      </div>

      {/* 3. GRID CONTENT */}
      <div className="container mx-auto px-6 md:px-12 py-20 min-h-[40vh]">
        <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
            >
                {currentData.length > 0 ? (
                    currentData.map((item) => (
                        <div key={item.id} onClick={() => navigate(`/expert/article/${item.id}`)}>
                            <ArticleCard item={item} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20">
                        <p className="text-gray-300 font-serif text-2xl italic">Curating fresh content for {activeTab}...</p>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
      </div>

      {/* 4. FEATURE SECTIONS */}
      <VideoSection />
      <Newsletter />

    </div>
  );
}