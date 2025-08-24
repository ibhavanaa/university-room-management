const express = require('express');
const {
    getRooms,
    getRoomById,
    addRoom,
    updateRoomStatus,
    checkAvailability,
    deleteRoom
} = require('../controllers/roomController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// ✅ Import timetable routes
const timetableRoutes = require('./timetableRoutes');

const router = express.Router();

// Nested timetable routes (e.g., /api/rooms/:roomId/timetable)
router.use('/:roomId/timetable', timetableRoutes);

// Get all rooms
router.get('/', protect, getRooms);

// Get single room by ID
router.get('/:id', protect, getRoomById);

// Add new room (Admin only)
router.post('/', protect, authorizeRoles('admin'), addRoom);

// Update room details/status (Admin only)
router.put('/:id', protect, authorizeRoles('admin'), updateRoomStatus);

// Delete room (Admin only)
router.delete('/:id', protect, authorizeRoles('admin'), deleteRoom);

// Check availability (Student & Faculty)
router.post(
    '/check-availability',
    protect,
    authorizeRoles('student', 'faculty'),
    checkAvailability
);

module.exports = router;
