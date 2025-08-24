const express = require('express');
const { getUserStats, getMostBookedRooms, getMaintenanceStats } = require('../controllers/analyticsController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Admin-only Analytics Endpoints
router.get('/users', protect, authorizeRoles('admin'), getUserStats);
router.get('/booked-rooms', protect, authorizeRoles('admin'), getMostBookedRooms);
router.get('/maintenance', protect, authorizeRoles('admin'), getMaintenanceStats);

module.exports = router;
