import React, { useState } from 'react';

export default function VisitUs() {
  const [selectedBranch, setSelectedBranch] = useState(0);

  const branches = [
    {
      id: 1,
      name: "Main Store - Downtown",
      address: "123 Kitchen Street, Downtown District",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      phone: "+91 22 1234 5678",
      email: "downtown@kitchenappliances.com",
      timings: "10:00 AM - 9:00 PM",
      days: "Monday - Sunday",
      coordinates: { lat: 19.0760, lng: 72.8777 },
      features: ["Free Parking", "Demo Kitchen", "Service Center", "Coffee Bar"]
    },
    {
      id: 2,
      name: "Westside Mall Branch",
      address: "Westside Mall, 2nd Floor, Western Express Highway",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400063",
      phone: "+91 22 2345 6789",
      email: "westside@kitchenappliances.com",
      timings: "11:00 AM - 10:00 PM",
      days: "Monday - Sunday",
      coordinates: { lat: 19.1077, lng: 72.8363 },
      features: ["Mall Parking", "Live Cooking Demos", "Kids Play Area"]
    },
    {
      id: 3,
      name: "Northern Division Store",
      address: "45 Northern Avenue, Near Metro Station",
      city: "Delhi",
      state: "Delhi",
      pincode: "110002",
      phone: "+91 11 3456 7890",
      email: "delhi@kitchenappliances.com",
      timings: "10:30 AM - 8:30 PM",
      days: "Monday - Saturday",
      coordinates: { lat: 28.6139, lng: 77.2090 },
      features: ["Ample Parking", "Expert Consultation", "Installation Services"]
    }
  ];

  const currentBranch = branches[selectedBranch];

  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light mb-4">
            Visit <span className="font-semibold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Our Stores</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Experience our premium kitchen appliances in person at our conveniently located stores
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Map */}
          <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
            <div className="h-96 lg:h-full min-h-[400px] bg-gradient-to-br from-blue-50 to-teal-50 relative">
              {/* Mock Map - In real implementation, you would use Google Maps or similar */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {currentBranch.name}
                  </h3>
                  <p className="text-gray-600 max-w-xs mx-auto">
                    Interactive Map - {currentBranch.city}, {currentBranch.state}
                  </p>
                  <div className="mt-4 flex justify-center space-x-4">
                    <button className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition">
                      Get Directions
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                      Street View
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition">
                  <span className="text-lg font-semibold">+</span>
                </button>
                <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition">
                  <span className="text-lg font-semibold">-</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Store Information */}
          <div className="space-y-6">
            {/* Branch Selector */}
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {branches.map((branch, index) => (
                <button
                  key={branch.id}
                  onClick={() => setSelectedBranch(index)}
                  className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                    selectedBranch === index
                      ? 'bg-black text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {branch.city}
                </button>
              ))}
            </div>

            {/* Store Details */}
            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {currentBranch.name}
              </h3>
              
              {/* Address */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Address</p>
                    <p className="text-gray-600">{currentBranch.address}</p>
                    <p className="text-gray-600">{currentBranch.city}, {currentBranch.state} - {currentBranch.pincode}</p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Phone</p>
                    <p className="text-gray-600">{currentBranch.phone}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Email</p>
                    <p className="text-gray-600">{currentBranch.email}</p>
                  </div>
                </div>

                {/* Timings */}
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Store Hours</p>
                    <p className="text-gray-600">{currentBranch.timings}</p>
                    <p className="text-gray-600">{currentBranch.days}</p>
                  </div>
                </div>
              </div>

              {/* Store Features */}
              <div className="mt-6">
                <p className="text-gray-700 font-medium mb-3">Store Features</p>
                <div className="flex flex-wrap gap-2">
                  {currentBranch.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button className="flex-1 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Call Store</span>
                </button>
                <button className="flex-1 py-3 border border-black text-black rounded-xl font-medium hover:bg-gray-50 transition flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Schedule Visit</span>
                </button>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Before You Visit</h4>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Free parking available for customers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Professional product demonstrations available</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Expert consultation for kitchen planning</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Same-day delivery available for in-stock items</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}