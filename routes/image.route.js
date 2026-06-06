const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const isAdminUser = require('../middleware/admin.middleware');
const uploadImageMiddleware = require('../middleware/image.middleware');
const {
    uploadImage,
    fetchImages,
    deleteImage
} = require('../controllers/image.controller');

router.post(
    '/upload',
    authMiddleware,
    isAdminUser,
    uploadImageMiddleware.single('image'),
    uploadImage
);

router.get('/getAll', authMiddleware, fetchImages);
router.delete('/:id', authMiddleware, deleteImage);

module.exports = router;
