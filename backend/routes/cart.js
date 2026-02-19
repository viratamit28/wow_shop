const router = require('express').Router();
const User = require('../models/User');
const verify = require('../middleware/verifyToken'); // 🔒 Guard

// --- 1. ADD TO CART ---
router.post('/add', verify, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);

    // Check karo product pehle se cart me hai kya?
    const itemIndex = user.cart.findIndex(item => item.productId == productId);

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += quantity || 1;
    } else {
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
    res.json(user.cart);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// --- 3. DELETE ITEM FROM CART (New Route) ---
// 👇 Ye route ab database se item uda dega
router.delete('/delete/:productId', verify, async (req, res) => {
  try {
    const productId = req.params.productId;
    const user = await User.findById(req.user._id);

    // Filter karke item hata do
    // Hum wo items rakh rahe hain jinki ID match NAHI karti
    user.cart = user.cart.filter(item => {
        // Check both Object ID inside productId or direct item ID
        return item.productId.toString() !== productId && item._id.toString() !== productId;
    });

    await user.save();
    res.send("Item Removed Successfully");
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
      user.cart[itemIndex].quantity = quantity;
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