const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const fetchuser = require('../middleware/verifyToken');
const axios = require('axios'); 

// =================================================================
// ROUTE 1: CREATE REQUEST (Save to MongoDB + Auto Sync with CRM)
// POST: /api/consultation/create
// =================================================================
router.post('/create', fetchuser, async (req, res) => {
    try {
        console.log("👉 [CREATE] Request Received");

        const userId = req.user.id || req.user._id || req.user.user?.id;
        
        if (!userId) {
            return res.status(401).json({ success: false, error: "Invalid Token Data" });
        }

        // 🔥 FIX 1: Frontend jo standard payload bhej raha hai, usko yahan unpack kiya hai
        const { 
            name, email, phone, address, city, pincode, 
            scheduledDate, scheduledTime, message, 
            totalAmount, products, ProductDetails 
        } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ success: false, error: "Name and Phone are required" });
        }

        // 1️⃣ SABSE PEHLE: MONGODB ME SAVE KARO
        const newConsultation = new Consultation({
            user: userId,
            // 🔥 FIX 2: Data ko Mongoose schema ke hisaab se precisely map kiya
            customerDetails: {
                name: name,
                phone: phone,
                email: email || "",
                address: { line: address || "Not Provided" }
            },
            appointment: {
                date: scheduledDate || new Date(),
                timeSlot: scheduledTime || "As soon as possible",
                message: message || ""
            },
            interestedProducts: products || [], 
            totalEstimatedValue: totalAmount || 0,
            status: 'Pending Expert Call' 
        });

        const savedConsultation = await newConsultation.save();
        console.log("✅ [MONGODB] Success! Data saved. ID:", savedConsultation._id);

        // 2️⃣ DUSRA STEP: CRM KO BHEJO (TRY-CATCH KE ANDAR)
        try {
            console.log("🚀 [CRM] Sending data to wowshopping.4deal.co...");
            
            // CRM Payload Formatting
            const crmPayload = {
                Name: name, 
                ContactNo: phone, 
                EMailId: email, 
                Address: address, 
                City: city, 
                ZipCode: pincode,
                PreferredSlot: `${scheduledDate} ${scheduledTime}`, 
                Instructions: message || "No special instructions",
                ProductDetails: ProductDetails || "See Dashboard", 
                WebUrl: "wowshop.com" 
            };

            await axios.post('https://wowshopping.4deal.co/lmsapi/addlead.ashx', crmPayload, { 
                headers: { 'Content-Type': 'application/json' },
                timeout: 5000 // 5 seconds timeout
            });
            console.log("✅ [CRM] Lead successfully synced to CRM!");
        } catch (crmError) {
            console.error("⚠️ [CRM WARNING] CRM Sync Failed or Timed Out.");
        }

        // 3️⃣ TISRA STEP: FRONTEND KO SUCCESS BHEJO
        res.status(200).json({ 
            success: true, 
            consultation: savedConsultation, 
            message: "Request Sent Successfully" 
        });

    } catch (error) {
        console.error("🔥 [CREATE] Server Error:", error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});


// =================================================================
// ROUTE 2: GET MY HISTORY (For User Profile Dashboard)
// GET: /api/consultation/mine
// =================================================================
router.get('/mine', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id || req.user.user?.id;
        if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

        const consultations = await Consultation.find({ user: userId }).sort({ createdAt: -1 });
        res.json({ success: true, data: consultations });

    } catch (error) {
        console.error("🔥 [MINE] Error:", error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// =================================================================
// ROUTE 3: CANCEL REQUEST (User Cancels from Profile)
// PUT: /api/consultation/cancel/:id
// =================================================================
router.put('/cancel/:id', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id || req.user.user?.id;

        let consultation = await Consultation.findById(req.params.id);
        if (!consultation) {
            return res.status(404).json({ success: false, error: "Request not found" });
        }

        if (consultation.user.toString() !== userId) {
            return res.status(401).json({ success: false, error: "Not Allowed" });
        }

        consultation = await Consultation.findByIdAndUpdate(
            req.params.id, 
            { $set: { status: "Cancelled" } }, 
            { new: true }
        );

        res.json({ success: true, consultation });

    } catch (error) {
        console.error("🔥 [CANCEL] Error:", error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// =================================================================
// ROUTE 4: GET ALL (Admin Dashboard)
// GET: /api/consultation/all
// =================================================================
router.get('/all', async (req, res) => {
    try {
        const consultations = await Consultation.find()
            .populate('user', 'name email') 
            .sort({ createdAt: -1 });    
        res.json({ success: true, data: consultations });
    } catch (error) {
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = router;