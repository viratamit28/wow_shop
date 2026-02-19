import { X, MapPin, DollarSign, CheckCircle, ArrowRight, User, Star, Briefcase, Layers, Phone, Mail, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import KitchenPremium from "../assests/Kitchen_Design.jpg"; // Path check kr lena

export function BookingConsultation({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", location: "",
    projectType: "", budget: "", brands: [], message: ""
  });
  
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setLoadingLocation(true);
      fetchLocation();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const data = await response.json();
            setFormData(prev => ({ ...prev, location: `${data.city || ""}, ${data.countryName || ""}`.trim() }));
          } catch (error) { console.log("Location error:", error); } 
          finally { setLoadingLocation(false); }
        },
        () => setLoadingLocation(false)
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
    setIsSubmitting(true);
    try {
      // API Call
      await axios.post('http://localhost:5000/api/consultation', formData);
      setIsSuccess(true);
      setFormData({ name: "", email: "", phone: "", location: "", projectType: "", budget: "", brands: [], message: "" });
      // Close automatically after 4 seconds
      setTimeout(() => { setIsSuccess(false); onClose(); }, 4000);
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to book. Please try again.");
    } finally { setIsSubmitting(false); }
  };

  if (!isOpen) return null;

  // --- Styles ---
  const inputGroupClass = "space-y-1.5";
  const labelClass = "text-xs font-semibold text-amber-500/90 uppercase tracking-wider flex items-center gap-1.5";
  const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all duration-300";
  const selectClass = "appearance-none cursor-pointer";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Main Modal Card */}
      <div className="relative w-full max-w-5xl bg-[#0f0f0f] rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] md:max-h-[800px]">
        
        {/* Close Button (Floating) */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 bg-black/40 hover:bg-red-500/80 text-white/60 hover:text-white p-2 rounded-full transition-all backdrop-blur-md border border-white/5"
        >
          <X className="h-5 w-5" />
        </button>

        {/* --- LEFT SIDE: Image & Value Prop (Hidden on small mobile, visible on MD+) --- */}
        <div className="hidden md:block md:w-5/12 relative h-full min-h-[400px]">
          <img 
            src={KitchenPremium} 
            alt="Luxury Interior" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 z-10">
            <div className="w-12 h-1 bg-amber-500 mb-6 rounded-full" />
            <h2 className="text-4xl font-serif text-white mb-3 leading-tight">
              Design your <br/> <span className="text-amber-500">Dream Space.</span>
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Book a free consultation with our award-winning designers and get a personalized 3D plan for your home.
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: Form --- */}
        <div className="w-full md:w-7/12 bg-[#0f0f0f] flex flex-col h-full overflow-y-auto custom-scrollbar">
          
          {/* Mobile Header Image (Visible only on mobile) */}
          <div className="md:hidden h-40 relative shrink-0">
             <img src={KitchenPremium} className="w-full h-full object-cover" alt="header"/>
             <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent"/>
             <div className="absolute bottom-4 left-6">
                <h2 className="text-2xl font-serif text-white">Book Consultation</h2>
             </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 flex-1">
            
            {isSuccess ? (
              // Success State
              <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in py-12">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-3xl font-serif text-white mb-2">Request Received!</h3>
                <p className="text-white/50 max-w-sm mb-8">
                  Thank you, <span className="text-white font-semibold">{formData.name}</span>. 
                  Our team will contact you at <span className="text-amber-500">{formData.phone}</span> within 24 hours.
                </p>
                <button onClick={onClose} className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white border border-white/10 transition-all">
                  Close Window
                </button>
              </div>
            ) : (
              // Form State
              <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="md:hidden mb-2">
                   <p className="text-white/50 text-xs uppercase tracking-widest">Let's get started</p>
                </div>

                {/* Section 1: Personal Info */}
                <div className="space-y-5">
                  <h4 className="text-white/90 font-serif text-lg flex items-center gap-2 border-b border-white/5 pb-2">
                    <User className="w-4 h-4 text-amber-500"/> Personal Details
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={inputGroupClass}>
                      <label className={labelClass}>Full Name</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className={inputClass} placeholder="Amit Kumar" />
                    </div>
                    <div className={inputGroupClass}>
                      <label className={labelClass}>Phone Number</label>
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className={inputClass} placeholder="+91 98765 43210" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={inputGroupClass}>
                      <label className={labelClass}>Email Address</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className={inputClass} placeholder="amit@example.com" />
                    </div>
                    <div className={inputGroupClass}>
                      <label className={labelClass}>
                        City / Location 
                        {loadingLocation && <Loader2 className="w-3 h-3 animate-spin text-amber-500 ml-auto"/>}
                      </label>
                      <div className="relative">
                        <input type="text" name="location" required value={formData.location} onChange={handleInputChange} className={`${inputClass} pl-10`} placeholder="Detecting..." />
                        <MapPin className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2"/>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Project Details */}
                <div className="space-y-5">
                  <h4 className="text-white/90 font-serif text-lg flex items-center gap-2 border-b border-white/5 pb-2">
                    <Briefcase className="w-4 h-4 text-amber-500"/> Project Requirement
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={inputGroupClass}>
                      <label className={labelClass}>Project Type</label>
                      <div className="relative">
                        <select name="projectType" value={formData.projectType} onChange={handleInputChange} required className={`${inputClass} ${selectClass}`}>
                          <option value="" className="text-gray-500 bg-[#1a1a1a]">Select Type</option>
                          <option value="New Home" className="bg-[#1a1a1a]">New Construction</option>
                          <option value="Renovation" className="bg-[#1a1a1a]">Kitchen Renovation</option>
                          <option value="Interior" className="bg-[#1a1a1a]">Full Home Interior</option>
                        </select>
                        <Layers className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                      </div>
                    </div>
                    <div className={inputGroupClass}>
                      <label className={labelClass}>Budget Range</label>
                      <div className="relative">
                        <select name="budget" value={formData.budget} onChange={handleInputChange} required className={`${inputClass} ${selectClass}`}>
                          <option value="" className="text-gray-500 bg-[#1a1a1a]">Select Budget</option>
                          <option value="2-5L" className="bg-[#1a1a1a]">₹2 - 5 Lakhs</option>
                          <option value="5-10L" className="bg-[#1a1a1a]">₹5 - 10 Lakhs</option>
                          <option value="10L+" className="bg-[#1a1a1a]">₹10 Lakhs+</option>
                        </select>
                        <DollarSign className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Brands (Pills) */}
                <div className="space-y-3">
                  <label className={labelClass}><Star className="w-3 h-3 text-amber-500"/> Preferred Brands (Optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {["Bosch", "Siemens", "Hafele", "Elica", "Faber", "Whirlpool"].map((brand) => {
                      const isSelected = formData.brands.includes(brand);
                      return (
                        <label 
                          key={brand} 
                          className={`cursor-pointer px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${
                            isSelected 
                              ? "bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] transform scale-105" 
                              : "bg-white/5 text-white/60 border-white/5 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          <input type="checkbox" value={brand} checked={isSelected} onChange={handleBrandChange} className="hidden"/>
                          {brand}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="group w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:from-amber-400 hover:to-amber-500 transition-all shadow-[0_4px_20px_rgba(245,158,11,0.2)] hover:shadow-[0_4px_30px_rgba(245,158,11,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        Confirm Booking <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                      </>
                    )}
                  </button>
                  <p className="text-center text-white/30 text-[10px] mt-3">
                    Secure 256-bit SSL encrypted. Your privacy is our priority.
                  </p>
                </div>

              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}