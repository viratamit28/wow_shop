import React, { useState } from "react";
import { Calendar, Clock, ChevronRight, CheckCircle2, Star, Sparkles, X } from "lucide-react";
import consultationBanner from "../assests/book.jpg";



const LuxuryDemoSection = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  // Demo ke liye next 14 days generate kar rahe hain taaki realistic lage
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue
        date: d.getDate(), // 12, 13
        fullDate: d // full object
      });
    }
    return dates;
  };

  const datesList = generateDates();

  const slots = [
    "10:00 AM", "11:30 AM", "01:00 PM", 
    "02:30 PM", "04:00 PM", "05:30 PM"
  ];

  const handleBook = () => {
    if (selectedDate && selectedTime) {
      setShowLogin(true);
    }
  };

  return (
    <section className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8 font-sans">
      
      {/* Main Card Container */}
      <div className="bg-white  shadow-2xl overflow-hidden max-w-6xl w-full flex flex-col lg:flex-row min-h-[600px]">
        
        {/* Left Side - Visuals (Image) */}
        <div className="lg:w-5/12 relative h-64 lg:h-auto overflow-hidden group">
          <img
            src={consultationBanner}
            alt="Luxury Kitchen"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <div className="flex items-center gap-2 mb-3 bg-white/20 backdrop-blur-md w-fit px-4 py-1.5 rounded-full border border-white/30">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold tracking-wider uppercase">Premium Experience</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2">
              Transform Your <br/> <span className="text-orange-400">Kitchen Today</span>
            </h2>
            <p className="text-gray-300 text-sm md:text-base max-w-xs">
              Book a live consultation with our experts and experience the future of cooking.
            </p>
          </div>
        </div>

        {/* Right Side - Booking Form */}
        <div className="lg:w-7/12 p-6 md:p-12 lg:p-14 flex flex-col bg-white relative">
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Your virtual Demo</h1>
            <p className="text-gray-500">Select a date and time to schedule your personalized session.</p>
          </div>

          <div className="flex-1 space-y-8">
            
            {/* Date Selection - Horizontal Scroll */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
                <Calendar className="w-4 h-4 text-orange-500" />
                Select Date
              </label>
              
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                {datesList.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(item.date)}
                    className={`flex flex-col items-center justify-center min-w-[70px] h-[85px] rounded-2xl border transition-all duration-300 ${
                      selectedDate === item.date
                        ? "bg-gray-900 border-gray-900 text-white shadow-lg scale-105"
                        : "bg-white border-gray-100 text-gray-500 hover:border-orange-300 hover:bg-orange-50"
                    }`}
                  >
                    <span className="text-xs font-medium uppercase">{item.day}</span>
                    <span className={`text-2xl font-bold ${selectedDate === item.date ? 'text-orange-400' : 'text-gray-900'}`}>
                      {item.date}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection - Grid */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
                <Clock className="w-4 h-4 text-orange-500" />
                Select Time
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {slots.map((slot, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-3 px-4 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                      selectedTime === slot
                        ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200"
                        : "bg-white border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-600"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 uppercase font-semibold">Selected Slot</span>
              <span className="text-lg font-bold text-gray-900">
                {selectedDate && selectedTime 
                  ? `${selectedDate} Dec at ${selectedTime}`
                  : "Please select a slot"}
              </span>
            </div>
            
            <button
              onClick={handleBook}
              disabled={!selectedDate || !selectedTime}
              className={`group flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white shadow-xl transition-all duration-300 w-full md:w-auto ${
                selectedDate && selectedTime
                  ? "bg-gray-900 hover:bg-orange-600 hover:shadow-orange-200 cursor-pointer transform hover:-translate-y-1"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Confirm Booking
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Modern Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowLogin(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            
            {/* Modal Header Art */}
            <div className="h-32 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
               <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner border border-white/30">
                  <Star className="w-8 h-8 text-white fill-current" />
               </div>
               <button 
                  onClick={() => setShowLogin(false)}
                  className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full text-white transition-colors"
                >
                  <X className="w-5 h-5" />
               </button>
            </div>

            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Almost There!</h3>
              <p className="text-gray-500 mb-8">
                Apni booking confirm karne ke liye please login karein.
              </p>

              <button 
                onClick={() => window.location.href = '/login'}
                className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-gray-200 hover:bg-orange-600 hover:shadow-orange-200 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Login to Continue
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <button 
                onClick={() => setShowLogin(false)}
                className="mt-4 text-sm text-gray-500 font-semibold hover:text-gray-800 transition-colors"
              >
                No thanks, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LuxuryDemoSection;