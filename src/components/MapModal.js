import { X, MapPin, Phone, Clock } from "lucide-react";
import { Button } from "./ui/button";

export function MapModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Studio address and coordinates
  const studioLocation = {
    address: "Experience Studio, Pune, Maharashtra, India",
    lat: 18.5204,
    lng: 73.8567,
    phone: "+91 98765 43210",
    hours: "Mon-Sat: 10:00 AM - 7:00 PM"
  };

  // Google Maps embed URL
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(studioLocation.address)}&center=${studioLocation.lat},${studioLocation.lng}&zoom=15`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 relative max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-teal-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Our Experience Studio</h2>
              <p className="text-gray-600">Visit us for a personalized consultation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Map */}
          <div className="lg:w-2/3 h-96 lg:h-auto">
            <div className="w-full h-full bg-gray-200 relative">
              {/* Google Maps Embed */}
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
              {/* Fallback if no API key */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center text-gray-600">
                  <MapPin className="h-12 w-12 mx-auto mb-2 text-teal-600" />
                  <p>Map loading...</p>
                  <p className="text-sm">Experience Studio, Pune</p>
                </div>
              </div>
            </div>
          </div>

          {/* Studio Info */}
          <div className="lg:w-1/3 p-6 bg-gray-50">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Studio Information</h3>
              
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-teal-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Address</p>
                  <p className="text-gray-600 text-sm">{studioLocation.address}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <a 
                    href={`tel:${studioLocation.phone}`}
                    className="text-gray-600 text-sm hover:text-teal-600 transition-colors"
                  >
                    {studioLocation.phone}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-teal-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Business Hours</p>
                  <p className="text-gray-600 text-sm">{studioLocation.hours}</p>
                  <p className="text-gray-600 text-sm">Sunday: Closed</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Button 
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={() => {
                    // Open in Google Maps
                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(studioLocation.address)}`, '_blank');
                  }}
                >
                  Open in Google Maps
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full border-teal-600 text-teal-600 hover:bg-teal-50"
                  onClick={() => {
                    // Open directions
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(studioLocation.address)}`, '_blank');
                  }}
                >
                  Get Directions
                </Button>

                <Button 
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    window.open(`tel:${studioLocation.phone}`);
                  }}
                >
                  Call Now
                </Button>
              </div>

              {/* Additional Info */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Free Parking</strong> available • <strong>Wheelchair accessible</strong> • 
                  <strong> Product demonstrations</strong> • <strong>Expert consultations</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}