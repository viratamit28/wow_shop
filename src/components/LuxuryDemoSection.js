import React, { useState, useEffect, useContext } from "react";
import { Check, ChevronLeft, Loader2, User, Phone, Mail, Lock } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // 🔥 AuthContext Import kiya

// --- CONFIGURATION ---
const LUXURY_BG_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80";
const DATES_TO_GENERATE = 7;
const TIME_SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function LuxuryDemoSection() {
  const { user, token } = useContext(AuthContext); // 🔥 Context se user aur token nikaala

  const [step, setStep] = useState(0); 
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  // 🔥 THE MAGIC: Agar user logged in hai, toh form auto-fill kar do
  useEffect(() => {
    if (user && token) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || ""
      });
    }
  }, [user, token]);

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- REAL BACKEND INTEGRATION (Auth Required) ---
  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    // Security Check
    if (!token) {
        alert("Please login to finalize your booking.");
        return;
    }

    setLoading(true);

    // Hum apna purana wala Authenticated route hit karenge jo MongoDB + CRM dono sambhalta hai
    const payload = {
        customerDetails: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: { line: "Homepage Quick Lead", city: "Not specified", pincode: "000000" }
        },
        appointment: { 
            date: selectedDate.fullDate, 
            timeSlot: selectedTime, 
            message: "Direct Studio Demo Request from Homepage" 
        },
        interestedProducts: [],
        totalEstimatedValue: 0
    };

    try {
      await axios.post(`${BACKEND_URL}/api/consultation/create`, payload, {
          headers: { 'auth-token': token } // 🔥 Token bhej rahe hain
      });
      setLoading(false);
      setStep(4); 
    } catch (error) {
      console.error("Booking Error:", error);
      setLoading(false);
      alert("Something went wrong with the booking. Please try again.");
    }
  };

  const spotlightVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
  };

  return (
    <section className="relative w-full min-h-[90vh] bg-black text-white font-sans overflow-hidden flex items-center justify-center py-24 border-t border-gray-900">
      
      <div className="absolute inset-0 z-0">
        <img src={LUXURY_BG_IMAGE} alt="Background" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)]" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[500px] bg-gradient-to-b from-amber-500/10 via-transparent to-transparent blur-[80px] pointer-events-none z-0" />
      
      <div className="relative z-10 w-full max-w-5xl px-6">
        <AnimatePresence mode="wait">
          
          {/* STEP 0: INTRO */}
          {step === 0 && (
            <motion.div key="step0" variants={spotlightVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center text-center">
              <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-amber-500 to-transparent mb-8" />
              <div className="border border-amber-600/50 px-6 py-2 mb-8 bg-black/50 backdrop-blur-md">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-amber-500 font-bold">Exclusive Access</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-none tracking-tight">
                Design <span className="text-amber-500 italic">Sanctuary</span>
              </h1>
              <p className="text-neutral-400 text-sm md:text-lg font-light max-w-lg mx-auto leading-relaxed mb-12">
                A private consultation to craft your culinary legacy. Reserve your moment with our architects.
              </p>
              <button onClick={() => setStep(1)} className="group relative px-12 py-4 bg-transparent border border-white/20 hover:border-amber-500 transition-colors duration-500">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] group-hover:text-amber-500 transition-colors relative z-10">Enter Studio</span>
                <div className="absolute inset-0 bg-amber-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </motion.div>
          )}

          {/* STEP 1: DATE */}
          {step === 1 && (
            <motion.div key="step1" variants={spotlightVariants} initial="hidden" animate="visible" exit="exit" className="w-full max-w-4xl mx-auto">
              <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
                <div>
                    <p className="text-amber-500 text-[10px] uppercase tracking-[0.3em] mb-2 font-bold">Step 01</p>
                    <h2 className="text-3xl md:text-4xl font-serif text-white">Choose a Date</h2>
                </div>
                <button onClick={() => setStep(0)} className="text-white/40 hover:text-white flex items-center gap-2 text-[10px] uppercase tracking-widest"><ChevronLeft className="w-4 h-4"/> Back</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px bg-white/10 border border-white/10"> 
                {dates.map((item, i) => (
                  <button key={i} onClick={() => { setSelectedDate(item); setStep(2); }} className="group relative h-40 bg-black hover:bg-[#0a0a0a] transition-colors flex flex-col items-center justify-center gap-3 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 group-hover:text-amber-500 relative z-10">{item.month}</span>
                    <span className="text-4xl font-serif text-white group-hover:scale-110 transition-transform duration-500 relative z-10">{item.dayNumber}</span>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 relative z-10">{item.dayName.substring(0,3)}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: TIME */}
          {step === 2 && (
            <motion.div key="step2" variants={spotlightVariants} initial="hidden" animate="visible" exit="exit" className="w-full max-w-2xl mx-auto">
              <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
                <div>
                    <p className="text-amber-500 text-[10px] uppercase tracking-[0.3em] mb-2 font-bold">Step 02</p>
                    <h2 className="text-3xl md:text-4xl font-serif text-white">Select Time</h2>
                </div>
                <button onClick={() => setStep(1)} className="text-white/40 hover:text-white flex items-center gap-2 text-[10px] uppercase tracking-widest"><ChevronLeft className="w-4 h-4"/> Back</button>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {TIME_SLOTS.map((time, i) => (
                  <button key={i} onClick={() => { setSelectedTime(time); setStep(3); }} className="relative py-6 md:py-8 border border-white/10 bg-black/50 hover:border-amber-500 text-xl md:text-2xl font-serif tracking-widest group transition-all duration-300">
                    <span className="relative z-10 group-hover:text-amber-500 transition-colors">{time}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: CONTACT INFO (Conditional Rendering based on Auth) */}
          {step === 3 && (
            <motion.div key="step3" variants={spotlightVariants} initial="hidden" animate="visible" exit="exit" className="w-full max-w-md mx-auto relative z-20">
              <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
                <div>
                    <p className="text-amber-500 text-[10px] uppercase tracking-[0.3em] mb-2 font-bold">Step 03</p>
                    <h2 className="text-3xl font-serif text-white">Finalize Details</h2>
                </div>
                <button onClick={() => setStep(2)} disabled={loading} className="text-white/40 hover:text-white flex items-center gap-2 text-[10px] uppercase tracking-widest disabled:opacity-50"><ChevronLeft className="w-4 h-4"/> Back</button>
              </div>

              {/* 🔥 Check if User is Logged In */}
              {!token ? (
                // ❌ NOT LOGGED IN UI
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 border border-white/10 backdrop-blur-md p-8 text-center rounded-xl">
                   <Lock className="w-10 h-10 text-amber-500 mx-auto mb-4" />
                   <h3 className="text-xl font-serif text-white mb-2">Authentication Required</h3>
                   <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                     To provide you with a personalized white-glove experience, please sign in to your Wow_Shop account.
                   </p>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                     Please use the Login button in the Top Menu ↑
                   </p>
                </motion.div>
              ) : (
                // ✅ LOGGED IN UI (Form with Auto-fill)
                <form onSubmit={handleFinalSubmit} className="space-y-4">
                  <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type="text" name="name" required placeholder="Full Name" value={formData.name} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm pl-12 pr-4 py-4 outline-none focus:border-amber-500/50 transition-colors" disabled={loading} />
                  </div>
                  <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type="tel" name="phone" required placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm pl-12 pr-4 py-4 outline-none focus:border-amber-500/50 transition-colors" disabled={loading} />
                  </div>
                  <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type="email" name="email" required placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm pl-12 pr-4 py-4 outline-none focus:border-amber-500/50 transition-colors" disabled={loading} />
                  </div>

                  <button type="submit" disabled={loading} className="w-full mt-6 py-4 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-3 disabled:opacity-70">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Finalizing...</> : "Confirm Appointment"}
                  </button>
                </form>
              )}

            </motion.div>
          )}

          {/* STEP 4: CONFIRMED */}
          {step === 4 && (
            <motion.div key="step4" variants={spotlightVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center text-center relative py-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/10 blur-[80px] rounded-full -z-10" />
              <div className="w-16 h-16 border border-amber-500 flex items-center justify-center mb-8 rotate-45">
                 <div className="w-12 h-12 bg-amber-500 flex items-center justify-center -rotate-45">
                    <Check className="w-6 h-6 text-black" strokeWidth={3} />
                 </div>
              </div>
              <h2 className="text-5xl font-serif text-white mb-4 tracking-tight">Confirmed</h2>
              <p className="text-gray-400 font-light mb-8 max-w-sm">Thank you, {formData.name.split(' ')[0]}. Your consultation request has been added to your profile.</p>
              
              <div className="flex flex-col items-center gap-3 mb-10">
                <p className="text-neutral-500 text-[10px] uppercase tracking-[0.3em] font-bold">Your Appointment</p>
                <div className="text-xl text-white font-light border-y border-white/10 py-4 px-10 bg-white/5 backdrop-blur-sm">
                  {selectedDate?.dayNumber} {selectedDate?.month} <span className="mx-4 text-amber-500 font-bold">/</span> {selectedTime}
                </div>
              </div>
              <button onClick={() => { setStep(0); }} className="text-white/50 hover:text-white text-[10px] uppercase tracking-[0.3em] transition-colors hover:underline decoration-amber-500 underline-offset-8 font-bold">
                Book Another
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  );
}