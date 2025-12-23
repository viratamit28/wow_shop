import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 👇 Import added for navigation

// Data Structure
const categoriesData = [
  {
    id: "ovens",
    name: "Built-in Ovens",
    className: "md:col-span-2 md:row-span-2", // Large Box
    image: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=2070&auto=format&fit=crop",
    items: ["Built-in Oven", "Steam Combi Oven", "Microwave", "Combi Microwave"]
  },
  {
    id: "hobs",
    name: "Premium Hobs",
    className: "md:col-span-2 md:row-span-1", // Wide Box
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80",
    items: ["3/4/5 Burner Hobs", "Induction", "Teppanyaki", "Deep Fryer"]
  },
  {
    id: "hoods",
    name: "Chimneys",
    className: "md:col-span-1 md:row-span-2", // Tall Box
    image: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&q=80",
    items: ["Wall Mounted", "Island Hood", "Ceiling Mounted", "Downdraft"]
  },
  {
    id: "refrigerators",
    name: "Refrigerators",
    className: "md:col-span-1 md:row-span-1",
    image: "https://images.unsplash.com/photo-1571175443880-49e1d58b95da?auto=format&fit=crop&q=80",
    items: ["Freestanding", "Built-in"]
  },
  {
    id: "dishwashers",
    name: "Dishwashers",
    className: "md:col-span-1 md:row-span-1",
    image: "https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?auto=format&fit=crop&q=80",
    items: ["Freestanding", "Built-in"]
  },
  {
    id: "small-appliances",
    name: "Countertop",
    className: "md:col-span-2 md:row-span-1", // Wide Box
    image: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?auto=format&fit=crop&q=80",
    items: ["Food Processor", "Mixer Grinder", "Blender", "Toaster", "Kettle"]
  },
  {
    id: "washing",
    name: "Laundry",
    className: "md:col-span-1 md:row-span-1",
    image: "https://images.unsplash.com/photo-1626806749707-e44c82eed727?auto=format&fit=crop&q=80",
    items: ["Washing Machine", "Dryer"]
  }
];

export function Categories() {
  const navigate = useNavigate(); // 👇 Hook initialized

  return (
    <section className="py-20 bg-black text-white" id="categories">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Minimal Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-8">
          <div>
            <h2 className="text-4xl md:text-7xl font-script tracking-tight mb-2">
              Our <span className="font-script  text-amber-500">Collection</span>
            </h2>
            <p className="text-white/50 max-w-md">
              Discover built-in excellence designed for the modern culinary artist.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-amber-500 transition-colors mt-4 md:mt-0">
            Download Catalogue <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* The Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-4">
          
          {categoriesData.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => navigate(`/category/${cat.id}`)} // 👇 Click Event
              className={`relative group rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 cursor-pointer ${cat.className}`}
            >
              {/* Image Layer */}
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-40 transition-all duration-700 ease-in-out"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

              {/* Content Layer */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                
                {/* Top Right Arrow */}
                <div className="flex justify-end">
                  <span className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <ArrowUpRight className="w-5 h-5" />
                  </span>
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-serif text-white mb-2 group-hover:translate-y-0 transition-transform duration-300">
                    {cat.name}
                  </h3>
                  
                  {/* The List (Hidden by default, slides up nicely) */}
                  <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500 ease-in-out">
                    <div className="pt-2 border-t border-white/20">
                      <div className="flex flex-wrap gap-2 pt-2">
                        {cat.items.map((item, idx) => (
                          <span key={idx} className="text-[11px] uppercase tracking-wider border border-white/20 px-2 py-1 rounded-md text-white/80 hover:bg-white hover:text-black transition-colors">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Subtitle (Visible only when NOT hovering) */}
                  <p className="text-white/50 text-sm group-hover:hidden transition-opacity duration-300">
                    {cat.items.length} Variants
                  </p>
                </div>
              </div>
            </div>
          ))}

        </div>
        
        {/* Mobile Only Button */}
        <div className="mt-8 text-center md:hidden">
            <button className="px-8 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest">
                View Full Catalogue
            </button>
        </div>

      </div>
    </section>
  );
}