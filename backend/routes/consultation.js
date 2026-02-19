const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const fetchuser = require('../middleware/verifyToken');
const axios = require('axios'); // ✅ [ADDED] CRM se baat karne ke liye

// =================================================================
// ROUTE 1: CREATE REQUEST (Save to Local MongoDB)
// =================================================================
router.post('/create', fetchuser, async (req, res) => {
    try {
        console.log("👉 [CREATE] Request Received");

        const userId = req.user.id || req.user._id || req.user.user?.id;
        
        if (!userId) {
            return res.status(401).json({ success: false, error: "Invalid Token Data" });
        }

        // Data receive kar rahe hain
        const { customerDetails, appointment, interestedProducts, totalEstimatedValue } = req.body;

        // Basic Validation
        if (!customerDetails || !interestedProducts || !appointment) {
            return res.status(400).json({ success: false, error: "Missing details" });
        }

        const newConsultation = new Consultation({
            user: userId,
            customerDetails: {
                name: customerDetails.name,
                phone: customerDetails.phone,
                email: customerDetails.email,
                address: customerDetails.address // Object pass kar rahe hain
            },
            appointment: {
                date: appointment.date,
                timeSlot: appointment.timeSlot,
                message: appointment.message
            },
            interestedProducts, 
            totalEstimatedValue,
            status: 'Pending Expert Call' 
        });

        const savedConsultation = await newConsultation.save();
        console.log("✅ [CREATE] Success! ID:", savedConsultation._id);

        res.json({ success: true, consultation: savedConsultation, message: "Request Sent Successfully" });

    } catch (error) {
        console.error("🔥 [CREATE] Server Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =================================================================
// ROUTE 2: CRM INTEGRATION (CORS Fix Wala Route) ✅ [NEW ADDED]
// URL: http://localhost:5000/api/consultation/add-lead
// =================================================================
router.post('/add-lead', async (req, res) => {
    try {
        console.log("🚀 [CRM] Sending data to wowshopping.4deal.co...");
        console.log("📦 Payload:", req.body);

        // Backend se CRM ko call (Server-to-Server, No CORS)
        const crmResponse = await axios.post(
            'https://wowshopping.4deal.co/lmsapi/addlead.ashx',
            req.body,
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        console.log("✅ [CRM] Response:", crmResponse.data);

        // CRM ka response frontend ko wapas bhejo
        res.status(200).json({
            success: true,
            data: crmResponse.data
        });

    } catch (error) {
        console.error("🔥 [CRM] Error:", error.message);
        // Agar CRM se error aaye tab bhi frontend ko batao
        res.status(500).json({
            success: false,
            message: "Failed to connect to CRM",
            error: error.message
        });
    }
});

// =================================================================
// ROUTE 3: GET MY HISTORY
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
// ROUTE 4: CANCEL REQUEST
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
        res.status(500).send("Internal Server Error");
    }
});

// =================================================================
// ROUTE 5: GET ALL (Admin)
// =================================================================
router.get('/all', async (req, res) => {
    try {
        const consultations = await Consultation.find()
            .populate('user', 'name email') 
            .sort({ createdAt: -1 });     
        res.json({ success: true, data: consultations });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;