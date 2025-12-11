import React from "react";
import { MoveRight, Star } from "lucide-react"; // npm install lucide-react

const categories = [
  {
    name: "Built-in Ovens",
    count: "45+ Models",
    popular: true,
    image: "https://t3.ftcdn.net/jpg/01/87/69/96/240_F_187699611_9ggLLhbG68CTMxn9lgiy8Ocbeg584m33.jpg"
  },
  {
    name: "Induction Hobs",
    count: "38+ Models",
    popular: true,
    image: "https://t4.ftcdn.net/jpg/03/32/60/47/240_F_332604715_bJAtd1mDvWn7ERjttANsEsN7PG8xRSNt.jpg"
  },
  {
    name: "Kitchen Hoods",
    count: "52+ Models",
    popular: true,
    image: "https://t3.ftcdn.net/jpg/04/32/15/18/240_F_432151804_IANWohtcbdyJ09js0FvgUHQ3o77blQdu.jpg"
  },
  {
    name: "Dishwashers",
    count: "32+ Models",
    popular: true,
    image: "https://t4.ftcdn.net/jpg/01/21/16/83/240_F_121168379_mfQmksxFEcIRZNdL02PhQ5S3VMmiU8z6.jpg"
  },
  {
    name: "Coffee Machines",
    count: "24+ Models",
    popular: false,
    image: "https://t3.ftcdn.net/jpg/11/49/97/50/240_F_1149975059_6fl8zhmZJNWx9fThKPfyid5L8IgtLnk3.jpg"
  },
  {
    name: "Chillers",
    count: "18+ Models",
    popular: false,
    image: "https://t3.ftcdn.net/jpg/12/18/35/16/240_F_1218351609_8UhwS2ZSK3lhQjX7C8r9lEvN4p6F7o4g.jpg"
  },
  {
    name: "Microwaves",
    count: "28+ Models",
    popular: false,
    image: "https://t4.ftcdn.net/jpg/09/66/12/45/240_F_966124544_GbQmJ0kBFcnUrXjO6MhZrJeeN9CN76W3.jpg"
  },
  {
    name: "Warming Drawers",
    count: "16+ Models",
    popular: false,
    image: "https://t4.ftcdn.net/jpg/15/95/76/23/240_F_1595762399_uZbPAOIvvSEfIR78PCLMHXVwPqdCYMdG.jpg"
  }
];

export function Categories() {
  return (
    <section className="py-24 bg-white" id="categories">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-orange-600 font-bold tracking-[0.2em] text-xs uppercase mb-3 block">
            Premium Selection
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
            Curated Categories
          </h2>
          <p className="text-gray-500 text-lg font-light leading-relaxed">
            Explore our exclusive range of built-in appliances designed to elevate your culinary experience.
          </p>
        </div>

        {/* Categories Grid - Tall Catalog Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div 
              key={category.name} 
              className="group relative h-[420px] rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Background Image */}
              <div className="absolute inset-0 bg-gray-900">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover opacity-90 transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:opacity-100"
                />
              </div>

              {/* Gradient Overlay (For Text Readability) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-300" />

              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                 {/* Count Badge */}
                 <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {category.count}
                 </span>

                 {/* Popular Badge */}
                 {category.popular && (
                   <div className="bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-amber-500/20">
                      <Star className="w-3 h-3 fill-black" /> Popular
                   </div>
                 )}
              </div>

              {/* Bottom Content Area */}
              <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                
                {/* Title Line */}
                <div className="border-l-2 border-amber-500 pl-4 mb-4">
                   <h3 className="text-2xl font-serif text-white leading-tight">
                     {category.name}
                   </h3>
                </div>

                {/* Hidden Description / Button (Reveals on Hover) */}
                <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-500 ease-out">
                   <p className="text-gray-300 text-xs font-light mb-4">
                      Discover the latest models with advanced technology.
                   </p>
                   <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                      Explore Collection <MoveRight className="w-4 h-4" />
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
           <button className="px-10 py-4 border border-gray-200 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-black hover:text-white hover:border-black transition-all duration-300">
              Download Full Catalog
           </button>
        </div>

      </div>
    </section>
  );
}