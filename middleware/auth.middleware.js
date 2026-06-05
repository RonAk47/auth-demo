const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token is not provided. Please login to continue'
        });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userInfo = user;
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while decoding access token'
        });
    }
};

module.exports = authMiddleware;
