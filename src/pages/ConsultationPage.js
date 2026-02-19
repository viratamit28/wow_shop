import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  Phone, User, MapPin, Calendar, CheckCircle, 
  ArrowLeft, FileText, Navigation, Clock, Loader2 
} from 'lucide-react';

// 🔥 CLOUDINARY CONFIG
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dcljdkqer/image/upload/";

export default function ConsultationPage() {
  const { state } = useLocation(); 
  const navigate = useNavigate();
  const { token, refreshCart, user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '', 
    addressLine: '',
    city: '',
    pincode: '',
    scheduledDate: '',
    scheduledTime: '',
    message: ''
  });

  // 1. User Data Auto-Fill (Sirf page load hone par ek baar)
  useEffect(() => {
    if (user && !formData.name) { // Check lagaya taaki user ka type kiya hua overwrite na ho
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Redirect if no cart state
  useEffect(() => {
    if (!state || !state.cart || state.cart.length === 0) {
       // Optional Redirect logic here
    }
  }, [state, navigate]);

  // 2. Auto-Detect Location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          
          const address = response.data.address;
          
          setFormData(prev => ({
            ...prev,
            addressLine: `${address.road || ''}, ${address.suburb || ''}, ${address.neighbourhood || ''}`,
            city: address.city || address.town || address.village || '',
            pincode: address.postcode || '',
            state: address.state || ''
          }));
          
        } catch (error) {
          console.error("Location Fetch Error", error);
          alert("Location detected but failed to get address details. Please fill manually.");
        } finally {
          setLocLoading(false);
        }
      },
      () => {
        setLocLoading(false);
        alert("Unable to retrieve your location. Please enable GPS permissions.");
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Token Check (Database save karne ke liye zaroori hai)
    if (!token) {
        alert("Please login to submit request");
        setLoading(false);
        return;
    }

    if (!state || !state.cart || state.cart.length === 0) {
        alert("Cart is empty!");
        setLoading(false);
        return;
    }

    try {
     // ==========================================
      // STEP 1: DATABASE ME SAVE KARNE WALA DATA 
      // ==========================================
      const dbPayload = {
        customerDetails: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: {
                line: formData.addressLine,
                city: formData.city,
                pincode: formData.pincode
            }
        },
        appointment: {
            date: formData.scheduledDate,
            timeSlot: formData.scheduledTime,
            message: formData.message
        },
        
        // 👇 YAHAN FIX KIYA HAI 👇
        interestedProducts: state.cart.map(i => {
            // Image data nikal rahe hain
            const rawImage = i.product?.image || i.image;
            // Agar image Array hai toh pehli image [0] lo, warna normal string lo
            const singleImage = Array.isArray(rawImage) ? rawImage[0] : rawImage;

            return { 
                id: i.product?._id || i.productId || i._id, 
                name: i.product?.name || i.title || i.name, 
                image: singleImage, // Ab ye hamesha ek single string (URL) jayega
                price: i.product?.price || i.price, 
                qty: i.quantity || i.qty
            };
        }),
        
        totalEstimatedValue: state?.total || 0
      };

      // Apne MongoDB me save karo (Token ke sath)
      await axios.post('http://localhost:5000/api/consultation/create', dbPayload, {
        headers: { 'auth-token': token }
      });
      console.log("✅ Saved to MongoDB successfully");


      // ==========================================
      // STEP 2: CRM ME BHEJNE WALA DATA
      // ==========================================
      const productString = state.cart.map(item => 
        `${item.product?.name || item.title || item.name} (Qty: ${item.quantity || item.qty})`
      ).join(', ');

      const crmPayload = {
        Name: formData.name,
        ContactNo: formData.phone,
        EMailId: formData.email,
        Address: formData.addressLine, 
        City: formData.city,
        ZipCode: formData.pincode,
        PreferredSlot: `${formData.scheduledDate} ${formData.scheduledTime}`, 
        Instructions: formData.message || "No special instructions",
        ProductDetails: productString,
        WebUrl: window.location.href 
      };

      // CRM ko bhejo (Bina token ke chalega kyunki proxy route hai)
      await axios.post('http://localhost:5000/api/consultation/add-lead', crmPayload);
      console.log("✅ Sent to CRM successfully");

      // ==========================================
      // STEP 3: SUCCESS 
      // ==========================================
      setSuccess(true);
      refreshCart(); 

    } catch (err) {
      console.error("Submission Error:", err);
      alert("Kuch error aagya, console check karo.");
    } finally {
      setLoading(false);
    }
  };
  // --- 🔥 SUCCESS SCREEN (UPDATED) ---
  if (success) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4 pt-20">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-serif font-bold mb-4 text-gray-900">Request Received!</h1>
            
            {/* ✅ NAME FIX: formData.name show karega */}
            <p className="text-gray-600 max-w-lg mb-8 text-lg leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. We have received your consultation request.<br/>
                Our expert will visit on <span className="font-bold text-black">{formData.scheduledDate}</span> between <span className="font-bold text-black">{formData.scheduledTime}</span>.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4">
                {/* ✅ TRACK BUTTON ADDED */}
                <button onClick={() => navigate('/profile')} className="bg-black text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg">
                    Track Request
                </button>
                
                <button onClick={() => navigate('/')} className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                    Back to Home
                </button>
            </div>
        </div>
    );
  }

  // --- EMPTY STATE ---
  if (!state || !state.cart) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center pt-20">
            <p className="text-gray-500 mb-4">No items selected for consultation.</p>
            <button onClick={() => navigate('/')} className="text-amber-600 font-bold underline">Browse Products</button>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#F8F8FA] pt-32 pb-20">
      
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-2">Schedule Site Visit</h1>
        <p className="text-gray-500">Auto-fill your details and select a convenient time for our experts.</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT: SUMMARY */}
            <div className="lg:col-span-1 h-fit">
                <div className="bg-[#121212] text-white p-6 rounded-2xl shadow-2xl sticky top-28">
                    <h3 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-6">Selected Interest</h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 mb-6">
                        {state.cart.map((item, i) => {
                            const product = item.product || item;
                            
                            // Image Logic
                            let displayImg = product.image;
                            if (Array.isArray(displayImg)) {
                                displayImg = displayImg.length > 0 ? displayImg[0] : "";
                            }
                            const finalImg = displayImg && displayImg.startsWith('http') 
                                ? displayImg 
                                : `${CLOUDINARY_BASE_URL}${displayImg}.jpg`;

                            return (
                                <div key={i} className="flex gap-4 border-b border-gray-800 pb-4 last:border-0">
                                    {/* ✅ Black Box Image Visibility Fix */}
                                    <img 
                                        src={finalImg} 
                                        className="w-12 h-12 object-cover rounded-md bg-white" 
                                        alt="" 
                                        onError={(e) => e.target.src="https://placehold.co/100?text=No+Img"}
                                    />
                                    <div>
                                        <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                                        <p className="text-amber-500 text-xs mt-1">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                        <span className="text-gray-400 text-sm">Est. Budget</span>
                        <span className="text-xl font-bold">₹{state.total?.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* RIGHT: PREMIUM FORM */}
            <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
                    
                    {/* SECTION 1: Personal Details */}
                    <div className="mb-10">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                           <span className="bg-amber-100 text-amber-700 p-1.5 rounded-lg"><User size={18}/></span> 
                           Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                                <input required name="name" value={formData.name} onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 rounded-lg border-transparent focus:border-amber-500 focus:bg-white border transition-all outline-none" placeholder="Your Name" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 rounded-lg border-transparent focus:border-amber-500 focus:bg-white border transition-all outline-none" placeholder="+91..." />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Location */}
                    <div className="mb-10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-700 p-1.5 rounded-lg"><MapPin size={18}/></span> 
                                Site Address
                            </h3>
                            <button type="button" onClick={detectLocation} disabled={locLoading}
                                className="text-xs font-bold flex items-center gap-1 text-amber-600 hover:text-amber-700 transition-colors">
                                {locLoading ? <Loader2 className="animate-spin w-4 h-4"/> : <Navigation className="w-3 h-3"/>}
                                {locLoading ? "Detecting..." : "Auto Detect Location"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Street Address / Landmark</label>
                                <input required name="addressLine" value={formData.addressLine} onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 rounded-lg border-transparent focus:border-amber-500 focus:bg-white border transition-all outline-none" placeholder="Flat No, Tower, Street..." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                                <input required name="city" value={formData.city} onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 rounded-lg border-transparent focus:border-amber-500 focus:bg-white border transition-all outline-none" placeholder="City" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Pincode</label>
                                <input required name="pincode" value={formData.pincode} onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 rounded-lg border-transparent focus:border-amber-500 focus:bg-white border transition-all outline-none" placeholder="000000" />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: Scheduling */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="bg-green-100 text-green-700 p-1.5 rounded-lg"><Calendar size={18}/></span> 
                            Preferred Slot
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                                <input required type="date" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]} 
                                    className="w-full p-3 bg-gray-50 rounded-lg border-transparent focus:border-amber-500 focus:bg-white border transition-all outline-none cursor-pointer" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Time Slot</label>
                                <select required name="scheduledTime" value={formData.scheduledTime} onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 rounded-lg border-transparent focus:border-amber-500 focus:bg-white border transition-all outline-none cursor-pointer appearance-none">
                                    <option value="" disabled>Select Time</option>
                                    <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                                    <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                                    <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4">
                             <textarea name="message" rows="2" value={formData.message} onChange={handleChange}
                                className="w-full p-3 bg-gray-50 rounded-lg border-transparent focus:border-amber-500 focus:bg-white border transition-all outline-none resize-none text-sm" 
                                placeholder="Any specific instructions for our team? (Optional)" />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" disabled={loading}
                        className="w-full bg-black text-white h-16 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-900 transition-all shadow-xl flex items-center justify-center gap-3 disabled:bg-gray-400">
                        {loading ? <Loader2 className="animate-spin"/> : "Confirm Site Visit"}
                    </button>

                </form>
            </div>
      </div>
    </div>
  );
}