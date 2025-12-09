const { MongoClient } = require('mongodb');

// Aapka Connection String (Password Fixed: amit%40...)
const uri = "mongodb+srv://keshavkuma001_db_user:amit%4083403613@wow-shopping.xdqimif.mongodb.net/?appName=wow-shopping";

async function run() {
  const client = new MongoClient(uri);

  try {
    console.log("⏳ Connecting to Database...");
    await client.connect();
    
    const database = client.db("wow_shop");
    const products = database.collection("products");

    // Pehle purana data saaf karte hain (Optional)
    // await products.deleteMany({}); 

    // Ek Sample Product (Kitchen)
    const newProduct = {
      name: "Modern Modular Kitchen Island",
      description: "Premium marble finish kitchen island with built-in storage.",
      price: 150000,
      category: "Kitchen",
      images: ["https://images.unsplash.com/photo-1556911220-bff31c812dba"],
      stock: 5,
      isFeatured: true,
      createdAt: new Date()
    };

    const result = await products.insertOne(newProduct);
    
    console.log("✅ SUCCESS!");
    console.log(`🎉 Product add ho gaya with ID: ${result.insertedId}`);
    console.log("Ab browser par /api/products refresh karke dekho!");

  } catch (error) {
    console.error("❌ Error aaya:", error);
  } finally {
    await client.close();
  }
}

run();