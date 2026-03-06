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
        email: { type: String }, 
        
        // Structured Address
        address: {
            line: { type: String, required: true }, // Frontend ka 'location' yahan aayega
            city: { type: String }, // Made optional
            state: { type: String },
            pincode: { type: String } // Made optional
        }
    },

    // 2. Appointment Scheduling Details
    appointment: {
        date: { type: Date, default: Date.now }, // Default aaj ki date
        timeSlot: { type: String, default: 'TBD' }, // Default TBD
        message: { type: String } // Frontend ka Project Type aur Budget yahan save karenge
    },

    // 3. Products Info (Optional for Consultation)
    interestedProducts: [
        {
            id: { type: String }, 
            name: { type: String },
            image: { type: String }, 
            qty: { type: Number, default: 1 },
            price: { type: Number } 
        }
    ],

    // 4. Financials
    totalEstimatedValue: {
        type: Number,
        default: 0 // Made optional with default 0
    },

    // 5. Status Tracking
    status: {
        type: String,
        default: 'Pending Expert Call' 
    }

}, { timestamps: true });

module.exports = mongoose.model('consultation', ConsultationSchema);