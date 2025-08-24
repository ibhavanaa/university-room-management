const express = require('express');
const { getRoomCalendar } = require('../controllers/calendarController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/:roomId',
    protect,
    authorizeRoles('admin'),
    getRoomCalendar
);

module.exports = router;
