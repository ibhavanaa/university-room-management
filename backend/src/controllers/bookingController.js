// controllers/bookingController.js
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const User = require("../models/User");
const Timetable = require("../models/Timetable");
const { sendEmail } = require("../utils/emailService");
const eventBus = require("../utils/eventBus");

// ---------------------- Helpers ----------------------

function normalizeTime(t) {
  if (!t) return null;
  let [h, m] = String(t).split(":");
  if (!m) m = "00";
  if (h.length === 1) h = "0" + h;
  return `${h}:${m}`;
}

function toMinutes(t) {
  const [h, m] = normalizeTime(t).split(":").map(Number);
  return h * 60 + (m || 0);
}

function minutesToTime(m) {
  const h = Math.floor(m / 60).toString().padStart(2, "0");
  const min = (m % 60).toString().padStart(2, "0");
  return `${h}:${min}`;
}

function getDayNameUTC(dateStr) {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const [y, m, d] = dateStr.split("-").map(Number);
  return days[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

// Mark old bookings as Completed
async function cleanupOldBookings() {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentTime = now.toTimeString().slice(0, 5);

  await Booking.updateMany(
    {
      status: { $in: ["Pending", "Approved"] },
      $or: [
        { date: { $lt: today } },
        { date: today, endTime: { $lte: currentTime } }
      ]
    },
    { status: "Completed" }
  );
}

// Keep room.status in sync with active bookings
async function syncRoomStatus(roomId) {
  try {
    const active = await Booking.countDocuments({
      room: roomId,
      status: { $in: ["Pending", "Approved"] }
    });
    const room = await Room.findById(roomId);
    if (!room) return;
    const desired = active > 0 ? "unavailable" : "available";
    if (room.status !== desired && room.status !== "maintenance") {
      room.status = desired;
      await room.save();
    }
  } catch (e) {
    console.warn("Room status sync failed:", e.message);
  }
}

function subtractSlot(slots, remove) {
  const result = [];
  const rStart = toMinutes(remove.start);
  const rEnd = toMinutes(remove.end);

  for (const slot of slots) {
    const sStart = toMinutes(slot.start);
    const sEnd = toMinutes(slot.end);

    if (rEnd <= sStart || rStart >= sEnd) {
      result.push(slot); // no overlap
    } else {
      if (rStart > sStart) result.push({ start: slot.start, end: minutesToTime(rStart) });
      if (rEnd < sEnd) result.push({ start: minutesToTime(rEnd), end: slot.end });
    }
  }
  return result;
}

// ---------------------- Controllers ----------------------

/**
 * @desc Create a booking request
 * @route POST /api/bookings
 * @access Student/Faculty
 */
exports.createBooking = async (req, res) => {
  try {
    const { roomId, date, startTime, endTime, purpose } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Auto cleanup expired
    await cleanupOldBookings();

    // Room check
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Validate times
    const bStart = toMinutes(startTime);
    const bEnd = toMinutes(endTime);
    if (Number.isNaN(bStart) || Number.isNaN(bEnd) || bStart >= bEnd) {
      return res.status(400).json({ message: "Invalid booking time range" });
    }

    // Timetable clash
    const dayOfWeek = getDayNameUTC(date);
    const timetable = await Timetable.findOne({ roomId, day: dayOfWeek });
    if (timetable?.lectures?.length) {
      for (const lec of timetable.lectures) {
        const lStart = toMinutes(lec.startTime);
        const lEnd = toMinutes(lec.endTime);
        if (bStart < lEnd && bEnd > lStart) {
          return res.status(400).json({
            message: `❌ Clashes with timetable: ${lec.course} (${lec.startTime} - ${lec.endTime})`
          });
        }
      }
    }

    // Clash with active bookings (Pending + Approved)
    const activeBookings = await Booking.find({
      room: roomId,
      date,
      status: { $in: ["Pending", "Approved"] }
    });

    for (const b of activeBookings) {
      const xStart = toMinutes(b.startTime);
      const xEnd = toMinutes(b.endTime);
      if (bStart < xEnd && bEnd > xStart) {
        return res.status(400).json({
          message: `❌ Room already booked from ${b.startTime}-${b.endTime}`
        });
      }
    }

    // Create booking
    const booking = await Booking.create({
      room: roomId,
      user: req.user.id,
      userName: user.name,
      userEmail: user.email,
      date,
      startTime: normalizeTime(startTime),
      endTime: normalizeTime(endTime),
      purpose,
      status: "Pending",
    });

    // Reflect occupancy based on active bookings
    await syncRoomStatus(roomId);

    // Notify clients
    eventBus.emit('booking:update', { type: 'created', bookingId: booking._id });

    // Email admin
    try {
      await sendEmail(
        process.env.ADMIN_EMAIL,
        "New Booking Request",
        `<p>A new booking request has been made:</p>
         <p>Room: ${room.name}</p>
         <p>Date: ${date}, Time: ${booking.startTime}-${booking.endTime}</p>
         <p>Requested by: ${user.name} (${user.email})</p>
         <p>Purpose: ${purpose}</p>`
      );
    } catch (e) {
      console.warn("⚠️ Email not sent:", e.message);
    }

    return res.status(201).json({ message: "Booking request submitted", booking });
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Approve or decline booking (Admin only)
 * @route PATCH /api/bookings/:id
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate("room");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (!["Approved", "Declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    booking.status = status;
    await booking.save();

    // Update room status based on active bookings
    await syncRoomStatus(booking.room._id || booking.room);

    // Notify clients
    eventBus.emit('booking:update', { type: 'status', bookingId: booking._id, status });

    // Notify user
    try {
      await sendEmail(
        booking.userEmail,
        `Booking ${status}`,
        `<p>Hello ${booking.userName},</p>
         <p>Your booking for <b>${booking.room.name}</b> on <b>${booking.date}</b>
         from <b>${booking.startTime}-${booking.endTime}</b> has been <b>${status}</b>.</p>`
      );
    } catch (e) {
      console.warn("⚠️ Email not sent:", e.message);
    }

    res.status(200).json({ message: `Booking ${status}`, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get logged-in user's bookings
 * @route GET /api/bookings/me?filter=upcoming|history|all
 */
exports.getMyBookings = async (req, res) => {
  try {
    await cleanupOldBookings();

    const filter = req.query.filter || "upcoming";
    let query = { user: req.user.id };

    if (filter === "upcoming") {
      query.status = { $in: ["Pending", "Approved"] };
    } else if (filter === "history") {
      query.status = { $in: ["Completed", "Declined"] };
    } // "all" → no extra filter

    const bookings = await Booking.find(query).populate("room");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get all bookings (Admin)
 * @route GET /api/bookings
 */
exports.getAllBookings = async (req, res) => {
  try {
    await cleanupOldBookings();
    // Deduplicate in aggregation to ensure UI shows what DB actually has logically
    const agg = await Booking.aggregate([
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: {
            room: "$room",
            date: "$date",
            start: "$startTime",
            end: "$endTime",
            purpose: { $toLower: { $ifNull: ["$purpose", ""] } },
            email: { $toLower: { $ifNull: ["$userEmail", ""] } }
          },
          doc: { $last: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$doc" } },
      { $sort: { date: 1, startTime: 1 } }
    ]);

    const ids = agg.map(d => d._id);
    const populated = await Booking.find({ _id: { $in: ids } })
      .populate("room user")
      .sort({ date: 1, startTime: 1 });

    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get availability of a room for a date
 * @route GET /api/rooms/:id/availability?date=YYYY-MM-DD
 */
exports.getRoomAvailability = async (req, res) => {
  try {
    await cleanupOldBookings();
    const { id } = req.params;
    const { date } = req.query;

    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const dayOfWeek = getDayNameUTC(date);

    // Start with full day (example 08:00-18:00)
    let freeSlots = [{ start: "08:00", end: "18:00" }];

    // Subtract timetable lectures
    const timetable = await Timetable.findOne({ roomId: id, day: dayOfWeek });
    if (timetable?.lectures?.length) {
      timetable.lectures.forEach(lec => {
        freeSlots = subtractSlot(freeSlots, { start: lec.startTime, end: lec.endTime });
      });
    }

    // Subtract active bookings
    const bookings = await Booking.find({ room: id, date, status: { $in: ["Pending", "Approved"] } });
    bookings.forEach(b => {
      freeSlots = subtractSlot(freeSlots, { start: b.startTime, end: b.endTime });
    });

    res.json({ room: room.name, date, availableSlots: freeSlots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
