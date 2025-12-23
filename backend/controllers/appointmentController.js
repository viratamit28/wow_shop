const Appointment = require('../models/AppointmentModel');
const dotenv = require('dotenv');

// Config load karo
dotenv.config();

// Twilio Setup
let client;
try {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  // Basic validation check
  if (accountSid && authToken && accountSid.startsWith('AC')) {
    client = require('twilio')(accountSid, authToken);
  } else {
    console.warn("⚠️ Twilio Credentials missing in .env");
  }
} catch (err) {
  console.error("Twilio Init Error:", err.message);
}

exports.bookAppointment = async (req, res) => {
  try {
    const { userId, date, month, time } = req.body;

    // 🛑 1. DUPLICATE CHECK
    const existingBooking = await Appointment.findOne({ 
      userId: userId, 
      status: { $in: ['Pending', 'Confirmed'] } 
    });

    if (existingBooking) {
      return res.status(400).json({ 
        success: false, 
        message: "You already have an active booking!" 
      });
    }

    // 💾 2. SAVE TO DB
    const newAppointment = new Appointment({
      userId,
      date: `${date} ${month}`,
      time,
      status: 'Pending'
    });
    
    await newAppointment.save();
    console.log("✅ Booking Saved:", newAppointment._id);

    // 💬 3. WHATSAPP LOGIC (Simple Text Message)
    if (client) {
        // Ye message tumhare WhatsApp par aayega
        const messageBody = `🔔 *New Appointment Lead*\n\n📅 Date: ${date} ${month}\n⏰ Time: ${time}\n👤 User ID: ${userId}\n\nLogin to admin to confirm.`;

        client.messages.create({
            body: messageBody,                    // Humne 'contentSid' hata diya, simple body use kar rahe hain
            from: process.env.TWILIO_PHONE_NUMBER, // +14155238886
            to: process.env.MY_PHONE_NUMBER        // +916290996103 (Tumhara number)
        })
        .then(msg => console.log("✅ WhatsApp Sent. SID:", msg.sid))
        .catch(err => console.error("❌ WhatsApp Failed:", err.message));
    }

    // ✅ 4. RESPONSE TO USER
    res.status(200).json({ success: true, message: "Appointment booked successfully" });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};