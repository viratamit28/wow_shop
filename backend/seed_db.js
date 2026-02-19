const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Product = require('./models/Product'); // Apne Model ka path sahi rakhein

// 👇 Tumhara MongoDB URL
const MONGO_URI = 'mongodb+srv://keshavkuma001_db_user:amit%4083403613@wow-shopping.xdqimif.mongodb.net/wowshop?retryWrites=true&w=majority&appName=wow-shopping'; 

const CSV_FILE = 'FINAL_DATABASE_READY.csv'; 

const seedDB = async () => {
  try {
    console.log("⏳ Connecting to DB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB!");

    const products = [];

    // CSV File Read Karna Shuru
    fs.createReadStream(CSV_FILE)
      .pipe(csv())
      .on('data', (row) => {
        // --- DATA KO FORMAT KARNA ---

        // 1. Images: "url1, url2" String ko Array ["url1", "url2"] banana
        let imageArray = [];
        if (row.Image && row.Image.trim() !== "") {
            imageArray = row.Image.split(',').map(url => url.trim());
        }

        // 2. Specs: Technical details ko map mein dalna
        const specsMap = {};
        if (row.Spec_Color) specsMap['Color'] = row.Spec_Color;
        if (row.Spec_Dimensions) specsMap['Dimensions'] = row.Spec_Dimensions;
        if (row.Spec_Capacity) specsMap['Capacity'] = row.Spec_Capacity;
        if (row.Spec_Material) specsMap['Material'] = row.Spec_Material;
        if (row.Spec_Warranty) specsMap['Warranty'] = row.Spec_Warranty;

        // 3. Price Fix: Text se Number banana
        const cleanPrice = parseFloat(row.Price) || 0;

        // 4. Product Object Banana
        const product = {
          name: row.Name,
          model: row.Model, // Zaruri hai Duplicate rokne ke liye
          brand: row.Brand,
          price: cleanPrice,
          category: row.Category.toLowerCase(), // e.g. 'ovens'
          type: row.Category, 
          image: imageArray, // Array of Cloudinary URLs
          description: `Premium ${row.Brand} ${row.Category} (Model: ${row.Model}). Features: ${row.Spec_Material || 'High Quality'}.`,
          specs: specsMap,
          rating: 4.5,
          tag: cleanPrice > 100000 ? "Premium" : "" // Mehenge items ko Premium tag
        };

        products.push(product);
      })
      .on('end', async () => {
        console.log(`🚀 CSV Read Complete. Found ${products.length} products.`);
        
        try {
            // 🔥 DATA INSERTION
            // ordered: false ka matlab agar ek fail ho (duplicate), to baaki rukenge nahi
            await Product.insertMany(products, { ordered: false });
            console.log("🎉 SUCCESS! New products added to database.");
        } catch (err) {
            if (err.code === 11000) {
                console.log("⚠️  Note: Kuch products skip ho gaye kyunki wo pehle se Database mein thay (Duplicate Model Number).");
                console.log("✅ Baaki naye products add ho gaye hain.");
            } else {
                console.error("❌ Error inserting data:", err);
            }
        }
        
        // Connection Band Karna
        mongoose.connection.close();
        process.exit();
      });

  } catch (err) {
    console.error("❌ Connection Error:", err.message);
    process.exit(1);
  }
};

seedDB();