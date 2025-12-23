const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: String, // Ya agar ObjectId use kar rahe ho to: mongoose.Schema.Types.ObjectId
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Pending', // Pending -> Confirmed -> Completed
    enum: ['Pending', 'Confirmed', 'Cancelled']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);