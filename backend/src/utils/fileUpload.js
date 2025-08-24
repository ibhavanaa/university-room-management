const multer = require('multer');
const path = require('path');

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

const upload = multer({ storage, fileFilter });

module.exports = upload;
