import React from "react";

const categories = [
  {
    name: "Built-in Ovens",
    count: "45+ models",
    popular: true,
    image: "https://t3.ftcdn.net/jpg/01/87/69/96/240_F_187699611_9ggLLhbG68CTMxn9lgiy8Ocbeg584m33.jpg"
  },
  {
    name: "Induction Hobs",
    count: "38+ models",
    popular: true,
    image: "https://t4.ftcdn.net/jpg/03/32/60/47/240_F_332604715_bJAtd1mDvWn7ERjttANsEsN7PG8xRSNt.jpg"
  },
  {
    name: "Kitchen Hoods",
    count: "52+ models",
    popular: true,
    image: "https://t3.ftcdn.net/jpg/04/32/15/18/240_F_432151804_IANWohtcbdyJ09js0FvgUHQ3o77blQdu.jpg"
  },
  {
    name: "Dishwashers",
    count: "32+ models",
    popular: true,
    image: "https://t4.ftcdn.net/jpg/01/21/16/83/240_F_121168379_mfQmksxFEcIRZNdL02PhQ5S3VMmiU8z6.jpg"
  },
  {
    name: "Coffee Machines",
    count: "24+ models",
    popular: true,
    image: "https://t3.ftcdn.net/jpg/11/49/97/50/240_F_1149975059_6fl8zhmZJNWx9fThKPfyid5L8IgtLnk3.jpg"
  },
  {
    name: "Chillers",
    count: "18+ models",
    popular: true,
    image: "https://t3.ftcdn.net/jpg/12/18/35/16/240_F_1218351609_8UhwS2ZSK3lhQjX7C8r9lEvN4p6F7o4g.jpg"
  },
  {
    name: "Microwaves",
    count: "28+ models",
    popular: false,
    image: "https://t4.ftcdn.net/jpg/09/66/12/45/240_F_966124544_GbQmJ0kBFcnUrXjO6MhZrJeeN9CN76W3.jpg"
  },
  {
    name: "Warming Drawers",
    count: "16+ models",
    popular: true,
    image: "https://t4.ftcdn.net/jpg/15/95/76/23/240_F_1595762399_uZbPAOIvvSEfIR78PCLMHXVwPqdCYMdG.jpg"
  }
];

export function Categories() {
  return (
    <section className="py-4 md:py-14 bg-white" id="categories">
      <div className="container mx-auto px-6 lg:px-8 xl:px-12 max-w-9xl">
        <div className="text-center mb-8">
         <h2 className="text-5xl md:text-6xl font-semibold mb-6">
           Built-in <span className="font-bold bg-gradient-to-r from-orange-500 to-pink-900 bg-clip-text text-transparent">Appliances</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Every appliance designed to integrate seamlessly into your modular kitchen with premium aesthetics
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div 
              key={category.name} 
              className="group cursor-pointer relative overflow-hidden  transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white border border-pink-200"
            >
              {/* Popular Badge */}
              {category.popular && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-orange-900 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm">
                    Popular
                  </div>
                </div>
              )}
              
              {/* Content */}
              <div className="relative z-10 p-6">
                {/* Image Container */}
                <div className="relative mb-4 h-48 w-full rounded-xl overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Text Content */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-500 mb-5 text-sm font-medium">
                    {category.count}
                  </p>

                  {/* CTA Button */}
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 group-hover:text-orange-700 transition-colors duration-300 bg-orange-100  px-5 py-2.5 border border-orange-100">
                    View Collection
                    <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}