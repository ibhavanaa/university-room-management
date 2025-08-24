const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Timetable = require('../models/Timetable'); // ✅ new import

// @desc    Get all rooms with optional filters
// @route   GET /api/rooms
// @access  Private
exports.getRooms = async (req, res) => {
    try {
        const { building, department, capacity } = req.query;

        let filter = {};
        if (building) filter.building = building;
        if (department) filter.department = department;
        if (capacity) filter.capacity = { $gte: Number(capacity) };

        const rooms = await Room.find(filter);
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Private
exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new room
// @route   POST /api/rooms
// @access  Admin
exports.addRoom = async (req, res) => {
    try {
        const { name, building, department, capacity } = req.body;

        const room = new Room({ name, building, department, capacity });
        await room.save();

        res.status(201).json({ message: "Room added successfully", room });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update room status (e.g., available → maintenance)
// @route   PUT /api/rooms/:id
// @access  Admin
exports.updateRoomStatus = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        room.status = req.body.status || room.status;
        await room.save();

        res.json({ message: "Room status updated", room });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Admin
exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        await room.deleteOne();
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check room availability (against timetable + bookings)
// @route   POST /api/rooms/check-availability
// @access  Faculty/Student
exports.checkAvailability = async (req, res) => {
    try {
        const { roomId, date, startTime, endTime } = req.body;

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });

        // 1. Check against timetable in Timetable collection ✅
        const timetableDay = await Timetable.findOne({
            roomId,
            day: dayOfWeek,
            "lectures.startTime": { $lt: endTime },
            "lectures.endTime": { $gt: startTime }
        });

        if (timetableDay) {
            return res.status(400).json({
                available: false,
                reason: `Clashes with a scheduled lecture in timetable`
            });
        }

        // 2. Check against existing bookings
        const overlappingBooking = await Booking.findOne({
            room: roomId,
            date,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
        });

        if (overlappingBooking) {
            return res.status(400).json({
                available: false,
                reason: `Already booked by ${overlappingBooking.user}`
            });
        }

        // If no conflicts
        res.status(200).json({ available: true, message: "Room is available ✅" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
