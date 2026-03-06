import React, { useState, useContext } from 'react';
import { X, Mail, Lock, User, Loader2, MapPin, Check, Sparkles, ArrowRight, Navigation, XCircle, Phone, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext'; // 🔥 AuthContext Import kiya

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
  // 🔥 FIX 1: Extract 'login' function from context for auto-login
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '',
    address: '', lat: '', lng: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported by your browser.");

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ ...prev, lat: latitude, lng: longitude }));

        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (res.data?.display_name) {
            const cleanAddress = `${res.data.address.road || ''}, ${res.data.address.suburb || ''}, ${res.data.address.city || res.data.address.town || ''}, ${res.data.address.postcode || ''}`.replace(/^,\s*/, '').replace(/,\s*,/g, ',');
            setFormData(prev => ({ ...prev, address: cleanAddress }));
          }
        } catch (error) {
          console.error("Address fetch failed", error);
        }
        setLocationLoading(false);
      },
      () => {
        alert("Unable to retrieve location. Please check your browser permissions.");
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 🔥 FIX 2: Removed FormData (Image logic). Sending clean JSON directly.
      await axios.post(`${BACKEND_URL}/api/user/register`, formData);
      
      // 🔥 FIX 3: THE MAGIC - Auto Login! 
      // Jaise hi account bana, background me login API ko hit kar diya
      const loginRes = await axios.post(`${BACKEND_URL}/api/user/login`, {
         email: formData.email,
         password: formData.password
      });

      // Context ko update kiya taaki pura app logged-in state me aa jaye
      login(loginRes.data.token, loginRes.data.user);
      
      setLoading(false);
      onClose(); // 🔥 Modal direct band! User is ready to shop.

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || err.response?.data || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] md:max-h-[85vh]"
      >
        
        {/* Left Side: Branding */}
        <div className="hidden md:block md:w-5/12 bg-[#0a0a0a] relative">
            <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" 
                alt="Luxury Home" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-[5s] hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-12 left-10 right-10">
                <div className="flex items-center gap-2 mb-3 text-amber-500">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Premium Membership</span>
                </div>
                <h3 className="text-white text-4xl font-serif leading-tight">Start your journey with <span className="italic text-amber-500">Wow_Shop.</span></h3>
            </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="w-full md:w-7/12 p-8 md:p-12 overflow-y-auto relative bg-white custom-scrollbar flex flex-col justify-center">
          <button onClick={onClose} className="absolute top-6 right-6 p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all z-10">
            <X className="w-5 h-5" />
          </button>

          <div className="mb-8 text-left">
            <h2 className="text-3xl font-serif text-gray-900 mb-2 tracking-tight">Create Account</h2>
            <p className="text-sm text-gray-500 font-light">Join our elite community of kitchen connoisseurs.</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 flex items-start gap-3">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" /> <span className="leading-relaxed">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
                  <input type="text" name="name" required value={formData.name} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#F9FAFB] border border-transparent rounded-xl text-sm focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none" placeholder="John Doe" />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#F9FAFB] border border-transparent rounded-xl text-sm focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none" placeholder="+91 00000 00000" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               {/* Email */}
               <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
                  <input type="email" name="email" required value={formData.email} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#F9FAFB] border border-transparent rounded-xl text-sm focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none" placeholder="name@example.com" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
                  <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange}
                    className="w-full pl-11 pr-11 py-3.5 bg-[#F9FAFB] border border-transparent rounded-xl text-sm focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-900 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Primary Address</label>
                <button type="button" onClick={detectLocation} disabled={locationLoading} className="text-[9px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1.5 hover:text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md transition-colors">
                  {locationLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />} Auto Detect
                </button>
              </div>
              <div className="relative group">
                <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
                <textarea name="address" required value={formData.address} onChange={handleChange} rows="2"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#F9FAFB] border border-transparent rounded-xl text-sm focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none resize-none" placeholder="City, State, Pincode" />
              </div>
              {formData.lat && <p className="text-[9px] text-green-600 flex items-center gap-1 font-bold uppercase tracking-widest ml-1 mt-1.5"><Check className="w-3 h-3" /> GPS Coordinates Secured</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full bg-gray-900 text-white font-bold py-4.5 rounded-xl hover:bg-amber-600 transition-all shadow-lg flex justify-center items-center gap-3 mt-4 disabled:opacity-50 uppercase text-[11px] tracking-[0.2em] h-14"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Establish Account <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-xs text-gray-500 font-light">
              Already a member?{' '}
              <button onClick={onSwitchToLogin} className="font-bold text-gray-900 hover:text-amber-600 transition-colors ml-1">
                 Log In Here
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}