const jwt = require('jsonwebtoken');
const { USER_ROLES } = require('../utils/constants');

const isAdminUser = (req, res, next) => {
    if (!req.userInfo.role) {
        return res.status(400).json({
            success: false,
            message: 'Bad request'
        });
    }

    if (req.userInfo.role !== USER_ROLES.ADMIN) {
        return res.status(403).json({
            success: false,
            message: 'Access denied'
        });
    }

    next();
};

module.exports = isAdminUser;
