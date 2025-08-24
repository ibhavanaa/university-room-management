const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const mongoose = require('mongoose');
const errorHandler = require('./src/middlewares/errorHandler');
const timetableRoutes = require('./src/routes/timetableRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const roomRoutes = require('./src/routes/roomRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const maintenanceRoutes = require('./src/routes/maintenanceRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const calendarRoutes = require('./src/routes/calendarRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/bookings', bookingRoutes);

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Health Check Route
app.get('/', (req, res) => {
    res.json({ message: "✅ University Infrastructure Management System Backend Running" });
});

// Test DB Connection Route
app.get('/test-db', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        res.json({ success: true, message: "✅ DB Connected", collections });
    } catch (err) {
        res.status(500).json({ success: false, message: "❌ DB Not Connected", error: err.message });
    }
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
