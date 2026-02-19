import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, User } from "lucide-react";
import { motion } from "framer-motion";

export function ArticleDetail() {
  const { id } = useParams(); // URL se ID lene ke liye
  const navigate = useNavigate();

  // Scroll to top when page opens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="pt-24 min-h-screen bg-white text-gray-900 font-sans">
      
      {/* 1. PROGRESS BAR (Reading Indicator) */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-amber-600 z-50" 
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ once: false }}
        transition={{ duration: 1 }}
      />

      {/* 2. HEADER SECTION */}
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        
        {/* Back Navigation */}
        <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-8 transition-colors"
        >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Library
        </button>

        {/* Categories & Meta */}
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-amber-600 mb-4">
            <span>Cooking</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>Buying Guide</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-serif font-medium leading-tight mb-6 text-gray-900">
            The Ultimate Hob Buying Guide: Brass vs. Aluminum Burners
        </h1>

        {/* Author & Meta */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-y border-gray-100 py-6 mb-10 gap-4">
            <div className="flex items-center gap-4">
                <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="Author" 
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
                <div>
                    <p className="text-sm font-bold text-black">Rajesh Kumar</p>
                    <p className="text-xs text-gray-500">Senior Kitchen Expert • 10 min read</p>
                </div>
            </div>
            
            <div className="flex gap-4">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Share2 className="w-5 h-5 text-gray-600"/></button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Bookmark className="w-5 h-5 text-gray-600"/></button>
            </div>
        </div>
      </div>

      {/* 3. FEATURED IMAGE */}
      <div className="w-full h-[50vh] md:h-[60vh] overflow-hidden mb-16">
        <img 
            src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2000&auto=format&fit=crop" 
            alt="Cover" 
            className="w-full h-full object-cover"
        />
      </div>

      {/* 4. ARTICLE CONTENT (Typography Focus) */}
      <div className="container mx-auto px-6 max-w-3xl mb-24">
        <article className="prose prose-lg prose-headings:font-serif prose-headings:font-normal prose-a:text-amber-600 hover:prose-a:text-amber-700 max-w-none text-gray-600 leading-relaxed">
            
            <p className="text-xl md:text-2xl text-black font-serif italic mb-10 leading-relaxed">
                "The heart of an Indian kitchen isn't just the food, it's the flame. Choosing the right hob determines the texture of your rotis and the taste of your tadka."
            </p>

            <p>
                When planning a modular kitchen, the hob is often an afterthought. We obsess over cabinet finishes and countertop colors, but the appliance you use 3 times a day gets ignored. Today, we break down the biggest debate: <strong>Brass Burners vs. Aluminum Alloy.</strong>
            </p>

            <h3>Why Brass Burners are Mandatory for Indian Cooking</h3>
            <p>
                Indian cooking involves high heat, heavy utensils (like cast iron kadais), and long cooking durations. Brass burners have a melting point of over 900°C, whereas aluminum alloy burners can deform over time under such intense heat.
            </p>

            <figure className="my-10 bg-gray-50 p-8 border-l-4 border-amber-500 rounded-r-lg">
                <blockquote className="text-lg font-medium text-gray-900 italic mb-2">
                    "Always look for a hob with multi-flame control. You need a simmer for dum-biryani and a high flame for stir-frying."
                </blockquote>
                <figcaption className="text-sm font-bold text-amber-600 uppercase tracking-widest">— Pro Tip</figcaption>
            </figure>

            <h3>The Size Factor: 60cm vs 75cm vs 90cm</h3>
            <p>
                Do not buy a 60cm hob if you regularly use a pressure cooker and a kadai simultaneously. They simply won't fit. For a standard Indian family of 4, a <strong>75cm 3-burner hob</strong> is the sweet spot. It fits into standard cabinet cutouts but offers 20% more cooking space.
            </p>

            <ul>
                <li><strong>3-Burner Hobs:</strong> Best for busy mornings.</li>
                <li><strong>4-Burner Hobs:</strong> Often crowded; practical only if the hob width is 90cm+.</li>
                <li><strong>Timer Hobs:</strong> A new trend that automatically turns off gas after a set time.</li>
            </ul>

            <p>
                Before you make a purchase, consider your chimney size too. Your chimney should always be slightly wider than your hob to capture smoke effectively.
            </p>
        </article>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
            {["Kitchen Design", "Hobs", "Safety", "Gas Stoves"].map(tag => (
                <span key={tag} className="px-4 py-2 bg-gray-50 rounded-full text-xs font-bold text-gray-500 uppercase tracking-wider hover:bg-gray-100 cursor-pointer">
                    {tag}
                </span>
            ))}
        </div>
      </div>

      {/* 5. AUTHOR BIO BOX */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-3xl text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-white shadow-md">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Author" className="w-full h-full object-cover"/>
            </div>
            <h3 className="text-xl font-bold mb-2">About Rajesh Kumar</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-lg mx-auto">
                Rajesh is a certified kitchen planner with 12 years of experience. He specializes in ergonomic designs and smart appliance integration for Indian homes.
            </p>
            <button className="text-amber-600 text-xs font-bold uppercase tracking-widest border-b border-amber-600 pb-1 hover:text-black hover:border-black transition-all">
                View all posts by Rajesh
            </button>
        </div>
      </div>

    </div>
  );
}