const User = require('../models/User');
const Booking = require('../models/Booking');
const Maintenance = require('../models/Maintenance');
const Room = require('../models/Room');

// @desc    Get user counts by role
// @route   GET /api/analytics/users
// @access  Admin
exports.getUserStats = async (req, res) => {
    try {
        const users = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);

        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get most booked rooms
// @route   GET /api/analytics/booked-rooms
// @access  Admin
exports.getMostBookedRooms = async (req, res) => {
    try {
        const bookedRooms = await Booking.aggregate([
            { $match: { status: "approved" } },
            { $group: { _id: "$room", totalBookings: { $sum: 1 } } },
            { $sort: { totalBookings: -1 } },
            { $limit: 5 }
        ]);

        const populatedRooms = await Room.populate(bookedRooms, { path: "_id", select: "name building department" });

        res.json({ success: true, rooms: populatedRooms });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get maintenance requests per month
// @route   GET /api/analytics/maintenance
// @access  Admin
exports.getMaintenanceStats = async (req, res) => {
    try {
        const maintenanceStats = await Maintenance.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    totalRequests: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } }
        ]);

        res.json({ success: true, maintenance: maintenanceStats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
