const express = require('express');
const {
    uploadTimetable,
    getTimetableByRoomId
} = require('../controllers/timetableController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const upload = require('../utils/fileUpload');

const router = express.Router({ mergeParams: true }); 
// mergeParams allows us to access :roomId from parent route

// Admin Upload Timetable CSV for a specific room
router.post(
    '/upload',
    protect,
    authorizeRoles('admin'),
    upload.single('file'),
    uploadTimetable
);

// ✅ Get timetable for a specific room (by roomId)
router.get(
    '/:roomId',
    protect,
    authorizeRoles('admin', 'faculty', 'student'),
    getTimetableByRoomId
);

module.exports = router;
