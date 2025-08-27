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

// @desc    Get single room by ID with timetable
// @route   GET /api/rooms/:id
// @access  Private
exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Get timetable from Timetable collection
        const timetableDocs = await Timetable.find({ roomId: req.params.id }).sort({
            day: 1,
            'lectures.startTime': 1
        });

        // Format the timetable data properly
        const formattedTimetable = timetableDocs.map(doc => ({
            day: doc.day,
            lectures: doc.lectures
        }));

        // Return room with populated timetable in the expected format
        res.json({
            roomName: room.name,
            building: room.building,
            department: room.department,
            timetable: formattedTimetable // This should now contain the actual data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new room
// @route   POST /api/rooms
// @access  Admin
exports.addRoom = async (req, res) => {
    try {
        let { name, building, department, capacity, status, type, location } = req.body;
        // Normalize whitespace early
        name = (name || '').trim();
        building = (building || '').trim();
        department = (department || '').trim();

        // Normalize identity fields
        const normalize = (v) => (v || '').toString().trim().toLowerCase();
        const nameKey = normalize(name);
        const buildingKey = normalize(building);
        const departmentKey = normalize(department);

        // Fallback duplicate check in case index hasn't been built yet
        // Check existing via normalized keys
        const exists = await Room.findOne({ nameKey, buildingKey, departmentKey }).lean();
        if (exists) {
            return res.status(409).json({ message: "Room already exists" });
        }

        // Also check legacy docs without normalized keys using case-insensitive collation
        const legacyExists = await Room.findOne({ name, building, department })
            .collation({ locale: 'en', strength: 2 })
            .lean();
        if (legacyExists) {
            return res.status(409).json({ message: "Room already exists" });
        }

        // Create
        const room = new Room({ name, building, department, capacity, status, type, location });
        await room.save();

        res.status(201).json({ message: "Room added successfully", room });
    } catch (error) {
        // Handle duplicate key error from unique index
        if (error.code === 11000) {
            return res.status(409).json({ message: "Room already exists" });
        }
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

        // Allow updating multiple fields
        const updatableFields = [
            'name',
            'building',
            'department',
            'capacity',
            'status',
            'type',
            'location'
        ];
        updatableFields.forEach((field) => {
            if (typeof req.body[field] !== 'undefined') {
                room[field] = req.body[field];
            }
        });
        await room.save();

        res.json({ message: "Room updated", room });
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
