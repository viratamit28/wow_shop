import React, { useState, useContext } from 'react';
import { X, Mail, Lock, Loader2, Sparkles, ArrowRight, XCircle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

// 🔥 FIX 1: Production URL Setup
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export function LoginModal({ isOpen, onClose, onSwitchToSignup }) {
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 🔥 FIX 2: Password Visibility State
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // User jab type karna shuru kare, error hata do
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 🔥 FIX 3: Dynamic Backend URL
      const res = await axios.post(`${BACKEND_URL}/api/user/login`, formData);
      
      // AuthContext me token aur user pass karna (Tera purana logic ekdum sahi tha)
      login(res.data.token, res.data.user);
      
      setLoading(false);
      onClose(); // Modal band karo
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || err.response?.data || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      
      {/* Background Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col md:flex-row"
      >
        
        {/* Left Side: Visual Branding (Hidden on Mobile) */}
        <div className="hidden md:block md:w-5/12 bg-[#0a0a0a] relative overflow-hidden">
            <img 
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop" 
                alt="Luxury Kitchen" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-[5s] hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-12 left-10 right-10">
                <div className="flex items-center gap-2 mb-3 text-amber-500">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Exclusive Access</span>
                </div>
                <h3 className="text-white text-3xl font-serif leading-tight">Elevate your <br/> culinary space.</h3>
            </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-8 md:p-14 relative bg-white flex flex-col justify-center">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-10">
            <h2 className="text-3xl font-serif text-gray-900 mb-3 tracking-tight">Welcome Back</h2>
            <p className="text-sm text-gray-500 font-light">Sign in to manage your premium portfolio and consultations.</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                // 🔥 Shake animation for error
                transition={{ type: "spring", stiffness: 500, damping: 10 }}
                className="mb-6 p-4 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 flex items-start gap-3"
              >
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" /> 
                <span className="leading-relaxed">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-[#F9FAFB] border border-transparent rounded-2xl text-sm focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none text-gray-900 placeholder:text-gray-400"
                  placeholder="Enter your registered email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Password</label>
                <button type="button" className="text-[10px] font-bold text-gray-400 hover:text-amber-600 transition-colors border-b border-transparent hover:border-amber-600 pb-0.5">Forgot Password?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 bg-[#F9FAFB] border border-transparent rounded-2xl text-sm focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none text-gray-900 placeholder:text-gray-400"
                  placeholder="••••••••"
                />
                {/* 🔥 Password Toggle Button */}
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !formData.email || !formData.password}
              className="w-full bg-gray-900 text-white font-bold py-4.5 rounded-2xl hover:bg-amber-600 transition-all duration-300 shadow-lg shadow-gray-900/20 flex justify-center items-center gap-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed uppercase text-[11px] tracking-[0.2em] h-14"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>Secure Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          {/* Footer Switch */}
          <div className="mt-10 text-center border-t border-gray-100 pt-8">
            <p className="text-xs text-gray-500">
              New to Wow_Shop?{' '}
              <button
                onClick={onSwitchToSignup}
                className="font-bold text-gray-900 hover:text-amber-600 transition-colors ml-1"
              >
                Create an Account
              </button>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}