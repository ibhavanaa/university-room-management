// routes/reportRoutes.js
const express = require('express');
const {
    exportBookingsExcel,
    exportBookingsCSV,
    exportBookingsPDF
} = require('../controllers/reportController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/bookings/excel', protect, authorizeRoles('admin'), exportBookingsExcel);
router.get('/bookings/csv', protect, authorizeRoles('admin'), exportBookingsCSV);
router.get('/bookings/pdf', protect, authorizeRoles('admin'), exportBookingsPDF);

module.exports = router;