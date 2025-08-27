// routes/maintenanceRoutes.js
const express = require('express');
const {
    createMaintenanceRequest,
    getMyRequests,
    getAllRequests,
    updateRequestStatus
} = require('../controllers/maintenanceController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const { maintenanceUpload } = require('../utils/fileUpload'); // Import the new upload

const router = express.Router();

// Student/Faculty Routes
router.post(
    '/',
    protect,
    authorizeRoles('student', 'faculty'),
    maintenanceUpload.single('image'), // Use maintenance-specific upload
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