import { X, MapPin, DollarSign, Tag, MessageSquare, Phone, Mail, User } from "lucide-react";
import { useState, useEffect } from "react";
import KitchenPremium from "../assests/Kitchen_Design.jpg";

export function BookingConsultation({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    projectType: "",
    budget: "",
    brands: [],
    message: ""
  });
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoadingLocation(true);
      fetchLocation();
    }
  }, [isOpen]);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            setFormData(prev => ({
              ...prev,
              location: `${data.city || ""}, ${data.countryName || ""}`.trim()
            }));
          } catch (error) {
            console.log("Location fetch failed:", error);
            setFormData(prev => ({ ...prev, location: "" }));
          } finally {
            setLoadingLocation(false);
          }
        },
        () => {
          setLoadingLocation(false);
          setFormData(prev => ({ ...prev, location: "" }));
        }
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setFormData(prev => {
      const brands = prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Premium Consultation Form:", formData);
    onClose();
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      projectType: "",
      budget: "",
      brands: [],
      message: ""
    });
  };

  if (!isOpen) return null;

  return (
    // 1) Overlay full screen + center + scroll safe
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      {/* 2) Card height limit + inner scroll */}
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto  bg-white/90 shadow-2xl ring-1 ring-black/5">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-red-500 hover:shadow transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left image / info */}
          <div className="relative hidden lg:block bg-slate-900/95 text-white">
            <img
              src={KitchenPremium}
              alt="Modern kitchen"
              className="h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/30" />
            <div className="absolute inset-0 flex flex-col justify-between p-8 pb-10">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  Modular Kitchen Studio
                </p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight">
                  Design your
                  <br />
                  dream kitchen.
                </h2>
                <p className="mt-3 text-sm text-slate-200">
                  Free expert consultation with curated brands and
                  tailored layouts for your space.
                </p>
              </div>

              <div className="space-y-3 text-sm mt-6">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Free consultation & layout planning</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span>50+ premium appliance & hardware brands</span>
                </div>
                <div className="flex items-center gap-2 pb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  <span>End-to-end design to installation support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="p-6 sm:p-8 lg:p-10 pb-8">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-slate-900">
                Book a free consultation
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Share your details and a kitchen expert will connect with you
                within 12 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1.5">
                    <User className="h-3.5 w-3.5 text-emerald-500" />
                    Full name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1.5">
                    <Mail className="h-3.5 w-3.5 text-emerald-500" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Phone + Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1.5">
                    <Phone className="h-3.5 w-3.5 text-emerald-500" />
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                    Location {loadingLocation && (
                      <span className="text-[10px] text-emerald-500">
                        (detecting...)
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* Project type + Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1.5">
                    <Tag className="h-3.5 w-3.5 text-emerald-500" />
                    Project type *
                  </label>
                  <select
                    name="projectType"
                    required
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Select project type</option>
                    <option value="apartment">Apartment kitchen</option>
                    <option value="villa">Villa / independent house</option>
                    <option value="office">Office pantry</option>
                    <option value="renovation">Kitchen renovation</option>
                    <option value="commercial">Commercial kitchen</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                    Budget range *
                  </label>
                  <select
                    name="budget"
                    required
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Select budget</option>
                    <option value="1-3L">Upto 2 Lakhs</option>
                    <option value="3-7L">₹2-5 Lakhs</option>
                    <option value="7-15L">₹5-10 Lakhs</option>
                    <option value="15-30L">₹10-20 Lakhs</option>
                    <option value="30L+">No Bar </option>
                  </select>
                </div>
              </div>

              {/* Brands */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1.5">
                  <Tag className="h-3.5 w-3.5 text-emerald-500" />
                  Preferred brands (optional)
                </label>
                <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
                  {["Siemens", "Hafele", "Blaupunkt", "Kaff", "Smeg", "Bosch" , "Elica" , "Faber" , "Carasyl" , "Hindware"].map(
                    (brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm hover:border-emerald-400 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={brand}
                          checked={formData.brands.includes(brand)}
                          onChange={handleBrandChange}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
                        />
                        <span>{brand}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                  Requirements / notes
                </label>
                <textarea
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  placeholder="Tell us about your layout, appliances, timeline or any preferences..."
                />
              </div>

              {/* CTA */}
              <div className="space-y-2 pt-1 pb-1">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg hover:bg-black transition"
                >
                  Schedule free consultation
                </button>
                <p className="text-[11px] text-slate-500 text-center">
                  By submitting, you agree to be contacted by our design team.
                  No spam, no obligations.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
