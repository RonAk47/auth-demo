const mongoose = require('mongoose');
const { USER_ROLES_ENUM } = require('../utils/constants');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: USER_ROLES_ENUM,
            default: 'user'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('user', userSchema);
