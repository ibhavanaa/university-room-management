const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    issueDescription: { type: String, required: true },
    image: { type: String }, // path or URL to uploaded image
    status: { 
        type: String, 
        enum: ['pending', 'in-progress', 'resolved'], 
        default: 'pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
