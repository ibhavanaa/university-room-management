// utils/fileUpload.js
const multer = require('multer');
const path = require('path');

// General upload (for timetables - CSV/Excel)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.csv' || ext === '.xlsx' || ext === '.xls') {
        cb(null, true);
    } else {
        cb(new Error('Only images, CSV, and Excel files are allowed'), false);
    }
};

// Special upload for maintenance (images + videos)
const maintenanceStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/maintenance/'); // This folder should exist
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `maintenance-${uniqueSuffix}-${file.originalname}`);
    }
});

const maintenanceFileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|gif|bmp|webp|mp4|mov|avi|wmv|mkv|flv|webm|3gp/;
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedExtensions.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image and video files are allowed for maintenance requests!'), false);
    }
};

const upload = multer({ storage, fileFilter });
const maintenanceUpload = multer({
    storage: maintenanceStorage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit for videos
    },
    fileFilter: maintenanceFileFilter
});

module.exports = { upload, maintenanceUpload };