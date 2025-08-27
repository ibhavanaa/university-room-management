const Room = require('../models/Room');
const Booking = require('../models/Booking');

// description Get weekly availability calendar for a room
// route GET /api/calendar/:roomId?weekStart=YYYY-MM-DD
// access Admin
exports.getRoomCalendar = async (req, res) => {
    try {
        const { roomId } = req.params;
        const weekStart = new Date(req.query.weekStart); // Monday of the week
        if (isNaN(weekStart)) {
            return res.status(400).json({ message: "Invalid weekStart date" });
        }

        // Create 7 days range
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);
            weekDays.push(day);
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const calendar = [];

        for (const day of weekDays) {
            const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
            const dateString = day.toISOString().split('T')[0];

            const timetableDay = room.timetable.find(t => t.day === dayName);
            const lectures = timetableDay ? timetableDay.lectures : [];

            const bookings = await Booking.find({ room: roomId, date: dateString });

            calendar.push({
                date: dateString,
                day: dayName,
                lectures,
                bookings
            });
        }

        res.status(200).json({
            room: room.name,
            building: room.building,
            department: room.department,
            calendar
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
