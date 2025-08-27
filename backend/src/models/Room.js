const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },   // e.g., "Lab 101"
    building: { type: String, required: true },
    department: { type: String, required: true },
    capacity: { type: Number, required: true },
    status: { type: String, enum: ['available', 'booked', 'maintenance', 'unavailable'], default: 'available' },
    type: { type: String },
    location: { type: String },
    // Normalized keys for uniqueness (lowercased, trimmed)
    nameKey: { type: String, index: true },
    buildingKey: { type: String, index: true },
    departmentKey: { type: String, index: true }
    // REMOVED: timetable array (now stored in separate Timetable collection)
}, { timestamps: true });

// Derive normalized keys before save
roomSchema.pre('save', function(next) {
    const normalize = (v) => (v || '').toString().trim().toLowerCase();
    this.nameKey = normalize(this.name);
    this.buildingKey = normalize(this.building);
    this.departmentKey = normalize(this.department);
    next();
});

// Enforce uniqueness via compound index on normalized keys
// Partial unique index to avoid null crashes on legacy docs
roomSchema.index(
    { nameKey: 1, buildingKey: 1, departmentKey: 1 },
    { unique: true, partialFilterExpression: { nameKey: { $type: "string" }, buildingKey: { $type: "string" }, departmentKey: { $type: "string" } } }
);

module.exports = mongoose.model('Room', roomSchema);