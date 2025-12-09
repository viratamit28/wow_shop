import React from 'react';
import { Truck, RefreshCw, Shield, Headphones, CheckCircle } from 'lucide-react';

const FreeShippingFeatures = () => {
  const features = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Free Shipping",
      subtitle: "No Extra Costs"
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: "Easy Replacements",
      subtitle: "Return with Ease"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Checkout",
      subtitle: "Secure Payment"
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "24x7 Support",
      subtitle: "Here to Help"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Genuine Products",
      subtitle: "Original Brand Products"
    }
  ];

  return (
    <div className="w-full bg-white border-b border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="p-2 bg-white rounded-lg">
                  <div className="text-yellow-500">
                    {feature.icon}
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FreeShippingFeatures;