const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../middleware/uploadMiddleware'); // Image Upload Middleware Import kiya

// =========================================================
// ROUTE 1: GET ALL PRODUCTS (Filter + Search Support)
// GET: /api/products?category=ovens&search=bosch
// =========================================================
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // --- 1. SEARCH LOGIC (Agar user kuch search kare) ---
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Name me dhoondo (Case insensitive)
    }

    // --- 2. CATEGORY LOGIC (Smart Filter) ---
    if (category) {
      let dbCategory = category;
      const lowerCat = category.toLowerCase();

      // 🧠 SMART MAPPING
      if (lowerCat === 'hoods') dbCategory = 'Chimneys';
      else if (lowerCat === 'ovens') dbCategory = 'Ovens';
      else if (lowerCat === 'hobs') dbCategory = 'Hobs';
      else if (lowerCat === 'dishwashers') dbCategory = 'Dishwashers';
      else if (lowerCat === 'refrigerators') dbCategory = 'Refrigerators';
      else if (lowerCat === 'washing') dbCategory = 'washing';
      else if (lowerCat === 'countertop') dbCategory = 'Countertop';

      // Category ko query me add karo
      query.category = { $regex: new RegExp("^" + dbCategory + "$", "i") };
    }

    // Database se data mangwao
    const products = await Product.find(query);
    res.json(products);

  } catch (err) {
    console.error("Error in Get All Products:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// =========================================================
// ROUTE 2: ADD SINGLE PRODUCT (UPDATED FOR SPECS & BRAND)
// POST: /api/products/add
// =========================================================


router.post('/add', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    let parsedSpecs = {};
    if (req.body.specs) {
        try { parsedSpecs = JSON.parse(req.body.specs); } catch (e) {}
    }

    const product = new Product({
        name: req.body.name,
        brand: req.body.brand,
        category: req.body.category,
        type: req.body.category,
        price: req.body.price,
        description: req.body.description,
        
        // ❌ PURANA (Delete this): image: req.file.filename,
        // ✅ NAYA (Add this): Pura URL save karo
        image: req.file.path, 
        
        specs: parsedSpecs
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// =========================================================
// ROUTE 3: GET SINGLE PRODUCT BY ID (With Debug Logs)
// GET: /api/products/:id
// =========================================================
router.get('/:id', async (req, res) => {
  try {
    // 1. Log ID Check
    console.log("🔍 [DEBUG] Searching for Product ID:", req.params.id);

    // 2. Database Query
    const product = await Product.findById(req.params.id);
    
    // 3. Result Check
    if (!product) {
        console.log("❌ [DEBUG] Product NOT FOUND in Database for this ID.");
        return res.status(404).json({ message: "Product not found" });
    }
    
    console.log("✅ [DEBUG] Product Found:", product.name);
    res.json(product);

  } catch (err) {
    console.error("🔥 [DEBUG] Error:", err.message);
    
    // Agar ID ka format galat hai (Invalid MongoDB ID)
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: "Invalid Product ID Format" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;