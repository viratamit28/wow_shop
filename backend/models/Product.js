const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  // 🔥 Core Details (Excel headers ke sath exactly matched)
  Product_Name: { type: String, required: true },
  Model_Number: { type: String, required: true, unique: true }, // Unique zaruri hai electronics ke liye
  Brand: { type: String, default: "Generic" },
  Category: { type: String, required: true }, // e.g., 'Mixer Grinder', 'Ovens'

  // 🔥 Pricing & Inventory
  MRP: { type: Number, required: true },
  Selling_Price: { type: Number, required: true },
  Stock_Quantity: { type: Number, required: true, default: 0 },

  // 🔥 Kitchen Appliance Specific Specs (Jo Excel me the)
  material_finish: { type: String, default: "Not specified" },
  power_consumption: { type: String, default: "Not specified" },
  Dimensions_cm: { type: String, default: "Not specified" },
  Capacity: { type: String, default: "Not specified" },
  Installation_Type: { type: String, default: "Not specified" },
  Technical_Specifications: { type: String, default: "Not specified" },
  Warranty_Details: { type: String, default: "No warranty info" },

  // 🔥 Media & Ratings
  Image: { type: [String], required: true }, // Array banaya taaki multiple images aa sakein
  average_rating: { type: Number, default: 0 }

}, { timestamps: true }); // createdAt aur updatedAt automatically handle honge

module.exports = mongoose.model('Product', ProductSchema);