import React, { createContext, useContext, useState } from 'react';

// 1. Create Context
const LeadModalContext = createContext();

// 2. Create Provider (Wrapper)
export const LeadModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContext, setModalContext] = useState(null); // E.g., { product: "Bosch Oven", source: "Header" }

  const openModal = (contextData = {}) => {
    setModalContext(contextData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContext(null);
  };

  return (
    <LeadModalContext.Provider value={{ isModalOpen, modalContext, openModal, closeModal }}>
      {children}
      {/* Hum Modal ko yahin render karenge taaki App.js ganda na ho */}
      {isModalOpen && <GlobalLeadModal onClose={closeModal} context={modalContext} />}
    </LeadModalContext.Provider>
  );
};

// 3. Create Hook (For easy use)
export const useLeadModal = () => useContext(LeadModalContext);

// --- INTERNAL MODAL COMPONENT (The Actual Popup) ---
// Note: Tum isko alag file me bhi rakh sakte ho, but simplicity ke liye yahan hai
import { X, CheckCircle } from 'lucide-react';

const GlobalLeadModal = ({ onClose, context }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Yahan API call aayegi (Backend me Lead save karne ke liye)
    setTimeout(() => setSubmitted(true), 1000);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-[#111] border border-[#C5A059] w-full max-w-md p-8 rounded-sm shadow-[0_0_50px_rgba(197,160,89,0.2)]">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <h3 className="text-2xl font-serif text-white mb-2">Get Expert Advice</h3>
            <p className="text-white/60 text-sm mb-6">
              {context?.product 
                ? `Inquiry for: ${context.product}` 
                : "Fill details to book a consultation."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#C5A059] outline-none transition-colors" placeholder="Enter your name" required />
              </div>
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Mobile Number</label>
                <input type="tel" className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#C5A059] outline-none transition-colors" placeholder="+91 98765..." required />
              </div>
              
              <button type="submit" className="w-full bg-[#C5A059] text-black font-bold uppercase tracking-widest py-4 mt-4 hover:bg-white transition-colors">
                Request Call Back
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-10">
            <CheckCircle className="w-16 h-16 text-[#C5A059] mx-auto mb-4" />
            <h3 className="text-xl text-white font-serif mb-2">Request Received!</h3>
            <p className="text-white/60 text-sm">Our expert will call you shortly.</p>
            <button onClick={onClose} className="mt-6 text-[#C5A059] text-xs uppercase tracking-widest underline">Close Window</button>
          </div>
        )}
      </div>
    </div>
  );
};