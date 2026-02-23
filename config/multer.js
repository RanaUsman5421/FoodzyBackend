const path = require('path');
const multer = require('multer');

// Allowed file types for image uploads
const ALLOWED_FILE_TYPES = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp'
};

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/Images'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

// File filter function to validate file types
const fileFilter = (req, file, cb) => {
    const allowed = ALLOWED_FILE_TYPES[file.mimetype];
    if (allowed) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: MAX_FILE_SIZE
    },
    fileFilter: fileFilter
});

module.exports = upload;
