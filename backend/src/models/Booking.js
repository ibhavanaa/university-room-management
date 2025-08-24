const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },   // snapshot of user's name
    userEmail: { type: String, required: true },  // snapshot of user's email
    date: { type: String, required: true },       // YYYY-MM-DD
    startTime: { type: String, required: true },  // "09:00"
    endTime: { type: String, required: true },    // "10:00"
    purpose: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Declined', 'Completed'], default: 'Approved' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
