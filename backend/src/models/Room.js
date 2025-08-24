const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },   // e.g., "Lab 101"
    building: { type: String, required: true },
    department: { type: String, required: true },
    capacity: { type: Number, required: true },
    status: { type: String, enum: ['available', 'booked', 'maintenance'], default: 'available' },
    timetable: [
    {
        day: { type: String },
        lectures: [
            {
                startTime: { type: String }, // "10:00"
                endTime: { type: String },   // "11:00"
                course: { type: String },
                faculty: { type: String } // optional
            }
        ]
    }
]

}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
