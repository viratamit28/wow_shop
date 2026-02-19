const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  
  // 🔥 New Field: Electronics ke liye Model Number zaruri hai
  model: { type: String, required: true, unique: true }, 

  brand: { type: String, default: "Generic" },
  
  description: { type: String, default: "No description available." },
  
  category: { type: String, required: true }, // e.g., 'ovens'
  type: { type: String, default: "Kitchen Appliance" }, 
  
  price: { type: Number, required: true },
  
  // 🔥 Change: String -> [String] (Array) taaki Multiple Images aa sakein
  image: { type: [String], required: true }, 
  
  rating: { type: Number, default: 4.5 },
  tag: { type: String, default: "" },      
  
  // 🔥 Specs: Table Data ke liye Map
  specs: { type: Map, of: String }         
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);