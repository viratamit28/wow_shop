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

        const { customerDetails, appointment, interestedProducts, totalEstimatedValue } = req.body;

        if (!customerDetails || !customerDetails.name || !customerDetails.phone) {
            return res.status(400).json({ success: false, error: "Name and Phone are required" });
        }

        // 1️⃣ SABSE PEHLE: MONGODB ME SAVE KARO (Safe & Guaranteed)
        const newConsultation = new Consultation({
            user: userId,
            customerDetails: {
                name: customerDetails.name,
                phone: customerDetails.phone,
                email: customerDetails.email || "",
                address: { line: customerDetails.address?.line || "Not Provided" }
            },
            appointment: {
                date: appointment?.date || new Date(),
                timeSlot: appointment?.timeSlot || "As soon as possible",
                message: appointment?.message || ""
            },
            interestedProducts: interestedProducts || [], 
            totalEstimatedValue: totalEstimatedValue || 0,
            status: 'Pending Expert Call' 
        });

        const savedConsultation = await newConsultation.save();
        console.log("✅ [MONGODB] Success! Data saved. ID:", savedConsultation._id);

        // 2️⃣ DUSRA STEP: CRM KO BHEJO (TRY-CATCH KE ANDAR)
        // Note: Humne yahan await ko block nahi kiya hai, ye background sync ki tarah kaam karega.
        // CRM fail hone par API crash nahi hogi.
        try {
            console.log("🚀 [CRM] Sending data to wowshopping.4deal.co...");
            // CRM Data Payload matching the exact frontend structure
            await axios.post('https://wowshopping.4deal.co/lmsapi/addlead.ashx', req.body, { 
                headers: { 'Content-Type': 'application/json' },
                timeout: 5000 // 5 seconds timeout
            });
            console.log("✅ [CRM] Lead successfully synced to CRM!");
        } catch (crmError) {
            console.error("⚠️ [CRM WARNING] CRM Sync Failed or Timed Out.");
            // We just log the error, we DO NOT send this error to the user
            console.error("CRM Error Message:", crmError.message);
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