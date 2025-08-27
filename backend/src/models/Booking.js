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
    status: { type: String, enum: ['Pending', 'Approved', 'Declined', 'Completed'], default: 'Pending' },
    // Normalized keys for uniqueness
    purposeKey: { type: String, index: true },
    userEmailKey: { type: String, index: true },
}, { timestamps: true });

// Pre-save to populate normalized keys
bookingSchema.pre('save', function(next) {
    const toLower = (v) => (v || '').toString().trim().toLowerCase();
    this.purposeKey = toLower(this.purpose);
    this.userEmailKey = toLower(this.userEmail);
    next();
});

// Unique compound index to avoid duplicates for same user/room/time
bookingSchema.index(
    { room: 1, date: 1, startTime: 1, endTime: 1, purposeKey: 1, userEmailKey: 1 },
    {
        unique: true,
        partialFilterExpression: {
            room: { $type: 'objectId' },
            date: { $type: 'string' },
            startTime: { $type: 'string' },
            endTime: { $type: 'string' },
            purposeKey: { $type: 'string' },
            userEmailKey: { $type: 'string' }
        }
    }
);

module.exports = mongoose.model('Booking', bookingSchema);
