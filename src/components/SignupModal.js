import React, { useState } from 'react';
// 👇 Is line mein 'Check' add kar diya hai
import { X, Mail, Lock, User, Loader2, MapPin, Upload, Camera, Check } from 'lucide-react';
import axios from 'axios';

export function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    lat: '',
    lng: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Handle Text Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // Preview dikhane ke liye
    }
  };

  // Handle Location Detection
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Coordinates set karo
        setFormData(prev => ({ ...prev, lat: latitude, lng: longitude }));

        // Free API se Address pata karo (Reverse Geocoding)
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (res.data && res.data.display_name) {
            setFormData(prev => ({ ...prev, address: res.data.display_name }));
          }
        } catch (error) {
          console.error("Address fetch failed", error);
        }
        setLocationLoading(false);
      },
      (error) => {
        alert("Unable to retrieve your location");
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Data bhejne ke liye FormData object banana padega (kyunki image hai)
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('address', formData.address);
      data.append('lat', formData.lat);
      data.append('lng', formData.lng);
      if (profileImage) {
        data.append('profileImage', profileImage);
      }

      await axios.post('http://localhost:5000/api/user/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Account Created Successfully! Please Login.');
      setLoading(false);
      onSwitchToLogin();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-sm text-gray-500">Join us for a premium experience</p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* --- Profile Photo Upload --- */}
            <div className="flex justify-center mb-2">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                  <Camera className="w-6 h-6" />
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 mb-4">Upload Profile Photo</p>

            {/* Name */}
            <div className="space-y-1">
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text" name="name" required value={formData.name} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="Full Name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email" name="email" required value={formData.email} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="Email Address"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password" name="password" required value={formData.password} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="Password"
                />
              </div>
            </div>

            {/* Address & Location */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase">Address</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text" name="address" required value={formData.address} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                    placeholder="Enter or Detect Location"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={detectLocation}
                  disabled={locationLoading}
                  className="bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 transition flex items-center justify-center min-w-[50px]"
                  title="Detect My Location"
                >
                  {locationLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                </button>
              </div>
              {formData.lat && <p className="text-[10px] text-green-600 flex items-center gap-1"><Check className="w-3 h-3"/> Location Coordinates Captured</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-all flex justify-center items-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button onClick={onSwitchToLogin} className="font-bold text-teal-600 hover:underline">Log In</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}