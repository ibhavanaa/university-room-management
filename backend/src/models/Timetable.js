const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room', // Reference to the Room model
        required: true
    },
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    lectures: [
        {
            startTime: { type: String, required: true }, // Always stored in "HH:mm"
            endTime: { type: String, required: true },   // Always stored in "HH:mm"
            course: { type: String, required: true },
            faculty: { type: String } // Optional
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
