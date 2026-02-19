const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// --- 1. ROUTES IMPORT ---
const authRoute = require('./routes/auth');
const cartRoute = require('./routes/cart');
const productRoute = require('./routes/products');
// const appointmentRoute = require('./routes/appointmentRoutes'); // (Optional: Agar purana wala hatana hai to hata do)
const consultationRoute = require('./routes/consultation'); // 👈 NEW: Jo humne abhi banaya

dotenv.config();
const app = express();

// --- 2. MIDDLEWARE ---
app.use(express.json());
app.use(cors());

// --- 3. STATIC FILES (IMAGES) ---
// Local Desktop Path for Images
app.use('/images', express.static('C:/Users/AMIT KUMAR/OneDrive/Desktop/image_work'));

// --- 4. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch(err => console.log("❌ DB Connection Error:", err));

// --- 5. API ROUTES ---
app.use('/api/user', authRoute);           // Auth (Login/Signup)
app.use('/api/cart', cartRoute);           // Cart/Project List
app.use('/api/products', productRoute);    // Products
app.use('/api/consultation', consultationRoute); // 👈 NEW: Expert Consultation Route

// app.use('/api/appointments', appointmentRoute); // (Purana wala agar nahi chahiye to comment rakho)

// --- 6. SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));