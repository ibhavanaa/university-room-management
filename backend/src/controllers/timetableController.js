// controllers/timetableController.js
const XLSX = require("xlsx");
const fs = require("fs");
const csv = require("csv-parser");
const Room = require("../models/Room");
const Timetable = require("../models/Timetable");

// ✅ Helper: normalize to "HH:mm"
function normalizeTime(t) {
    if (!t) return null;

    if (typeof t === "number") {
        // Excel fraction of a day → HH:mm
        const totalMins = Math.round(t * 24 * 60);
        const h = String(Math.floor(totalMins / 60)).padStart(2, "0");
        const m = String(totalMins % 60).padStart(2, "0");
        return `${h}:${m}`;
    }

    if (typeof t === "string") {
        let [h, m] = t.split(":");
        if (!m) m = "00";
        if (h.length === 1) h = "0" + h;
        return `${h}:${m}`;
    }

    return null;
}

// ✅ Helper: check if two times overlap
function isOverlap(start1, end1, start2, end2) {
    return start1 < end2 && start2 < end1;
}

// @desc Upload and parse timetable (Excel or CSV)
exports.uploadTimetable = async (req, res) => {
    try {
        const { roomId } = req.body;
        if (!req.file) return res.status(400).json({ message: "Please upload a file" });

        const room = await Room.findById(roomId);
        if (!room) {
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: "Room not found" });
        }

        const ext = req.file.originalname.split(".").pop().toLowerCase();
        let rows = [];

        if (ext === "xlsx") {
            const workbook = XLSX.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        } else if (ext === "csv") {
            const fileData = fs.readFileSync(req.file.path, "utf8");
            const workbook = XLSX.read(fileData, { type: "string" });
            const sheetName = workbook.SheetNames[0];
            rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        } else {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: "Invalid file type. Only .xlsx or .csv allowed" });
        }

        fs.unlinkSync(req.file.path); // cleanup

        if (!rows.length) {
            return res.status(400).json({ message: "Uploaded file is empty" });
        }

        // Clear old timetable for this room
        await Timetable.deleteMany({ roomId });

        const timetableMap = {};
        const errors = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const day = row["Day"] || row["day"] || row["DAY"];
            const startTime = normalizeTime(row["Start Time"] || row["startTime"] || row["Start"]);
            const endTime = normalizeTime(row["End Time"] || row["endTime"] || row["End"]);
            const course = row["Subject"] || row["Course"] || row["course"];
            const faculty = row["Faculty"] || row["faculty"];

            if (!day || !startTime || !endTime || !course) {
                errors.push(`Row ${i + 1}: Missing required fields`);
                continue;
            }

            if (!timetableMap[day]) timetableMap[day] = [];

            // Check for overlaps with existing lectures on same day
            for (const lec of timetableMap[day]) {
                if (isOverlap(startTime, endTime, lec.startTime, lec.endTime)) {
                    errors.push(`Row ${i + 1}: Overlaps with another lecture on ${day}`);
                }
            }

            timetableMap[day].push({ startTime, endTime, course, faculty });
        }

        if (errors.length) {
            return res.status(400).json({ message: "Validation failed", errors });
        }

        // Save timetable per day
        for (const day of Object.keys(timetableMap)) {
            const timetableEntry = new Timetable({
                roomId,
                day,
                lectures: timetableMap[day],
            });
            await timetableEntry.save();
        }

        res.status(200).json({
            message: "Timetable uploaded successfully ✅",
            totalRows: rows.length,
            roomId: room._id,
        });
    } catch (error) {
        console.error("Upload Timetable Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc Get timetable for a specific room
exports.getTimetableByRoomId = async (req, res) => {
    try {
        const { roomId } = req.params;

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const timetable = await Timetable.find({ roomId });

        res.status(200).json({
            roomName: room.name,
            building: room.building,
            department: room.department,
            timetable,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
