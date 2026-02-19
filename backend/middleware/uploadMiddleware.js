// backend/middleware/uploadMiddleware.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wow_shop_products', // Cloudinary pe is folder me jayega
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    // Hum file ka naam clean rakhenge taaki DB me sirf ID store karein
    public_id: (req, file) => file.originalname.split('.')[0], 
  },
});

const upload = multer({ storage: storage });

module.exports = upload;