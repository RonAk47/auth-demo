const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    changePassword
} = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

//Protected route
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;
