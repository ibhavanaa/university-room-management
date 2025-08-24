const Notification = require('../models/Notification');

// @desc    Create a new notification (Admin)
// @route   POST /api/notifications
// @access  Admin
exports.createNotification = async (req, res) => {
    try {
        const { message, urgencyLevel } = req.body;

        const notification = await Notification.create({
            message,
            urgencyLevel
        });

        res.status(201).json({ message: "Notification created", notification });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Student/Faculty/Admin
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
