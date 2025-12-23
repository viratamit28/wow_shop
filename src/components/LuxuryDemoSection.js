import React, { useState } from "react";
import { Calendar, Clock, ChevronRight, Star, Sparkles, X, Loader2, CheckCircle } from "lucide-react";
import consultationBanner from "../assests/book.jpg";

const LuxuryDemoSection = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // Success modal ke liye
  const [loading, setLoading] = useState(false); // API call status

  // Dummy user check (Isse apne auth logic se replace karein)
  const isUserLoggedIn = true; 
  const userId = "USER_12345"; // Ye actual user ID context ya local storage se aayega

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        fullDate: d
      });
    }
    return dates;
  };

  const datesList = generateDates();
  const slots = ["10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"];

  // Main Booking Function
  const handleBook = async () => {
    if (!selectedDate || !selectedTime) return;

    if (!isUserLoggedIn) {
      setShowLogin(true);
      return;
    }

    // Backend API Call start
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          date: selectedDate,
          month: datesList.find(d => d.date === selectedDate)?.month,
          time: selectedTime,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Show success modal
        setShowSuccess(true);
        // Reset selection
        setSelectedDate(null);
        setSelectedTime(null);
      } else {
        alert("Booking failed: " + data.message);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8 font-sans">
      
      {/* Main Card Container */}
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden max-w-6xl w-full flex flex-col lg:flex-row min-h-[600px] border border-gray-100">
        
        {/* Left Side - Visuals */}
        <div className="lg:w-5/12 relative h-64 lg:h-auto overflow-hidden group">
          <img
            src={consultationBanner}
            alt="Luxury Kitchen"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 text-white z-10">
            <div className="flex items-center gap-2 mb-4 bg-white/10 backdrop-blur-md w-fit px-4 py-1.5 rounded-full border border-white/20">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold tracking-wider uppercase">Virtual Experience</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
              Future of <br/> <span className="text-orange-400">Cooking</span>
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-sm">
              Schedule a personalized live demo with our kitchen experts.
            </p>
          </div>
        </div>

        {/* Right Side - Booking Form */}
        <div className="lg:w-7/12 p-6 md:p-12 lg:p-14 flex flex-col bg-white relative">
          
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Book a Demo</h1>
            <p className="text-gray-500 font-medium">Choose a suitable time for your consultation.</p>
          </div>

          <div className="flex-1 space-y-10">
            
            {/* Date Selection */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                <Calendar className="w-4 h-4 text-orange-500" />
                Select Date
              </label>
              
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                {datesList.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(item.date)}
                    className={`flex flex-col items-center justify-center min-w-[72px] h-[90px] rounded-2xl border transition-all duration-300 ${
                      selectedDate === item.date
                        ? "bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-200 transform scale-105"
                        : "bg-white border-gray-100 text-gray-400 hover:border-orange-200 hover:bg-orange-50/50"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider mb-1">{item.day}</span>
                    <span className={`text-2xl font-bold ${selectedDate === item.date ? 'text-orange-400' : 'text-gray-900'}`}>
                      {item.date}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                <Clock className="w-4 h-4 text-orange-500" />
                Select Time
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {slots.map((slot, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-3.5 px-4 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                      selectedTime === slot
                        ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200"
                        : "bg-white border-gray-100 text-gray-600 hover:border-orange-300 hover:text-orange-600"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wide mb-1">Your Selection</span>
              <span className="text-lg font-bold text-gray-900">
                {selectedDate && selectedTime 
                  ? `${selectedDate} ${datesList.find(d => d.date === selectedDate)?.month} at ${selectedTime}`
                  : "No slot selected"}
              </span>
            </div>
            
            <button
              onClick={handleBook}
              disabled={!selectedDate || !selectedTime || loading}
              className={`group flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-white shadow-xl transition-all duration-300 w-full md:w-auto min-w-[200px] ${
                selectedDate && selectedTime
                  ? "bg-gray-900 hover:bg-orange-600 hover:shadow-orange-200 cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  Confirm Booking
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSuccess(false)} />
           <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-500 mb-8">We have received your appointment request. Our team will contact you shortly.</p>
              <button 
                onClick={() => setShowSuccess(false)}
                className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
           </div>
        </div>
      )}

      {/* Login Modal (Same as before but simplified for brevity) */}
      {showLogin && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogin(false)} />
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
               <h3 className="text-2xl font-bold mb-4">Please Login</h3>
               <p className="text-gray-500 mb-6">You need to login to confirm your booking.</p>
               <button onClick={() => setShowLogin(false)} className="w-full bg-gray-900 text-white py-3 rounded-xl">Login</button>
            </div>
         </div>
      )}
    </section>
  );
};

export default LuxuryDemoSection;