const router = require('express').Router();
const User = require('../models/User');
const Product = require('../models/Product');
const verify = require('../middleware/verifyToken'); // 🔒 Guard import kiya

// --- 1. ADD TO CART ---
router.post('/add', verify, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // User dhundo
    const user = await User.findById(req.user._id);

    // Check karo product pehle se cart me hai kya?
    const itemIndex = user.cart.findIndex(item => item.productId == productId);

    if (itemIndex > -1) {
      // Agar hai, toh quantity badha do
      user.cart[itemIndex].quantity += quantity || 1;
    } else {
      // Agar nahi hai, toh naya item push karo
      user.cart.push({ productId, quantity: quantity || 1 });
    }

    await user.save();
    res.send("Item Added to Cart");

  } catch (err) {
    res.status(400).send(err.message);
  }
});

// --- 2. GET USER CART (With Product Details) ---
router.get('/', verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.productId'); 
    // .populate() ka jaadu: Ye sirf ID nahi, pura Product data (Image, Price, Name) layega
    
    res.json(user.cart);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// --- 3. REMOVE FROM CART ---
router.post('/remove', verify, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    // Filter karke item hata do
    user.cart = user.cart.filter(item => item.productId != productId);

    await user.save();
    res.send("Item Removed");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// --- 4. UPDATE QUANTITY ---
router.post('/update', verify, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);

    const itemIndex = user.cart.findIndex(item => item.productId == productId);
    if (itemIndex > -1) {
      user.cart[itemIndex].quantity = quantity; // Direct set karo
      await user.save();
      res.send("Quantity Updated");
    } else {
      res.status(404).send("Item not found in cart");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;