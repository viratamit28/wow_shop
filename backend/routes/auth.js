const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// --- 1. MIDDLEWARE: SURAKSHA GUARD (Check karega token sahi hai ya nahi) ---
const verify = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

// --- 2. FILE UPLOAD SETUP ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// --- 3. REGISTER API ---

router.post('/register', async (req, res) => {
    try {
        
        const { name, email, password, phone, address, lat, lng } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            name: name,
            email: email,
            phone: phone,         
            password: secPassword,
            address: address,
            lat: lat,
            lng: lng
        });

        // Generate Token
        const data = { user: { id: user.id } };
        const authToken = jwt.sign(data, process.env.JWT_SECRET);

        res.json({ token: authToken, user: user });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// --- 4. LOGIN API ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Email not found');

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).send('Invalid Password');

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
    
    // Login hote hi data bhejo
    res.header('auth-token', token).send({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        address: user.address,
        profileImage: user.profileImage,
        cart: user.cart
      } 
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// --- 5. PROFILE API (YE MISSING THA!) ---
// Jab page refresh hoga, ye route user ka data wapis layega
router.get('/profile', verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        profileImage: user.profileImage,
        cart: user.cart
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;