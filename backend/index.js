const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const authRoute = require('./routes/auth');
const cartRoute = require('./routes/cart');
const productRoute = require('./routes/products');
const consultationRoute = require('./routes/consultation');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Wow Shop Backend is 100% Live and Working! 🚀");
});

// Universal paths for live servers (No C:/ drive paths)
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch(err => console.log("❌ DB Connection Error:", err));

app.use('/api/user', authRoute);
app.use('/api/cart', cartRoute);
app.use('/api/products', productRoute);
app.use('/api/consultation', consultationRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));