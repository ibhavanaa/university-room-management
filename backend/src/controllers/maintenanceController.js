const Maintenance = require('../models/Maintenance');
const Room = require('../models/Room');

// description    Submit a maintenance request
// route   POST /api/maintenance
// access  Student/Faculty
exports.createMaintenanceRequest = async (req, res) => {
    try {
        const { room, issueDescription } = req.body;

        if (!room || !issueDescription) {
            return res.status(400).json({ 
                message: "Room ID and issue description are required" 
            });
        }

        const roomDoc = await Room.findById(room);
        if (!roomDoc) {
            return res.status(404).json({ message: "Room not found" });
        }

        const maintenance = await Maintenance.create({
            user: req.user._id,
            room: room,
            issueDescription: issueDescription,
            image: req.file ? `/uploads/maintenance/${req.file.filename}` : null,
            status: 'pending'
        });

        res.status(201).json({ 
            message: "Maintenance request submitted successfully", 
            maintenance 
        });
    } catch (error) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 50MB' });
        }
        if (error.message.includes('Only image and video files')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

// description    Get my maintenance requests
// route   GET /api/maintenance/my
// access  Student/Faculty
exports.getMyRequests = async (req, res) => {
    try {
        const requests = await Maintenance.find({ user: req.user._id })
            .populate('room', 'name building department');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// desc    Get all maintenance requests (Admin)
// route   GET /api/maintenance
// access  Admin
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

// desc    Update maintenance request status
// route   PUT /api/maintenance/:id
// access  Admin
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
