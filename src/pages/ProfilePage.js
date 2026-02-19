import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  User,
  Package,
  Clock,
  CheckCircle,
  Phone,
  Calendar,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      const res = await axios.get(
        "http://localhost:5000/api/consultation/mine",
        {
          headers: { "auth-token": token },
        }
      );

      if (res.data.success && Array.isArray(res.data.data)) {
        setRequests(res.data.data);
      } else if (Array.isArray(res.data)) {
        setRequests(res.data);
      } else {
        setRequests([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching history", err);
      setLoading(false);
    }
  };

  // --- CANCEL LOGIC ---
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this request?"))
      return;

    try {
      await axios.put(
        `http://localhost:5000/api/consultation/cancel/${id}`,
        {},
        {
          headers: { "auth-token": token },
        }
      );
      fetchHistory();
      alert("Request Cancelled Successfully");
    } catch (err) {
      alert("Could not cancel request");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        Loading Profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* LEFT: USER CARD */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-32">
              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-center capitalize">
                {user?.name || "User"}
              </h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                {user?.email}
              </p>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Requests</span>
                  <span className="font-bold">{requests.length}</span>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full mt-6 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 text-sm font-bold transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* RIGHT: HISTORY LIST */}
          <div className="md:col-span-3">
            <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
              <Package className="w-6 h-6" /> My Consultation Requests
            </h2>

            {requests.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center border border-gray-200">
                <p className="text-gray-500 mb-4">
                  You haven't made any requests yet.
                </p>
                <button
                  onClick={() => navigate("/products")}
                  className="text-amber-600 font-bold underline"
                >
                  Start Browsing
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {requests.map((req) => (
                  <div
                    key={req._id}
                    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
                  >
                    {/* Status Strip */}
                    <div
                      className={`absolute top-0 left-0 w-1 h-full ${
                        req.status === "Cancelled"
                          ? "bg-red-500"
                          : req.status === "Completed"
                          ? "bg-green-500"
                          : "bg-amber-500"
                      }`}
                    />

                    {/* Header: ID & Status */}
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 border-b border-gray-100 pb-4 pl-4">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                          Request ID: #{req._id ? req._id.slice(-6) : "NA"}
                        </p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-bold text-gray-900">
                            {/* FIX: Use createdAt for when the request was made */}
                            {req.createdAt
                              ? new Date(req.createdAt).toLocaleDateString("en-IN")
                              : "Date N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 md:mt-0 flex items-center gap-3">
                        <div
                          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                            req.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : req.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {req.status === "Completed" ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : req.status === "Cancelled" ? (
                            <XCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {req.status || "Pending Expert Call"}
                        </div>

                        {/* CANCEL BUTTON */}
                        {(!req.status || req.status.includes("Pending")) && (
                          <button
                            onClick={() => handleCancel(req._id)}
                            className="text-xs text-red-500 hover:text-red-700 font-bold underline decoration-red-200 hover:decoration-red-700"
                          >
                            Cancel Request
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-4">
                      
                      {/* --- PRODUCT LIST --- */}
                      <div className="md:col-span-2">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-3">
                          Selected Products
                        </p>
                        <div className="space-y-3">
                          {req.interestedProducts && req.interestedProducts.length > 0 ? (
                            req.interestedProducts.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg border border-gray-100 group/item hover:border-amber-200 transition-colors"
                              >
                                {/* Image */}
                                <div
                                  onClick={() => navigate(`/product-details/${item.id}`)}
                                  className="w-12 h-12 bg-white rounded-md flex items-center justify-center border border-gray-200 overflow-hidden shrink-0 cursor-pointer"
                                >
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <Package className="w-6 h-6 text-gray-300" />
                                  )}
                                </div>

                                {/* Info */}
                                <div
                                  onClick={() => navigate(`/product-details/${item.id}`)}
                                  className="flex-1 min-w-0 cursor-pointer"
                                >
                                  <div className="text-sm font-bold text-gray-900 group-hover/item:text-amber-600 group-hover/item:underline truncate transition-colors">
                                    {item.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {/* FIX: Ensured qty is properly mapped */}
                                    Qty: {item.qty || item.quantity || 1} {item.price && `• ₹${item.price.toLocaleString()}`}
                                  </div>
                                </div>

                                {/* Arrow */}
                                <button
                                  onClick={() => navigate(`/product-details/${item.id}`)}
                                  className="text-gray-400 hover:text-amber-600 pr-2 transition-colors"
                                  title="View Details"
                                >
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-red-400">
                              No items data found
                            </p>
                          )}
                        </div>
                      </div>

                      {/* VISIT DETAILS */}
                      <div className="bg-gray-50 p-4 rounded-xl h-fit">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                          Expert Visit Details
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="truncate">
                              {/* FIX: Correct mapping for customer details */}
                              {req.customerDetails?.name || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {req.customerDetails?.phone || "N/A"}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {/* FIX: Mapping to appointment date */}
                            {req.appointment?.date || "Date N/A"}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {/* FIX: Mapping to appointment timeSlot */}
                            {req.appointment?.timeSlot || "Time N/A"}
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-end">
                          <span className="text-xs text-gray-500">
                            Est. Value
                          </span>
                          <span className="font-bold text-lg">
                            ₹{(req.totalEstimatedValue || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}