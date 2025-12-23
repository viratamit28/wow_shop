const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 1. Get All Products (Filter by Category optional)
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    let products;
    
    if (category) {
      // Case-insensitive search ke liye regex use kar sakte hain, par abhi simple rakho
      products = await Product.find({ category: category });
    } else {
      products = await Product.find();
    }
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Add Single Product (Admin use)
router.post('/add', async (req, res) => {
  const product = new Product(req.body);
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Get Single Product by ID (Ye Add Kiya Hai) 👇
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;