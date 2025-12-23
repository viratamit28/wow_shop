const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true }, // e.g., 'ovens', 'hobs'
  type: { type: String, required: true },     // e.g., 'Built-in Oven'
  price: { type: Number, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  tag: { type: String, default: "" },         // e.g., 'Best Seller'
  brand: { type: String, default: "Generic" }
});

module.exports = mongoose.model('Product', ProductSchema);