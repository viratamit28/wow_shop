import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  User, Package, Clock, CheckCircle, Phone, 
  CalendarDays, XCircle, LogOut, FileText, Loader2, MapPin, Mail, Headphones
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// 🔥 FIX 1: Production Ready Environment Variables
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dcljdkqer/image/upload/";

export default function ProfilePage() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchHistory();
    } else {
      navigate("/");
    }
  }, [token, navigate]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/consultation/mine`, {
        headers: { "auth-token": token },
      });

      if (res.data.success && Array.isArray(res.data.data)) {
        setRequests(res.data.data);
      } else if (Array.isArray(res.data)) {
        setRequests(res.data);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error("Error fetching history", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this consultation request?")) return;

    try {
      await axios.put(`${BACKEND_URL}/api/consultation/cancel/${id}`, {}, {
        headers: { "auth-token": token },
      });
      fetchHistory();
    } catch (err) {
      alert("Could not cancel request. Please try again.");
    }
  };

  // 🔥 FIX 2: Universal Image Helper (Matched with Consultation Page)
  const getFinalImageUrl = (imgPath) => {
    if (!imgPath) return "https://placehold.co/100?text=No+Img";
    if (Array.isArray(imgPath)) imgPath = imgPath.length > 0 ? imgPath[0] : "";
    return imgPath && imgPath.startsWith('http') ? imgPath : `${CLOUDINARY_BASE_URL}${imgPath}.jpg`;
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7]">
        <Loader2 className="w-10 h-10 text-amber-600 animate-spin mb-4" strokeWidth={1.5} />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] animate-pulse">Loading Workspace...</span>
    </div>
  );

  const customEase = [0.16, 1, 0.3, 1];

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans pt-28 pb-20 selection:bg-amber-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* PAGE HEADER */}
        <div className="mb-12 border-b border-gray-200/60 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-gray-900 tracking-tight mb-2">My Workspace</h1>
              <p className="text-gray-500 font-light">Manage your profile and track active consultations.</p>
            </div>
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm text-[10px] font-bold uppercase tracking-widest text-gray-500">
               Client ID: <span className="text-gray-900 ml-1">{user?._id?.slice(-6).toUpperCase() || 'VIP'}</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: VIP USER CARD & CONCIERGE */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: customEase }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Profile Card */}
            <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white mb-6 mx-auto shadow-xl relative">
                <span className="text-3xl font-serif">{user?.name ? user.name.charAt(0).toUpperCase() : <User />}</span>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
              </div>
              
              <div className="text-center mb-8">
                  <h2 className="text-2xl font-serif font-bold capitalize text-gray-900 mb-1">
                    {user?.name || "Premium Client"}
                  </h2>
                  <p className="text-sm text-gray-500 font-light mb-1">{user?.email}</p>
                  {/* 🔥 FIX 3: Display User Phone */}
                  {user?.phone && <p className="text-xs font-medium text-gray-400">{user.phone}</p>}
              </div>

              <div className="bg-[#F9FAFB] rounded-2xl p-5 mb-8 border border-gray-100/80">
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-gray-500 font-medium text-xs uppercase tracking-widest">Total Requests</span>
                  <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">{requests.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium text-xs uppercase tracking-widest">Membership</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">Elite</span>
                </div>
              </div>

              <button
                onClick={() => { logout(); navigate('/'); }}
                className="w-full py-4 bg-white border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <LogOut className="w-4 h-4" /> Secure Sign Out
              </button>
            </div>

            {/* 🔥 FIX 4: Luxury Concierge Card */}
            <div className="bg-gray-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
               <Headphones className="w-8 h-8 text-amber-500 mb-4" />
               <h3 className="text-xl font-serif mb-2">Dedicated Concierge</h3>
               <p className="text-xs text-gray-400 font-light mb-6 leading-relaxed">
                 Need assistance with your kitchen planning or existing portfolio? Our senior designers are here to help.
               </p>
               <button className="w-full py-3.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                 <Phone className="w-3.5 h-3.5" /> Call 1800-WOW-SHOP
               </button>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: HISTORY LIST */}
          <div className="lg:col-span-8">
            <motion.h3 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> Consultation Portfolio
            </motion.h3>

            {requests.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-16 rounded-[2.5rem] text-center border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                    <Package className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-serif text-gray-900 mb-3 tracking-tight">No Active Requests</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto font-light leading-relaxed">
                  You haven't requested any site consultations yet. Explore our studio to start building your dream space.
                </p>
                <button
                  onClick={() => navigate("/products")}
                  className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-amber-600 hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  Explore Studio
                </button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {requests.map((req, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, delay: index * 0.1, ease: customEase }}
                      key={req._id}
                      className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all relative group"
                    >
                      {/* Header: ID & Status */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 pb-6">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-1.5 font-bold">
                            Request ID: {req._id ? req._id.slice(-8).toUpperCase() : "N/A"}
                          </p>
                          <div className="flex items-center gap-2 text-gray-900">
                            <CalendarDays className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-bold tracking-wide">
                              {req.createdAt ? new Date(req.createdAt).toLocaleDateString("en-IN", { year: 'numeric', month: 'short', day: 'numeric' }) : "Date N/A"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
                          {/* Premium Status Pill */}
                          <div className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border w-full md:w-auto justify-center
                              ${req.status === "Completed" || req.status === "Confirmed" ? "bg-green-50 text-green-700 border-green-100" 
                              : req.status === "Cancelled" ? "bg-red-50 text-red-700 border-red-100" 
                              : "bg-amber-50 text-amber-700 border-amber-100"}`}
                          >
                            {req.status === "Completed" || req.status === "Confirmed" ? <CheckCircle className="w-3.5 h-3.5" /> 
                            : req.status === "Cancelled" ? <XCircle className="w-3.5 h-3.5" /> 
                            : <Clock className="w-3.5 h-3.5 animate-pulse" />}
                            {req.status || "Pending Review"}
                          </div>

                          {/* CANCEL BUTTON */}
                          {(!req.status || req.status.includes("Pending")) && (
                            <button
                              onClick={() => handleCancel(req._id)}
                              className="text-[10px] text-gray-400 hover:text-red-600 font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 mx-auto md:mr-0"
                            >
                              <XCircle className="w-3 h-3" /> Cancel Request
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        
                        {/* --- PRODUCT SCROLL LIST --- */}
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Portfolio Summary</p>
                          <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                            {req.interestedProducts && req.interestedProducts.length > 0 ? (
                              req.interestedProducts.map((item, i) => {
                                const imgUrl = getFinalImageUrl(item.image);

                                return (
                                  <div key={i} className="flex gap-3 items-center bg-[#F9FAFB] p-2.5 rounded-xl border border-gray-100 group/item cursor-pointer" onClick={() => navigate(`/product-details/${item.id}`)}>
                                    <div className="w-12 h-12 bg-white rounded-lg p-1.5 flex items-center justify-center flex-shrink-0">
                                      {imgUrl ? (
                                        <img src={imgUrl} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover/item:scale-110 transition-transform duration-300" />
                                      ) : (
                                        <Package className="w-5 h-5 text-gray-300" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-[11px] font-bold text-gray-900 group-hover/item:text-amber-600 truncate transition-colors">
                                        {item.name}
                                      </div>
                                      <div className="text-[10px] text-gray-500 mt-0.5 flex justify-between pr-2">
                                        <span>Qty: {item.qty || item.quantity || 1}</span>
                                        {item.price && <span className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</span>}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="bg-gray-50 w-full rounded-2xl p-6 flex flex-col items-center justify-center border border-gray-100 border-dashed text-center">
                                  <FileText className="w-6 h-6 text-gray-300 mb-2" />
                                  <p className="text-xs text-gray-500 font-medium">General Kitchen Inquiry</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* --- EXPERT VISIT DETAILS --- */}
                        <div className="bg-[#F9FAFB] p-6 rounded-2xl border border-gray-100 flex flex-col justify-between">
                          <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-5">Site Visit Details</p>
                              <div className="space-y-4 text-sm">
                                  <div className="flex items-start gap-3">
                                      <MapPin className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                                      <span className="text-gray-600 leading-relaxed text-xs">
                                          <strong className="text-gray-900 block text-sm mb-0.5">{req.customerDetails?.name || "Client"}</strong>
                                          {/* 🔥 FIX 5: Safely combine address components */}
                                          {req.customerDetails?.address?.line || "Address hidden"}, <br/>
                                          {req.customerDetails?.address?.city || ""} {req.customerDetails?.address?.pincode || ""}
                                      </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-3 pt-2 border-t border-gray-200/60">
                                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                                      <span className="text-gray-800 font-medium text-xs tracking-wide">{req.customerDetails?.phone || "Phone not provided"}</span>
                                  </div>

                                  {(req.appointment?.date || req.appointment?.timeSlot) && (
                                      <div className="flex items-center gap-3 pt-1">
                                          <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                                          <span className="text-gray-800 font-medium text-xs tracking-wide">
                                              {req.appointment?.date ? new Date(req.appointment.date).toLocaleDateString("en-IN", {day:'numeric', month:'short'}) : ""} • {req.appointment?.timeSlot || "TBD"}
                                          </span>
                                      </div>
                                  )}
                              </div>
                          </div>
                          
                          {req.totalEstimatedValue > 0 && (
                              <div className="mt-6 pt-5 border-t border-gray-200 flex justify-between items-end">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Est. Value</span>
                                <span className="font-serif font-bold text-2xl text-gray-900 tracking-tight">
                                  ₹{req.totalEstimatedValue.toLocaleString()}
                                </span>
                              </div>
                          )}
                        </div>

                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}