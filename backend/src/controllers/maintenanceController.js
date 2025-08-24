const Maintenance = require('../models/Maintenance');
const Room = require('../models/Room');

// @desc    Submit a maintenance request
// @route   POST /api/maintenance
// @access  Student/Faculty
exports.createMaintenanceRequest = async (req, res) => {
    try {
        const { roomId, issueDescription } = req.body;

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const maintenance = await Maintenance.create({
            user: req.user._id,
            room: roomId,
            issueDescription,
            image: req.file ? `/uploads/${req.file.filename}` : null,
            status: 'pending'
        });

        res.status(201).json({ message: "Maintenance request submitted", maintenance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my maintenance requests
// @route   GET /api/maintenance/my
// @access  Student/Faculty
exports.getMyRequests = async (req, res) => {
    try {
        const requests = await Maintenance.find({ user: req.user._id })
            .populate('room', 'name building department');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all maintenance requests (Admin)
// @route   GET /api/maintenance
// @access  Admin
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await Maintenance.find()
            .populate('user', 'name email role')
            .populate('room', 'name building department');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update maintenance request status
// @route   PUT /api/maintenance/:id
// @access  Admin
exports.updateRequestStatus = async (req, res) => {
    try {
        const request = await Maintenance.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: "Maintenance request not found" });
        }

        request.status = req.body.status || request.status;
        await request.save();

        res.json({ message: "Maintenance request updated", request });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
