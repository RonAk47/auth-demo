const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

//Protected route
router.get('/', authMiddleware, (req, res) => {
    const { userName, role, userId } = req.userInfo;
    res.json({
        message: 'welcome to home page',
        user: {
            userId,
            userName,
            role
        }
    });
});

module.exports = router;
