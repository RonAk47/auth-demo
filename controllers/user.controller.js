const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//register endpoint
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'All fields are mandatory'
            });
        }

        //Check if user exists
        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        //hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        return newUser
            ? res.status(201).json({
                  success: true,
                  message: 'User registered successfully'
              })
            : res.status(400).json({
                  success: false,
                  message: 'Something went wrong while registering user'
              });
    } catch (err) {
        console.error('Something went wrong while registering user', err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while registering user'
        });
    }
};

//login endpoint
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username && !password) {
            return res.status(400).json({
                success: false,
                message: 'Both username and password are required'
            });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(403).json({
                success: false,
                message: "User doesn't exists"
            });
        }

        //validate password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(403).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        //Create user token
        const accessToken = jwt.sign(
            {
                userId: user._id,
                userName: user.username,
                role: user.role
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '15m'
            }
        );

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            accessToken
        });
    } catch (err) {
        console.error('Something went wrong while login user', err);
        return res.status(500).json({
            message: 'Something went wrong while login user'
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.userInfo.userId;

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword && !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Both current and new password are required'
            });
        }
        if (currentPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current and new password must be different'
            });
        }

        //Validate if currentPassword is correct
        const user = await User.findById(userId);

        if (!user) {
            return res.status(403).json({
                success: false,
                message: "User doesn't exists"
            });
        }

        const isPasswordMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordMatch) {
            return res.status(403).json({
                success: false,
                message: 'Invalid current password, Please try again'
            });
        }

        //Allow to change pass if old password is valid
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        //re-generate token
        try {
            const accessToken = await jwt.sign(
                {
                    userId: user._id,
                    userName: user.username,
                    role: user.role
                },
                process.env.JWT_SECRET_KEY,
                {
                    expiresIn: '15m'
                }
            );

            return res.status(200).json({
                success: true,
                message: 'Password changed successfully',
                accessToken
            });
        } catch (err) {
            console.error(
                'Something went wrong while re-generating accessToken',
                err
            );
            return res.stauts(200).json({
                success: true,
                message:
                    'Password changed successfully, please login again with new password to continue.'
            });
        }
    } catch (err) {
        console.error('Error while changing the password', err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while changing the password'
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    changePassword
};
