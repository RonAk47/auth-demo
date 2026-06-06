const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
    }
});

//File filter function
const checkFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(null, Error('Not an image! Please upload an image file'));
    }
};

//Middleware
module.exports = multer({
    storage,
    fileFilter: checkFileFilter,
    limits: 5 * 1024 * 1024 //5mb
});
