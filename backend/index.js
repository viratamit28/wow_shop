const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes Import
const authRoute = require('./routes/auth');
const cartRoute = require('./routes/cart');
const productRoute = require('./routes/products');
const appointmentRoute = require('./routes/appointmentRoutes'); // 👈 1. Yaha ye line add kro

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// DB Connection
mongoose.connect(process.env.MONGO_URL || process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch(err => console.log("DB Connection Error:", err));

// API Routes
app.use('/api/user', authRoute);
app.use('/api/cart', cartRoute);
app.use('/api/products', productRoute);
app.use('/api/appointments', appointmentRoute); // 👈 2. Aur yaha ye line add kro

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));