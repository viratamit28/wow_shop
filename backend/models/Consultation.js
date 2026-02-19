const mongoose = require('mongoose');
const { Schema } = mongoose;

const ConsultationSchema = new Schema({
    // User Link (Login user tracking)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    // 1. Customer Personal & Location Details
    customerDetails: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String }, // Optional
        
        // Structured Address (Object format me data aayega)
        address: {
            line: { type: String, required: true }, // Street/Landmark
            city: { type: String, required: true },
            state: { type: String },
            pincode: { type: String, required: true }
        }
    },

    // 2. Appointment Scheduling Details
    appointment: {
        date: { type: Date, required: true },       // Example: 2023-10-25
        timeSlot: { type: String, required: true }, // Example: "10:00 AM - 12:00 PM"
        message: { type: String }                   // User ka koi note
    },

    // 3. Products Info
    interestedProducts: [
        {
            id: { type: String, required: true }, 
            name: { type: String, required: true },
            image: { type: String }, 
            qty: { type: Number, default: 1 },
            price: { type: Number } 
        }
    ],

    // 4. Financials
    totalEstimatedValue: {
        type: Number,
        required: true
    },

    // 5. Status Tracking (UPDATED: Flexible Logic)
    status: {
        type: String,
        default: 'Pending Expert Call' 
        // Maine yahan se 'enum' hata diya hai.
        // Ab aap 'Cancelled', 'Site Visit Done' kuch bhi status daal sakte hain, error nahi aayega.
    }

}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt'

module.exports = mongoose.model('consultation', ConsultationSchema);