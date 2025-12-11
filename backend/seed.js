// backend/seed.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  // ==================== 1. REFRIGERATORS (Spelling as per your frontend) ====================
  {
    name: "Samsung French Door 650L",
    description: "Premium French Door Refrigerator with AI Energy Mode and large capacity.",
    price: 85990,
    category: "Referigerators",
    image: "https://images.samsung.com/is/image/samsung/p6pim/in/rs76cg8003s9hl/gallery/in-side-by-side-refrigerator-rs76cg8003s9hl-front-silver-537463567?$684_547_PNG$"
  },
  {
    name: "LG InstaView Door-in-Door",
    description: "Knock twice to see inside without opening the door. Saves energy.",
    price: 154990,
    category: "Referigerators",
    image: "https://www.lg.com/in/images/refrigerators/md07542358/gallery/GC-X257CQES-Refrigerators-Front-View-DZ-01.jpg"
  },
  {
    name: "Whirlpool IntelliFresh 360L",
    description: "Double door refrigerator with convertible freezer modes.",
    price: 32990,
    category: "Referigerators",
    image: "https://rukminim2.flixcart.com/image/850/1000/xif0q/refrigerator-new/q/z/p/-original-imagp8p54s6j7u7c.jpeg"
  },
  {
    name: "Haier Bottom Mount 320L",
    description: "Bottom mounted freezer technology for easier access to fridge items.",
    price: 28500,
    category: "Referigerators",
    image: "https://m.media-amazon.com/images/I/51+uQp0W4JL._SX679_.jpg"
  },
  {
    name: "Godrej Eon Velvet 240L",
    description: "Stylish design with wood finish handle and advanced cooling.",
    price: 24990,
    category: "Referigerators",
    image: "https://5.imimg.com/data5/SELLER/Default/2023/6/313837943/OW/YO/CF/3616335/godrej-refrigerator-500x500.jpg"
  },
  {
    name: "Bosch MaxFlex Convert",
    description: "German engineering with flexible storage and fresh sense sensors.",
    price: 52000,
    category: "Referigerators",
    image: "https://media.croma.com/image/upload/v1689580554/Croma%20Assets/Large%20Appliances/Refrigerator/Images/262791_0_ztx43h.png"
  },

  // ==================== 2. HOB (Gas Stoves) ====================
  {
    name: "Elica 4 Burner Glass Hob",
    description: "Premium black glass finish with auto ignition functionality.",
    price: 12999,
    category: "Hob",
    image: "https://m.media-amazon.com/images/I/61k2Xq4sJEL._SX679_.jpg"
  },
  {
    name: "Faber 3 Brass Burner",
    description: "Heavy duty brass burners perfect for Indian cooking.",
    price: 8990,
    category: "Hob",
    image: "https://m.media-amazon.com/images/I/61+y5y-wLdL._SX679_.jpg"
  },
  {
    name: "Glen Built-in Hob 1074",
    description: "Spacious layout with forged brass burners and strong pan supports.",
    price: 18500,
    category: "Hob",
    image: "https://m.media-amazon.com/images/I/51r-lC7eD0L._SX679_.jpg"
  },
  {
    name: "Whirlpool Elite Hybrid Hob",
    description: "Hybrid design that can be used as built-in or free standing.",
    price: 14500,
    category: "Hob",
    image: "https://whirlpoolindia.com/cdn/shop/products/EliteHybridHB3B70D-1_1.jpg"
  },
  {
    name: "Prestige Royale Plus",
    description: "Schott glass top with gold accents and tri-pin burners.",
    price: 7800,
    category: "Hob",
    image: "https://m.media-amazon.com/images/I/61wQ4s6Z0TL._SX679_.jpg"
  },
  {
    name: "Sunflame Diamond Hob",
    description: "Toughened glass cooktop with high efficiency brass burners.",
    price: 6500,
    category: "Hob",
    image: "https://m.media-amazon.com/images/I/61H+1K1+c3L._SX679_.jpg"
  },

  // ==================== 3. OVEN ====================
  {
    name: "Samsung Slim Fry Microwave",
    description: "Enjoy fried food without deep frying. Convection microwave oven.",
    price: 16500,
    category: "Oven",
    image: "https://images.samsung.com/is/image/samsung/in-microwave-oven-convection-mc28h5025vk-mc28h5025vk-tl-frontblack-228337583?$650_519_PNG$"
  },
  {
    name: "LG Charcoal Convection",
    description: "Charcoal lighting heater for natural smoky flavor in baking.",
    price: 22990,
    category: "Oven",
    image: "https://www.lg.com/in/images/microwave-ovens/md07546681/gallery/MJEN326PK-Microwave-ovens-Front-View-DZ-01.jpg"
  },
  {
    name: "IFB 30L Convection Oven",
    description: "Rotisserie, fermentation and auto-cook menus included.",
    price: 14990,
    category: "Oven",
    image: "https://m.media-amazon.com/images/I/61x0qO92xBL._SX679_.jpg"
  },
  {
    name: "Morphy Richards OTG",
    description: "60 Litre Oven Toaster Griller for professional baking.",
    price: 11500,
    category: "Oven",
    image: "https://m.media-amazon.com/images/I/71u-sE+s0RL._SX679_.jpg"
  },
  {
    name: "Bajaj Majesty OTG",
    description: "Compact OTG for heating, toasting and grilling needs.",
    price: 4500,
    category: "Oven",
    image: "https://m.media-amazon.com/images/I/71S6L7l7FJL._SX679_.jpg"
  },
  {
    name: "Bosch Built-in Oven",
    description: "Luxury built-in electric oven with 3D hotair technology.",
    price: 65000,
    category: "Oven",
    image: "https://media.croma.com/image/upload/v1708669460/Croma%20Assets/Large%20Appliances/Microwave%20Oven/Images/214300_0_s7g6yq.png"
  },

  // ==================== 4. SINK ====================
  {
    name: "Franke Stainless Steel Sink",
    description: "High grade 304 stainless steel with satin finish.",
    price: 5500,
    category: "Sink",
    image: "https://m.media-amazon.com/images/I/61N+x+u+w+L._SX679_.jpg"
  },
  {
    name: "Carysil Granite Sink Black",
    description: "Quartz granite composite sink, scratch and stain resistant.",
    price: 12500,
    category: "Sink",
    image: "https://m.media-amazon.com/images/I/51w+z+s+u+L._SX679_.jpg"
  },
  {
    name: "Nirali Double Bowl Sink",
    description: "Spacious double bowl sink for separating clean and dirty dishes.",
    price: 9800,
    category: "Sink",
    image: "https://m.media-amazon.com/images/I/61N+x+u+w+L._SX679_.jpg"
  },
  {
    name: "Kohler Kitchen Faucet & Sink",
    description: "Luxury sink kit with pull-down sprayer faucet.",
    price: 28000,
    category: "Sink",
    image: "https://kohler.co.in/cdn/shop/products/24765IN-SD-NA_Hero.jpg"
  },
  {
    name: "Hindware Kitchen Sink",
    description: "Matte finish stainless steel, anti-noise technology.",
    price: 4200,
    category: "Sink",
    image: "https://m.media-amazon.com/images/I/61+M+u+w+L._SX679_.jpg"
  },
  {
    name: "Anupam Square Sink",
    description: "Modern square design with deep bowl capacity.",
    price: 7500,
    category: "Sink",
    image: "https://m.media-amazon.com/images/I/51w+z+s+u+L._SX679_.jpg"
  },

  // ==================== 5. CHIMNEY ====================
  {
    name: "Elica Filterless Chimney",
    description: "Autoclean chimney with motion sensor control.",
    price: 14999,
    category: "Chimney",
    image: "https://m.media-amazon.com/images/I/61A+z+s+u+L._SX679_.jpg"
  },
  {
    name: "Faber Hood Zenith",
    description: "Filterless technology with high suction power 1350 m3/hr.",
    price: 18990,
    category: "Chimney",
    image: "https://m.media-amazon.com/images/I/61N+x+u+w+L._SX679_.jpg"
  },
  {
    name: "Hindware Nadia",
    description: "Thermal auto clean kitchen chimney with oil collector cup.",
    price: 11500,
    category: "Chimney",
    image: "https://m.media-amazon.com/images/I/51w+z+s+u+L._SX679_.jpg"
  },
  {
    name: "Glen Curved Glass Chimney",
    description: "Elegant curved glass design with LED lamps.",
    price: 9990,
    category: "Chimney",
    image: "https://m.media-amazon.com/images/I/61+M+u+w+L._SX679_.jpg"
  },
  {
    name: "Kaff Island Chimney",
    description: "Ceiling mounted island chimney for open kitchens.",
    price: 35000,
    category: "Chimney",
    image: "https://m.media-amazon.com/images/I/61N+x+u+w+L._SX679_.jpg"
  },
  {
    name: "Sunflame Bella",
    description: "Stainless steel baffle filter chimney.",
    price: 7500,
    category: "Chimney",
    image: "https://m.media-amazon.com/images/I/51w+z+s+u+L._SX679_.jpg"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB...");
    
    // Purana data saaf karega
    await Product.deleteMany({});
    console.log("Old data cleared.");

    // Naya data insert karega
    await Product.insertMany(products);
    console.log(`✅ Success! Added ${products.length} products to Database.`);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();