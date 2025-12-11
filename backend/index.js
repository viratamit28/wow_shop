const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes Import
const authRoute = require('./routes/auth');
const cartRoute = require('./routes/cart'); // 👈 NEW: Cart Route Import
const Product = require('./models/Product');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// DB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch(err => console.log(err));

// API Routes
app.use('/api/user', authRoute);
app.use('/api/cart', cartRoute); // 👈 NEW: Cart Connection

// Product Route (Purana wala)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));