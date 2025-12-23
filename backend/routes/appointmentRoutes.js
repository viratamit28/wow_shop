const express = require('express');
const router = express.Router();
const { bookAppointment } = require('../controllers/appointmentController'); // Controller import kiya

// Route: POST /api/appointments/book
router.post('/book', bookAppointment);

module.exports = router;