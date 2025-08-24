const express = require('express');
const { createNotification, getNotifications } = require('../controllers/notificationController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Student/Faculty/Admin → View notifications
router.get('/', protect, getNotifications);

// Admin → Create notifications
router.post('/', protect, authorizeRoles('admin'), createNotification);

module.exports = router;
