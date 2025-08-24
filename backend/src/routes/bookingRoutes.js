const express = require('express');
const { createBooking, updateBookingStatus, getMyBookings, getAllBookings } = require('../controllers/bookingController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create booking
router.post('/', protect, authorizeRoles('student', 'faculty'), createBooking);

// View my bookings
router.get('/my', protect, authorizeRoles('student', 'faculty'), getMyBookings);

// Admin: approve/decline booking
router.patch('/:id', protect, authorizeRoles('admin'), updateBookingStatus);

// Admin: view all bookings
router.get('/', protect, authorizeRoles('admin'), getAllBookings);

module.exports = router;
