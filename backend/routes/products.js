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
    // 🔥 FIX 1: 'brand' ko bhi query se extract kar liya hai
    const { category, type, search, brand } = req.query; 
    let query = {};

    if (search) {
      query.Product_Name = { $regex: search, $options: "i" }; 
    }

    // 🔥 FIX 2: '^' aur '$' (Exact Match) hata diya. 
    // Excel data mein extra spaces ho sakte hain, isliye Partial Match best hai.
    if (category) {
       query.Category = { $regex: category, $options: "i" };
    }

    if (type) {
       query.Category = { $regex: type, $options: "i" };
    }

    // 🔥 FIX 3: Backend mein hi Brand filtering add kar di (Brand Partners page ke liye)
    if (brand) {
       query.Brand = { $regex: brand, $options: "i" };
    }

    console.log("🔍 [DEBUG] Current Query Filters:", query);

    const products = await Product.find(query);
    res.json(products);

  } catch (err) {
    console.error("Error in Get All Products:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// =========================================================
// ROUTE 2: ADD SINGLE PRODUCT (FIXED FOR NEW EXCEL SCHEMA)
// POST: /api/products/add
// =========================================================
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    // Frontend abhi purane form inputs bhej raha hoga, usko handle karte hain
    if (!req.body.model && !req.body.Model_Number) {
        return res.status(400).json({ message: "Model number is required" });
    }

    const product = new Product({
        Product_Name: req.body.name || req.body.Product_Name,
        Model_Number: req.body.model || req.body.Model_Number, 
        Brand: req.body.brand || req.body.Brand || "Generic",
        Category: req.body.type || req.body.category || req.body.Category, 
        MRP: req.body.price || req.body.MRP,
        Selling_Price: req.body.price || req.body.Selling_Price,
        Technical_Specifications: req.body.description || req.body.Technical_Specifications,
        Image: [req.file.path] 
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
    
    console.log("✅ [DEBUG] Product Found:", product.Product_Name);
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