const express = require('express');
const {
    createMaintenanceRequest,
    getMyRequests,
    getAllRequests,
    updateRequestStatus
} = require('../controllers/maintenanceController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const upload = require('../utils/fileUpload');

const router = express.Router();

// Student/Faculty Routes
router.post(
    '/',
    protect,
    authorizeRoles('student', 'faculty'),
    upload.single('image'),
    createMaintenanceRequest
);

router.get(
    '/my',
    protect,
    authorizeRoles('student', 'faculty'),
    getMyRequests
);

// Admin Routes
router.get('/', protect, authorizeRoles('admin'), getAllRequests);
router.put('/:id', protect, authorizeRoles('admin'), updateRequestStatus);

module.exports = router;
