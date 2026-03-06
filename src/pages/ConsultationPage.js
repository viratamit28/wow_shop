import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { 
  ArrowLeft, Navigation, Loader2, CheckCircle, ShieldCheck, ShoppingBag
} from 'lucide-react';

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dcljdkqer/image/upload/";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const getFinalImageUrl = (product) => {
  if (!product) return "https://placehold.co/100?text=No+Img";
  let displayImg = product.image;
  if (Array.isArray(displayImg)) displayImg = displayImg.length > 0 ? displayImg[0] : "";
  return displayImg && displayImg.startsWith('http') ? displayImg : `${CLOUDINARY_BASE_URL}${displayImg}.jpg`;
};

// --- Clean, Standard Input Field (Wow_Shop Theme) ---
const CleanInput = ({ label, type = "text", name, value, onChange, placeholder, required = true, min, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">{label} {required && '*'}</label>
    <input 
      type={type} name={name} required={required} value={value} onChange={onChange} min={min} placeholder={placeholder} 
      className="w-full bg-white border border-gray-200 text-gray-900 text-sm px-4 py-3.5 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-gray-400 shadow-sm" 
    />
  </div>
);

export default function ConsultationPage() {
  const { state } = useLocation(); 
  const navigate = useNavigate();
  const { token, refreshCart, user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', 
    addressLine: '', city: '', pincode: '', stateCode: '', 
    scheduledDate: '', scheduledTime: '', message: ''
  });

  const { name, phone, email, addressLine, city, pincode, stateCode, scheduledDate, scheduledTime, message } = formData;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (user && !name) { 
      setFormData(prev => ({ ...prev, name: user.name || '', phone: user.phone || '', email: user.email || '' }));
    }
  }, [user]); 

  const detectLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation is not supported by your browser");
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const address = response.data.address;
          setFormData(prev => ({
            ...prev,
            addressLine: `${address.road || ''}, ${address.suburb || ''}, ${address.neighbourhood || ''}`.replace(/^,\s*/, ''),
            city: address.city || address.town || address.village || '',
            pincode: address.postcode || '',
            stateCode: address.state || ''
          }));
        } catch (error) { alert("Failed to get address. Please fill manually."); } 
        finally { setLocLoading(false); }
      },
      () => { setLocLoading(false); alert("Unable to retrieve location."); }
    );
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please login to submit request");
    if (!state?.cart?.length) return alert("Portfolio is empty!");

    setLoading(true);
    try {
      const productString = state.cart.map(item => `${item.product?.name || item.name} (Qty: ${item.quantity || item.qty})`).join(', ');
      
      const unifiedPayload = {
        customerDetails: { name, phone, email, address: { line: addressLine, city, pincode } },
        appointment: { date: scheduledDate, timeSlot: scheduledTime, message },
        interestedProducts: state.cart.map(i => ({ 
            id: i.product?._id || i.productId || i._id, 
            name: i.product?.name || i.title || i.name, 
            image: Array.isArray(i.product?.image || i.image) ? (i.product?.image || i.image)[0] : (i.product?.image || i.image), 
            price: i.product?.price || i.price, 
            qty: i.quantity || i.qty
        })),
        totalEstimatedValue: state?.total || 0,
        Name: name, ContactNo: phone, EMailId: email, Address: addressLine, City: city, ZipCode: pincode,
        PreferredSlot: `${scheduledDate} ${scheduledTime}`, Instructions: message || "No special instructions",
        ProductDetails: productString, WebUrl: window.location.href 
      };

      await axios.post(`${BACKEND_URL}/api/consultation/create`, unifiedPayload, { headers: { 'auth-token': token } });
      setSuccess(true);
      refreshCart(); 
    } catch (err) { alert("Unable to process request. Please try again."); } 
    finally { setLoading(false); }
  };

  // =======================================================================
  // --- LUXURY DIGITAL RECEIPT SUCCESS SCREEN (Wow_Shop Theme) ---
  // =======================================================================
  if (success) {
    const orderId = "WOW-" + Math.floor(100000 + Math.random() * 900000);
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6 md:p-28 font-sans pt-28 ">
        <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-center lg:items-start">
          
          {/* LEFT SIDE: Thank You Message & Billing Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 w-full lg:pt-10"
          >
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6 tracking-tight leading-[1.1]">
               Thank you for <br /> your request.
             </h1>
             <p className="text-gray-600 mb-12 leading-relaxed text-sm md:text-base max-w-md font-light">
               Your site consultation request has been received. Our experts will contact you shortly to confirm technical details and layout plans.
             </p>

             <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 mb-6 border-b border-gray-200 pb-3">Site Details</h3>
             
             <div className="grid grid-cols-[100px_1fr] gap-y-6 text-sm mb-12 max-w-md">
               <span className="font-bold text-gray-900">Name</span> 
               <span className="text-gray-600">{name}</span>
               
               <span className="font-bold text-gray-900">Address</span> 
               <span className="text-gray-600 leading-relaxed">{addressLine},<br/>{city}, {stateCode} {pincode}</span>
               
               <span className="font-bold text-gray-900">Phone</span> 
               <span className="text-gray-600">{phone}</span>
               
               <span className="font-bold text-gray-900">Email</span> 
               <span className="text-gray-600">{email}</span>
             </div>

             <div className="flex gap-4">
                <button onClick={() => navigate('/profile')} className="bg-gray-900 text-white px-8 py-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] shadow-lg shadow-black/10 hover:bg-amber-600 hover:-translate-y-1 transition-all duration-300">
                  Track Portfolio
                </button>
                <button onClick={() => navigate('/')} className="bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] shadow-sm hover:border-gray-900 hover:-translate-y-1 transition-all duration-300 hidden sm:block">
                  Return to Studio
                </button>
             </div>
          </motion.div>

          {/* RIGHT SIDE: The Aesthetic Digital Receipt */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[460px] shrink-0 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
          >
             {/* The Grey "Ticket Holder" Top */}
             <div className="bg-[#E5E7EB] h-5 rounded-t-[1.5rem] w-[90%] mx-auto mb-[-10px] relative z-0" />
             
             {/* Main Receipt Body */}
             <div className="bg-white rounded-t-2xl p-8 md:p-10 relative z-10">
                <h2 className="text-2xl font-serif text-gray-900 mb-8 border-b border-gray-100 pb-6">Request Summary</h2>
                
                {/* Meta Information */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1.5 font-bold">Date</p>
                    <p className="text-[11px] font-bold text-gray-900">{today}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1.5 font-bold">Request No.</p>
                    <p className="text-[11px] font-bold text-gray-900">{orderId}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1.5 font-bold">Time Slot</p>
                    <p className="text-[11px] font-bold text-gray-900 truncate">{scheduledTime ? scheduledTime.split(' ')[0] : 'TBD'}</p>
                  </div>
                </div>

                <div className="border-b border-gray-100 border-dashed mb-8" />

                {/* Product List */}
                <div className="space-y-6 mb-8 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                  {state.cart.map((item, idx) => {
                     const product = item.product || item;
                     return (
                       <div key={idx} className="flex justify-between items-center gap-4">
                          <div className="flex items-center gap-4 flex-1">
                             <div className="w-14 h-14 bg-[#F5F5F7] border border-gray-100 rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                                <img src={getFinalImageUrl(product)} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                             </div>
                             <div className="flex-1">
                                <p className="text-xs font-bold text-gray-900 line-clamp-1 mb-1">{product.name}</p>
                                <p className="text-[9px] text-gray-400 uppercase tracking-widest">Brand: {product.brand || 'Exclusive'}</p>
                                <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">Qty: {item.quantity}</p>
                             </div>
                          </div>
                          <p className="text-xs font-bold text-gray-900 whitespace-nowrap">
                             ₹{(product.price * item.quantity).toLocaleString()}
                          </p>
                       </div>
                     )
                  })}
                </div>

                <div className="border-b border-gray-100 border-dashed mb-6" />

                {/* Calculation Totals */}
                <div className="space-y-4 mb-8 text-sm">
                   <div className="flex justify-between">
                     <span className="text-gray-500 font-light">Sub Total</span>
                     <span className="font-bold text-gray-900">₹{state.total?.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-500 font-light">White-Glove Service</span>
                     <span className="font-bold text-amber-600 uppercase text-[10px] tracking-widest bg-amber-50 px-2 py-1 rounded">Included</span>
                   </div>
                </div>

                <div className="border-b border-gray-200 mb-6" />
                
                {/* Final Total */}
                <div className="flex justify-between items-end">
                   <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Est. Value</span>
                   <span className="text-3xl font-serif text-gray-900 tracking-tight">₹{state.total?.toLocaleString()}</span>
                </div>
             </div>
             
             {/* The Magic SVG Zig-Zag Bottom (Matched with #F5F5F7 Background) */}
             <div className="w-full h-4 relative z-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L12 12L24 0H0Z' fill='%23F5F5F7'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat-x',
                backgroundSize: '24px 12px'
             }}></div>

             <div className="text-center mt-6">
                <button onClick={() => window.print()} className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors border-b border-transparent hover:border-gray-900 pb-0.5">
                   Print Digital Receipt
                </button>
             </div>

          </motion.div>
        </div>
      </div>
    );
  }

  // =======================================================================
  // --- EMPTY STATE ---
  // =======================================================================
  if (!state?.cart?.length) {
      return (
        <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mb-6" strokeWidth={1} />
            <h2 className="text-3xl font-serif text-gray-900 mb-4">Portfolio Empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto font-light">Select appliances from our studio before requesting a site consultation.</p>
            <button onClick={() => navigate('/products')} className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-[0.15em] text-[11px] hover:bg-amber-600 transition-all shadow-lg hover:-translate-y-1">Explore Collection</button>
        </div>
      );
  }

  // =======================================================================
  // --- MAIN CHECKOUT FORM (Wow_Shop Theme) ---
  // =======================================================================
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans selection:bg-amber-500 selection:text-white pt-20 lg:pt-0">
      
      {/* LEFT SIDE: FORM AREA (Clean White) */}
      <div className="w-full lg:w-[55%] xl:w-[60%] px-6 lg:px-16 xl:px-24 pt-10 lg:pt-32 pb-20 order-2 lg:order-1">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors mb-10 font-bold w-fit">
          <ArrowLeft className="w-4 h-4"/> Back to Portfolio
        </button>

        <h1 className="text-3xl md:text-5xl font-serif text-gray-900 mb-10 tracking-tight">Finalize Details</h1>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Section 1: Contact */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-6 border-b border-gray-100 pb-3 flex items-center gap-3">
              <span className="w-6 h-[1px] bg-amber-600"></span> Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CleanInput label="Full Name" name="name" value={name} onChange={handleChange} placeholder="Enter your full name" className="md:col-span-2" />
              <CleanInput type="email" label="Email Address" name="email" value={email} onChange={handleChange} placeholder="you@example.com" />
              <CleanInput type="tel" label="Phone Number" name="phone" value={phone} onChange={handleChange} placeholder="+91 00000 00000" />
            </div>
          </section>

          {/* Section 2: Address */}
          <section>
            <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 flex items-center gap-3">
                  <span className="w-6 h-[1px] bg-amber-600"></span> Site Address
                </h3>
                <button type="button" onClick={detectLocation} disabled={locLoading} className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 text-amber-600 hover:text-gray-900 transition-colors bg-amber-50 px-3 py-1.5 rounded-lg">
                    {locLoading ? <Loader2 className="animate-spin w-3 h-3"/> : <Navigation className="w-3 h-3"/>}
                    Auto Detect
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-3 flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">Street Address *</label>
                  <textarea name="addressLine" required value={addressLine} onChange={handleChange} placeholder="House/Flat No, Street, Landmark" rows="2" className="w-full bg-white border border-gray-200 text-gray-900 text-sm px-4 py-3.5 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none placeholder:text-gray-400 shadow-sm" />
              </div>
              <CleanInput label="City" name="city" value={city} onChange={handleChange} placeholder="City name" className="md:col-span-1" />
              <CleanInput label="State" name="stateCode" value={stateCode} onChange={handleChange} placeholder="State name" className="md:col-span-1" />
              <CleanInput label="Pincode" name="pincode" value={pincode} onChange={handleChange} placeholder="000000" className="md:col-span-1" />
            </div>
          </section>

          {/* Section 3: Schedule */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-6 border-b border-gray-100 pb-3 flex items-center gap-3">
              <span className="w-6 h-[1px] bg-amber-600"></span> Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <CleanInput type="date" label="Preferred Date" name="scheduledDate" value={scheduledDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} />
              <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">Preferred Time *</label>
                  <select name="scheduledTime" required value={scheduledTime} onChange={handleChange} className="w-full bg-white border border-gray-200 text-gray-900 text-sm px-4 py-3.5 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all appearance-none cursor-pointer shadow-sm">
                     <option value="" disabled>Select a slot</option>
                     <option value="Morning (10 AM - 1 PM)">Morning (10 AM - 1 PM)</option>
                     <option value="Afternoon (1 PM - 4 PM)">Afternoon (1 PM - 4 PM)</option>
                     <option value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</option>
                  </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">Special Instructions (Optional)</label>
                <textarea name="message" value={message} onChange={handleChange} placeholder="Any specific requirements?" rows="2" className="w-full bg-white border border-gray-200 text-gray-900 text-sm px-4 py-3.5 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none placeholder:text-gray-400 shadow-sm" />
            </div>
          </section>

          {/* Mobile Submit */}
          <div className="block lg:hidden pt-4">
             <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white h-16 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-colors disabled:opacity-70 shadow-lg">
                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Confirm Request"}
             </button>
          </div>
        </form>
      </div>

      {/* RIGHT SIDE: CART SUMMARY (Light Gray Background) */}
      <div className="w-full lg:w-[45%] xl:w-[40%] bg-[#F5F5F7] border-l border-gray-200 px-6 lg:px-12 xl:px-16 pt-12 lg:pt-32 pb-20 order-1 lg:order-2">
         <div className="lg:sticky lg:top-32">
            
            <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
                <h3 className="text-2xl font-serif text-gray-900">Portfolio</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-white px-3 py-1 border border-gray-200 rounded-lg shadow-sm">{state.cart.length} Items</span>
            </div>

            {/* Scrollable Products List */}
            <div className="space-y-4 mb-10 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
               {state.cart.map((item, idx) => {
                  const product = item.product || item;
                  const finalImg = getFinalImageUrl(product);

                  return (
                      <div key={idx} className="flex gap-4 items-center bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm">
                          <div className="w-16 h-16 bg-[#F5F5F7] rounded-xl p-2 flex-shrink-0">
                             <img src={finalImg} className="w-full h-full object-contain mix-blend-multiply" alt={product.name} />
                          </div>
                          <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                              <div className="flex justify-between items-center mt-1.5">
                                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
                                  <p className="text-sm font-bold text-gray-900">₹{(product.price * item.quantity).toLocaleString()}</p>
                              </div>
                          </div>
                      </div>
                  )
               })}
            </div>

            {/* Total & Action */}
            <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-between items-end mb-8">
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Est. Value</span>
                    <span className="text-4xl font-serif text-gray-900 tracking-tight">₹{state.total?.toLocaleString()}</span>
                </div>
                
                <button onClick={handleSubmit} disabled={loading} className="hidden lg:flex w-full bg-gray-900 hover:bg-amber-600 text-white h-16 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] items-center justify-center gap-3 transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 disabled:opacity-70">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Confirm Request"}
                </button>

                <div className="mt-8 flex justify-center items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <ShieldCheck className="w-3.5 h-3.5"/> 256-bit Secure Encryption
                </div>
            </div>

         </div>
      </div>

    </div>
  );
}