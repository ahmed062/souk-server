import User from '../../models/User.js';
import { sendResetPasswordEmail } from './userEmails.js';
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';

// @desc   Forgot password
// @route  POST /api/users/forgotpassword
// @access public
export const forgotPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        throw new Error('There is no user with this email');
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    try {
        sendResetPasswordEmail(user.email, req, resetToken);
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        throw new Error('Email could not be sent');
    }

    console.log(resetToken);
    res.json('Please check your email to reset your password');
});

// @desc   Reset password
// @route  PUT /api/users/resetpassword/:resettoken
// @access public
export const resetPassword = asyncHandler(async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        throw new Error('invalid token');
    }

    // set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json(user);
});
