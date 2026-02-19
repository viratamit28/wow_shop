// src/pages/AddProductPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Trash, Save } from 'lucide-react'; // Icons for better UI

const AddProductPage = () => {
  // 1. Basic Info State
  const [formData, setFormData] = useState({
    name: '',
    brand: '', // 🔥 Brand Add kiya
    price: '',
    category: '',
    description: '',
    image: null 
  });

  // 2. 🔥 Specs State (Excel Features ke liye)
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [loading, setLoading] = useState(false);

  // Input Handler
  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // 🔥 Spec Handlers (Table Data Logic)
  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const addSpecRow = () => setSpecs([...specs, { key: "", value: "" }]);
  
  const removeSpecRow = (index) => {
    const newSpecs = specs.filter((_, i) => i !== index);
    setSpecs(newSpecs);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('brand', formData.brand); // Brand bheja
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('image', formData.image);

    // 🔥 Specs array ko Object banakar JSON String me convert karna
    const specsObject = {};
    specs.forEach(item => {
        if(item.key && item.value) {
            specsObject[item.key] = item.value;
        }
    });
    data.append('specs', JSON.stringify(specsObject));

    try {
      const res = await axios.post('http://localhost:5000/api/products/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('✅ Product Added Successfully!');
      console.log(res.data);
      
      // Reset Form
      setFormData({ name: '', brand: '', price: '', category: '', description: '', image: null });
      setSpecs([{ key: "", value: "" }]);

    } catch (err) {
      console.error(err);
      alert('❌ Error adding product. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-xl border border-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">Add Premium Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Name & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Name (Model)</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black" required placeholder="e.g. Smeg Portofino Cooker" />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black" required placeholder="e.g. Smeg" />
            </div>
        </div>

        {/* Row 2: Price & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg" required />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg bg-white" required>
                  <option value="">Select Category</option>
                  <option value="Cookers">Cookers</option>
                  <option value="Ovens">Ovens</option>
                  <option value="Chimneys">Chimneys</option>
                  <option value="Hobs">Hobs</option>
                  <option value="Dishwashers">Dishwashers</option>
                  <option value="Refrigerators">Refrigerators</option>
                </select>
            </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Short Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full border border-gray-300 p-3 rounded-lg" placeholder="Brief intro..."></textarea>
        </div>

        {/* 🔥 Technical Specs Section (Excel Data Entry) */}
        <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    📄 Technical Specifications
                    <span className="text-xs font-normal text-gray-500 bg-white px-2 py-1 rounded border">(Add Excel Data Here)</span>
                </h3>
                <button type="button" onClick={addSpecRow} className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:bg-blue-50 px-3 py-1 rounded transition">
                    <Plus className="w-4 h-4" /> Add Feature
                </button>
            </div>
            
            <div className="space-y-3">
                {specs.map((item, index) => (
                    <div key={index} className="flex gap-3 items-center animate-fade-in">
                        <span className="text-xs text-gray-400 font-mono w-6">{index + 1}.</span>
                        <input 
                            type="text" 
                            placeholder="Feature (e.g. Color)" 
                            value={item.key} 
                            onChange={(e) => handleSpecChange(index, 'key', e.target.value)} 
                            className="flex-1 border p-2 rounded shadow-sm focus:border-blue-500 outline-none"
                        />
                        <input 
                            type="text" 
                            placeholder="Value (e.g. Black)" 
                            value={item.value} 
                            onChange={(e) => handleSpecChange(index, 'value', e.target.value)} 
                            className="flex-1 border p-2 rounded shadow-sm focus:border-blue-500 outline-none"
                        />
                        {specs.length > 1 && (
                            <button type="button" onClick={() => removeSpecRow(index)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition">
                                <Trash className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
        
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
          <input type="file" name="image" onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800" required />
        </div>
        
        {/* Submit Button */}
        <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2">
          {loading ? 'Uploading...' : <><Save className="w-5 h-5" /> Save Product</>}
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;