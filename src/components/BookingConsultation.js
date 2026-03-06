// src/components/BookingConsultation.jsx
import { X, MapPin, DollarSign, CheckCircle, ArrowRight, User, Star, Briefcase, Layers, Loader2, LocateFixed } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; 
import { motion, AnimatePresence } from "framer-motion";
import KitchenPremium from "../assests/Kitchen_Design.jpg"; // Ensure this path is correct

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export function BookingConsultation({ isOpen, onClose }) {
  const { token, user } = useContext(AuthContext); 

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", location: "",
    projectType: "", budget: "", brands: [], message: ""
  });
  
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Pre-fill user data when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      setFormData(prev => ({
          ...prev,
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          location: user?.address || "" 
      }));

      // Auto-detect only if address is empty
      if (!user?.address) {
          fetchLocation();
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, user]);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = response.data;
            
            const city = data.address.city || data.address.town || data.address.state_district || "";
            const state = data.address.state || "";
            const exactLocation = `${city}${city && state ? ", " : ""}${state}`.trim();
            
            setFormData(prev => ({ ...prev, location: exactLocation }));
          } catch (error) { 
            console.log("Location error:", error); 
          } finally { 
            setLoadingLocation(false); 
          }
        },
        () => setLoadingLocation(false),
        { timeout: 10000 }
      );
    }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setFormData(prev => ({
      ...prev,
      brands: prev.brands.includes(brand) ? prev.brands.filter(b => b !== brand) : [...prev.brands, brand]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
        alert("Please login from the top menu to book a consultation!");
        return;
    }

    setIsSubmitting(true);
    try {
      const formattedPayload = {
          customerDetails: {
              name: formData.name,
              phone: formData.phone,
              email: formData.email,
              address: { line: formData.location || "Location not provided" }
          },
          appointment: {
              message: `Project Type: ${formData.projectType} | Budget: ${formData.budget} | Brands: ${formData.brands.join(', ')}`
          },
          interestedProducts: [],
          totalEstimatedValue: 0
      };

      await axios.post(`${BACKEND_URL}/api/consultation/create`, formattedPayload, {
          headers: { 'auth-token': token }
      });
      
      setIsSuccess(true);
      setTimeout(() => { 
          setIsSuccess(false); 
          onClose(); 
          setFormData({ name: user?.name || "", email: user?.email || "", phone: "", location: user?.address || "", projectType: "", budget: "", brands: [], message: "" });
      }, 3000);
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to book. Please try again.");
    } finally { setIsSubmitting(false); }
  };

  if (!isOpen) return null;

  const inputGroupClass = "space-y-1.5";
  const labelClass = "text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5";
  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all duration-300";
  const selectClass = "appearance-none cursor-pointer";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] md:max-h-[85vh]">
        
        <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-black/40 hover:bg-white/10 text-white/60 hover:text-white p-2.5 rounded-full transition-all backdrop-blur-md border border-white/5">
          <X className="h-5 w-5" />
        </button>

        {/* LEFT IMAGE BANNER */}
        <div className="hidden md:block md:w-5/12 relative h-full min-h-[400px]">
          <img src={KitchenPremium} alt="Luxury Interior" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-10 z-10">
            <div className="w-12 h-1 bg-amber-500 mb-6 rounded-full" />
            <h2 className="text-4xl lg:text-5xl font-serif text-white mb-4 leading-tight tracking-tight">Design your <br/> <span className="text-amber-500 italic">Dream Space.</span></h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs font-light">Book a free consultation with our award-winning designers and get a personalized 3D plan for your home.</p>
          </div>
        </div>

        {/* RIGHT FORM AREA */}
        <div className="w-full md:w-7/12 bg-[#0a0a0a] flex flex-col h-full overflow-y-auto custom-scrollbar">
          <div className="md:hidden h-40 relative shrink-0">
             <img src={KitchenPremium} className="w-full h-full object-cover opacity-50" alt="header"/>
             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"/>
             <div className="absolute bottom-4 left-6"><h2 className="text-3xl font-serif text-white tracking-tight">Book Consultation</h2></div>
          </div>

          <div className="p-6 sm:p-8 lg:p-12 flex-1">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                  <h3 className="text-4xl font-serif text-white mb-3">Request Received</h3>
                  <p className="text-white/50 max-w-sm mb-8 font-light">Thank you, <span className="text-white font-medium">{formData.name.split(' ')[0]}</span>. Our elite design team will contact you within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                  onSubmit={handleSubmit} 
                  className="space-y-8"
                >
                  <div className="space-y-5">
                    <h4 className="text-white font-serif text-xl flex items-center gap-3 border-b border-white/5 pb-3">
                      <User className="w-5 h-5 text-amber-500"/> Personal Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className={inputGroupClass}>
                        <label className={labelClass}>Full Name</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className={inputClass} placeholder="John Doe" />
                      </div>
                      <div className={inputGroupClass}>
                        <label className={labelClass}>Phone Number</label>
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className={inputClass} placeholder="+91 00000 00000" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className={inputGroupClass}>
                        <label className={labelClass}>Email Address</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className={inputClass} placeholder="you@example.com" />
                      </div>
                      <div className={inputGroupClass}>
                        <label className={labelClass}>
                          Location 
                          {loadingLocation && <Loader2 className="w-3 h-3 animate-spin text-amber-500 ml-auto"/>}
                        </label>
                        <div className="relative group">
                          <MapPin className="w-4 h-4 text-white/30 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-amber-500 transition-colors"/>
                          <input type="text" name="location" required value={formData.location} onChange={handleInputChange} className={`${inputClass} pl-12 pr-12`} placeholder="City, State" />
                          <button type="button" onClick={fetchLocation} title="Detect Location" className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500/50 hover:text-amber-500 transition-colors">
                              <LocateFixed className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <h4 className="text-white font-serif text-xl flex items-center gap-3 border-b border-white/5 pb-3">
                      <Briefcase className="w-5 h-5 text-amber-500"/> Project Scope
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className={inputGroupClass}>
                        <label className={labelClass}>Project Type</label>
                        <div className="relative">
                          <select name="projectType" value={formData.projectType} onChange={handleInputChange} required className={`${inputClass} ${selectClass}`}>
                            <option value="" className="text-gray-500 bg-[#0a0a0a]">Select Type</option>
                            <option value="New Home" className="bg-[#0a0a0a]">New Construction</option>
                            <option value="Renovation" className="bg-[#0a0a0a]">Kitchen Renovation</option>
                            <option value="Interior" className="bg-[#0a0a0a]">Full Home Interior</option>
                          </select>
                          <Layers className="w-4 h-4 text-white/30 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"/>
                        </div>
                      </div>
                      <div className={inputGroupClass}>
                        <label className={labelClass}>Budget Range</label>
                        <div className="relative">
                          <select name="budget" value={formData.budget} onChange={handleInputChange} required className={`${inputClass} ${selectClass}`}>
                            <option value="" className="text-gray-500 bg-[#0a0a0a]">Select Budget</option>
                            <option value="2-5L" className="bg-[#0a0a0a]">₹2 - 5 Lakhs</option>
                            <option value="5-10L" className="bg-[#0a0a0a]">₹5 - 10 Lakhs</option>
                            <option value="10L+" className="bg-[#0a0a0a]">₹10 Lakhs+</option>
                          </select>
                          <DollarSign className="w-4 h-4 text-white/30 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className={labelClass}><Star className="w-3 h-3 text-amber-500"/> Preferred Brands (Optional)</label>
                    <div className="flex flex-wrap gap-2.5">
                      {["Bosch", "Siemens", "Hafele", "Elica", "Faber", "Whirlpool"].map((brand) => {
                        const isSelected = formData.brands.includes(brand);
                        return (
                          <label 
                            key={brand} 
                            className={`cursor-pointer px-5 py-2.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                              isSelected 
                                ? "bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] transform scale-105" 
                                : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            <input type="checkbox" value={brand} checked={isSelected} onChange={handleBrandChange} className="hidden"/>
                            {brand}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="group w-full bg-amber-600 text-black py-4 rounded-xl text-[11px] font-extrabold uppercase tracking-widest hover:bg-amber-500 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Reserving Spot...</>
                      ) : (
                        <>Confirm Booking <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform"/></>
                      )}
                    </button>
                    <p className="text-center text-white/40 text-[10px] mt-5 font-bold uppercase tracking-widest">256-bit SSL encrypted & secure</p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}