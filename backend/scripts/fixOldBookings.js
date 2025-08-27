// fixOldBookings.js
const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });
const Booking = require("../src/models/Booking"); // adjust path


// Convert fraction → "HH:mm"
function toHHMM(fraction) {
    if (typeof fraction !== "number") return fraction; // already string
    const totalMinutes = Math.round(fraction * 24 * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

async function migrate() {
    await mongoose.connect(process.env.MONGO_URI);

    const bookings = await Booking.find();

    for (const b of bookings) {
        const startFixed = toHHMM(b.startTime);
        const endFixed = toHHMM(b.endTime);

        if (startFixed !== b.startTime || endFixed !== b.endTime) {
            console.log(`Fixing booking ${b._id}: ${b.startTime} → ${startFixed}, ${b.endTime} → ${endFixed}`);
            b.startTime = startFixed;
            b.endTime = endFixed;
            await b.save();
        }
    }

    console.log("Migration complete");
    process.exit(0);
}

migrate();
