const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const isAdminUser = require('../middleware/admin.middleware');
const uploadImageMiddleware = require('../middleware/image.middleware');
const { uploadImage, fetchImages } = require('../controllers/image.controller');

//Upload image
router.post(
    '/upload',
    authMiddleware,
    isAdminUser,
    uploadImageMiddleware.single('image'),
    uploadImage
);

//get images
router.get('/get', authMiddleware, fetchImages);

module.exports = router;
