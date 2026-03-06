const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../middleware/uploadMiddleware');

// =========================================================
// ROUTE 1: GET ALL PRODUCTS (Dynamic Header Filters)
// GET: /api/products?category=Cooking & Baking&type=Ovens
// =========================================================
router.get('/', async (req, res) => {
  try {
    // 1. Frontend se aane wale dono filters ko pakdo
    const { category, type, search } = req.query; 
    let query = {};

    // 2. SEARCH LOGIC (Agar user kuch search bar mein type kare)
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Name me dhoondo (Case insensitive)
    }

    // 3. CATEGORY LOGIC (Exact match, case-insensitive)
    if (category) {
       // Ab hardcoded logic nahi chahiye, direct match karenge
       query.category = { $regex: new RegExp("^" + category + "$", "i") };
    }

    // 4. TYPE LOGIC (Jaise 'Ovens', 'Microwaves' jo Mega Menu se aayega)
    if (type) {
       query.type = { $regex: new RegExp("^" + type + "$", "i") };
    }

    console.log("🔍 [DEBUG] Current Query Filters:", query);

    // Database se data mangwao
    const products = await Product.find(query);
    res.json(products);

  } catch (err) {
    console.error("Error in Get All Products:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// =========================================================
// ROUTE 2: ADD SINGLE PRODUCT (FIXED FOR SCHEMA COMPATIBILITY)
// POST: /api/products/add
// =========================================================
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    // 🔥 BUG FIX 1: Schema me 'model' required hai, toh validation lagani padegi
    if (!req.body.model) {
        return res.status(400).json({ message: "Model number is required" });
    }

    let parsedSpecs = {};
    if (req.body.specs) {
        try { parsedSpecs = JSON.parse(req.body.specs); } catch (e) { console.log("Specs parsing error"); }
    }

    const product = new Product({
        name: req.body.name,
        model: req.body.model, // ✅ ADDED: Model number (Unique)
        brand: req.body.brand,
        category: req.body.category,
        type: req.body.type || req.body.category, // ✅ FIXED: Frontend se aane wala type set hoga
        price: req.body.price,
        description: req.body.description,
        
        // 🔥 BUG FIX 2: Schema me image array [String] hai, isliye isko array me daalna padega
        image: [req.file.path], 
        
        specs: parsedSpecs
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);

  } catch (err) {
    console.error("🔥 Add Product Error:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// =========================================================
// ROUTE 3: GET SINGLE PRODUCT BY ID 
// GET: /api/products/:id
// =========================================================
router.get('/:id', async (req, res) => {
  try {
    console.log("🔍 [DEBUG] Searching for Product ID:", req.params.id);
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        console.log("❌ [DEBUG] Product NOT FOUND in Database for this ID.");
        return res.status(404).json({ message: "Product not found" });
    }
    
    console.log("✅ [DEBUG] Product Found:", product.name);
    res.json(product);

  } catch (err) {
    console.error("🔥 [DEBUG] Error:", err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: "Invalid Product ID Format" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;