const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// 👇 Tumhara Direct MongoDB URL
const MONGO_URI = 'mongodb+srv://keshavkuma001_db_user:amit%4083403613@wow-shopping.xdqimif.mongodb.net/wowshop?retryWrites=true&w=majority&appName=wow-shopping'; 

// 👇 SIRF Naye Products (Countertop & Laundry)
// Note: Maine Fridge/Hob hata diye hain taaki wo duplicate na ho jayein.
const newProducts = [
  // --- COUNTERTOP (Category: 'small-appliances') ---
  {
    name: "Pro Food Processor",
    description: "Multi-function food processor for chopping, slicing, and kneading.",
    price: 12500,
    category: "small-appliances",
    type: "Food Processor",
    image: "https://images.unsplash.com/photo-1585514691459-7b561c287666?auto=format&fit=crop&q=80",
    tag: "Best Seller"
  },
  {
    name: "High Power Blender",
    description: "Professional grade blender for smoothies and crushing ice.",
    price: 18000,
    category: "small-appliances",
    type: "Blender",
    image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&q=80",
    tag: "Heavy Duty"
  },
  {
    name: "Retro Toaster 4-Slice",
    description: "Vintage style toaster with defrost and reheat functions.",
    price: 6500,
    category: "small-appliances",
    type: "Toaster",
    image: "https://images.unsplash.com/photo-1584269631227-2c5d1b7d8d2f?auto=format&fit=crop&q=80",
    tag: "Stylish"
  },
  {
    name: "Digital Electric Kettle",
    description: "Temperature control kettle for perfect tea and coffee.",
    price: 4500,
    category: "small-appliances",
    type: "Kettle",
    image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80",
    tag: ""
  },
  {
    name: "Mixer Grinder 750W",
    description: "Powerful motor with 3 jars for Indian cooking.",
    price: 5500,
    category: "small-appliances",
    type: "Mixer Grinder",
    image: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?auto=format&fit=crop&q=80",
    tag: "Essential"
  },

  // --- LAUNDRY (Category: 'washing') ---
  {
    name: "Front Load Washer 8kg",
    description: "AI Direct Drive motor with steam wash technology.",
    price: 38000,
    category: "washing",
    type: "Washing Machine",
    image: "https://images.unsplash.com/photo-1626806749707-e44c82eed727?auto=format&fit=crop&q=80",
    tag: "Best Seller"
  },
  {
    name: "Washer Dryer Combo",
    description: "Wash and dry in one machine. Perfect for compact spaces.",
    price: 55000,
    category: "washing",
    type: "Washing Machine",
    image: "https://plus.unsplash.com/premium_photo-1664372599744-607291a12028?auto=format&fit=crop&q=80",
    tag: "2-in-1"
  },
  {
    name: "Heat Pump Dryer",
    description: "Energy efficient drying that protects delicate fabrics.",
    price: 45000,
    category: "washing",
    type: "Dryer",
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80",
    tag: "Premium"
  },
  {
    name: "Top Load Washer 7kg",
    description: "Soft close lid and multiple wash programs.",
    price: 22000,
    category: "washing",
    type: "Washing Machine",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80",
    tag: "Value"
  },
  {
    name: "Smart Laundry Tower",
    description: "Stacked washer and dryer unit with central control panel.",
    price: 120000,
    category: "washing",
    type: "Washing Machine",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
    tag: "Luxury"
  }
];

const seedDB = async () => {
  try {
    console.log("⏳ Connecting to DB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected!");

    // ⚠️ Maine delete wali line hata di hai taaki purana data safe rahe
    // await Product.deleteMany({}); 

    console.log(`⏳ Appending ${newProducts.length} NEW products (Countertop & Laundry)...`);
    
    // Sirf naye products add honge, purane wahi rahenge
    await Product.insertMany(newProducts);
    
    console.log(`🎉 Success! Added new items without deleting old data.`);
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

seedDB();