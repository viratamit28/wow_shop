import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MapPin, Video, Star, Phone, Filter, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { BookingConsultation } from "../components/BookingConsultation"; 
import { PageHero } from "../components/PageHero"; // Reusing your Premium Hero

// --- DUMMY EXPERT DATA ---
const experts = [
    { 
        id: 1, 
        name: "Arjun Mehta", 
        city: "Pune", 
        area: "Koregaon Park", 
        rating: 4.9, 
        jobs: 120, 
        img: "https://randomuser.me/api/portraits/men/32.jpg", 
        type: "Video Call",
        specialty: "Modular Kitchens",
        verified: true 
    },
    { 
        id: 2, 
        name: "Sana Khan", 
        city: "Mumbai", 
        area: "Juhu", 
        rating: 4.8, 
        jobs: 85, 
        img: "https://randomuser.me/api/portraits/women/44.jpg", 
        type: "Site Visit",
        specialty: "Built-in Appliances",
        verified: true 
    },
    { 
        id: 3, 
        name: "Vikram Singh", 
        city: "Delhi", 
        area: "South Ex", 
        rating: 5.0, 
        jobs: 200, 
        img: "https://randomuser.me/api/portraits/men/86.jpg", 
        type: "Video Call",
        specialty: "Smart Home Integration",
        verified: true 
    },
    { 
        id: 4, 
        name: "Priya Das", 
        city: "Pune", 
        area: "Baner", 
        rating: 4.7, 
        jobs: 90, 
        img: "https://randomuser.me/api/portraits/women/65.jpg", 
        type: "Site Visit",
        specialty: "Kitchen Architecture",
        verified: false 
    },
];

// --- INTERNAL COMPONENT: EXPERT CARD ---
const ExpertCard = ({ expert, onBook }) => (
  <div className="flex flex-col md:flex-row gap-6 border-b border-gray-100 py-8 first:pt-0 hover:bg-gray-50 transition-colors rounded-xl px-4 group">
      {/* Image & Badge */}
      <div className="relative shrink-0">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 p-1 group-hover:border-amber-200 transition-colors">
            <img src={expert.img} alt={expert.name} className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
        </div>
        {expert.verified && (
            <div className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg border-2 border-white">
                <ShieldCheck className="w-3 h-3 text-amber-500" /> PRO
            </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="text-xl font-serif font-bold text-gray-900 leading-tight">{expert.name}</h3>
                <p className="text-xs text-amber-600 font-bold uppercase tracking-widest mt-1">{expert.specialty}</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs font-bold text-black">
                <Star className="w-3 h-3 fill-current text-amber-500" /> {expert.rating}
            </div>
        </div>

        <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
            <MapPin className="w-3 h-3" /> {expert.area}, {expert.city}
        </p>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-gray-100 pt-3 mb-4">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> {expert.jobs} Jobs Done</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-black font-medium">{expert.type} Available</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
            <button 
                onClick={onBook}
                className="bg-black text-white px-6 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors flex items-center gap-2 shadow-lg"
            >
                Book Now <ArrowRight className="w-3 h-3"/>
            </button>
            <button className="px-4 border border-gray-200 rounded hover:bg-white hover:border-black transition-colors bg-white">
                <Phone className="w-4 h-4 text-gray-600" />
            </button>
        </div>
      </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
export function ExpertGuidance() {
  const [searchParams] = useSearchParams();
  const [selectedCity, setSelectedCity] = useState("Pune");
  const [bookingOpen, setBookingOpen] = useState(false);

  // Filter Logic
  const filteredExperts = experts.filter(ex => ex.city === selectedCity || selectedCity === "All");

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      
      {/* 1. Hero Section (Reused Premium Component) */}
      <PageHero 
        title="Your Personal Concierge." 
        subtitle="Connect with verified kitchen specialists for personalized site visits and video consultations."
        label="Expert Guidance"
        image="https://images.unsplash.com/photo-1556912173-3db9963f638f?q=80&w=2070&auto=format&fit=crop"
      />

      {/* 2. Sticky Filter Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            
            <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-sm font-serif italic text-gray-600">
                    Showing {filteredExperts.length} experts available in <span className="text-black not-italic font-bold border-b border-black">{selectedCity}</span>
                </p>
            </div>
            
            {/* Custom Select Dropdown Styling */}
            <div className="relative group">
                <MapPin className="w-4 h-4 text-amber-600 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select 
                    value={selectedCity} 
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="appearance-none bg-gray-50 pl-10 pr-12 py-3 rounded-full text-xs font-bold uppercase tracking-widest border border-gray-200 hover:border-black transition-colors outline-none cursor-pointer text-black"
                >
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Filter className="w-3 h-3 text-gray-400" />
                </div>
            </div>
        </div>
      </div>

      {/* 3. Main Content: Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
        
        {/* Left: Scrollable Expert List */}
        <div className="w-full lg:w-[45%] p-6 md:p-12 bg-white">
            <div className="space-y-8">
                {filteredExperts.length > 0 ? (
                    filteredExperts.map(expert => (
                        <ExpertCard key={expert.id} expert={expert} onBook={() => setBookingOpen(true)} />
                    ))
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-xl">
                        <p className="text-gray-300 font-serif text-xl italic mb-2">No experts found here yet.</p>
                        <button onClick={() => setSelectedCity("Pune")} className="text-amber-600 text-xs font-bold uppercase underline">Try Pune</button>
                    </div>
                )}
            </div>
            
            {/* Footer Note */}
            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                    All experts are verified by Wow Shopping. Site visit charges may apply based on your location.
                </p>
            </div>
        </div>

        {/* Right: Map Visual (Fixed/Sticky on Desktop) */}
        <div className="hidden lg:block lg:w-[55%] bg-gray-100 relative overflow-hidden border-l border-gray-200">
             
             {/* Simulated Map UI - Abstract */}
             <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center grayscale" />
             
             {/* Floating Pins Animation */}
             <div className="absolute top-1/3 left-1/4 animate-bounce duration-[3000ms]">
                <div className="bg-black text-white px-3 py-1 rounded-lg text-xs font-bold shadow-xl flex items-center gap-2">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-6 h-6 rounded-full border border-white" alt="pin" />
                    Arjun is nearby
                </div>
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-black mx-auto"></div>
             </div>

             <div className="absolute bottom-1/3 right-1/3 animate-bounce duration-[4000ms]">
                <div className="bg-white text-black px-3 py-1 rounded-lg text-xs font-bold shadow-xl border border-gray-200 flex items-center gap-2">
                    <img src="https://randomuser.me/api/portraits/women/65.jpg" className="w-6 h-6 rounded-full border border-gray-200" alt="pin" />
                    Priya available
                </div>
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white mx-auto"></div>
             </div>

             {/* Center Callout */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white shadow-2xl">
                 <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
                     <MapPin className="w-6 h-6 text-amber-600" />
                 </div>
                 <h3 className="text-2xl font-serif text-gray-900 mb-1">Map View</h3>
                 <p className="text-gray-500 text-xs uppercase tracking-widest">Select an expert to see service radius</p>
             </div>
        </div>

      </div>

      <BookingConsultation isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}