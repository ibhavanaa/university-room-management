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
        if (!req.file) return res.status(400).json({ message: "Please upload a file" });
        const singleRoomId = req.params.roomId || req.body.roomId || null;

        const originalName = req.file.originalname;
        const ext = originalName.split(".").pop().toLowerCase();
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
        // If a specific roomId is provided → single-room mode
        if (singleRoomId) {
            const room = await Room.findById(singleRoomId);
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }

            // Clear existing
            await Timetable.deleteMany({ roomId: singleRoomId });

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

            for (const day of Object.keys(timetableMap)) {
                await new Timetable({ roomId: singleRoomId, day, lectures: timetableMap[day] }).save();
            }
            // Do not embed timetable in Room; rely on Timetable collection

            return res.status(200).json({
                message: "Timetable uploaded successfully ✅",
                totalRows: rows.length,
                roomId: room._id,
                days: Object.keys(timetableMap).length
            });
        }

        // Bulk mode (no roomId): prefer columns for Room identity
        // Preferred identity columns: Name, Building, Department
        // Required lecture columns: Day, Start Time, End Time, Subject/Course (Faculty optional)
        const normalize = (v) => (v || "").toString().trim();
        const lower = (v) => normalize(v).toLowerCase();
        const grouped = new Map(); // key → { meta, byDay }
        const errors = [];
        let hasIdentityColumns = false;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const name = row["Name"] || row["Room"] || row["Room Name"];
            const building = row["Building"] || row["building"];
            const department = row["Department"] || row["department"];
            const day = row["Day"] || row["day"] || row["DAY"]; // allow case variants
            const startTime = normalizeTime(row["Start Time"] || row["startTime"] || row["Start"] || row["From"]);
            const endTime = normalizeTime(row["End Time"] || row["endTime"] || row["End"] || row["To"]);
            const course = row["Subject"] || row["Course"] || row["course"] || row["Subject Name"];
            const faculty = row["Faculty"] || row["faculty"];

            if (name && building && department) {
                hasIdentityColumns = true;
            }

            if (!day || !startTime || !endTime || !course) {
                errors.push(`Row ${i + 1}: Missing required fields`);
                continue;
            }

            const key = (name && building && department)
              ? [lower(name), lower(building), lower(department)].join("|")
              : "__default_room__";
            if (!grouped.has(key)) {
                // If identity missing, we will derive from filename later
                grouped.set(key, { meta: { name: normalize(name), building: normalize(building), department: normalize(department) }, byDay: {} });
            }
            const bucket = grouped.get(key);
            if (!bucket.byDay[day]) bucket.byDay[day] = [];
            // simple overlap check within bucket
            for (const lec of bucket.byDay[day]) {
                if (isOverlap(startTime, endTime, lec.startTime, lec.endTime)) {
                    errors.push(`Row ${i + 1}: Overlaps in ${name} on ${day}`);
                }
            }
            bucket.byDay[day].push({ startTime, endTime, course, faculty });
        }

        if (errors.length) {
            return res.status(400).json({ message: "Validation failed", errors });
        }

        // For each room group: upsert Room, replace its Timetable docs, and embed into Room
        let roomsProcessed = 0;
        for (const [key, bucket] of grouped.entries()) {
            let { name, building, department } = bucket.meta;
            if (key === "__default_room__" || !hasIdentityColumns) {
                // Derive a readable room name from file name if not provided
                const base = originalName.replace(/\.[^.]+$/, "");
                name = name || base;
                building = building || "Unknown";
                department = department || "Unknown";
            }
            // Try to find by normalized keys
            const room = await Room.findOne({
                nameKey: lower(name),
                buildingKey: lower(building),
                departmentKey: lower(department)
            });
            let roomDoc = room;
            if (!roomDoc) {
                roomDoc = await Room.create({ name, building, department, capacity: 0, status: "available" });
            }

            await Timetable.deleteMany({ roomId: roomDoc._id });
            for (const day of Object.keys(bucket.byDay)) {
                await new Timetable({ roomId: roomDoc._id, day, lectures: bucket.byDay[day] }).save();
            }
            // Do not embed timetable in Room; rely on Timetable collection for retrieval
            roomsProcessed += 1;
        }

        const result = {
            message: "Bulk timetable uploaded successfully ✅",
            totalRows: rows.length,
            roomsProcessed
        };
        // Signal clients to refresh rooms and timetables
        try { require('../utils/eventBus').emit('timetable:update', { roomsProcessed }); } catch (e) {}
        return res.status(200).json(result);
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

        const timetableDocs = await Timetable.find({ roomId }).sort({
            day: 1,
            'lectures.startTime': 1
        });

        // Format the timetable data to match your expected structure
        const formattedTimetable = timetableDocs.map(doc => ({
            day: doc.day,
            lectures: doc.lectures.map(lecture => ({
                startTime: lecture.startTime,
                endTime: lecture.endTime,
                course: lecture.course,
                faculty: lecture.faculty
            }))
        }));

        res.status(200).json({
            roomName: room.name,
            building: room.building,
            department: room.department,
            timetable: formattedTimetable,  // Use the formatted data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};