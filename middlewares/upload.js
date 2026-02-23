const multer = require('multer');
const storage = require('../config/multer');

const upload = multer ({
    storage
})


module.exports = upload;