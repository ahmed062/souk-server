import User from '../../models/User.js';
import asyncHandler from 'express-async-handler';
import { sendSpecialEmail } from './userEmails.js';

// GET api/users/:id
// private/admin
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// GET api/users
// private/admin
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');

    res.json(users);
});

// GET api/users/sellers
// private/admin
export const getAllSellers = asyncHandler(async (req, res) => {
    const users = await User.find({ role: 'seller' }).select('-password');

    res.json(users);
});

// Update user
// Put /api/users/:id
// Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.role = req.body.role || uer.role;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            role: updatedUser.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// DELETE api/users/:id
// private/admin
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.remove();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// PUT api/users/:id/ban
// private/admin
export const banUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.ban = true;
        await user.save();
        res.json({ message: 'User baned' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// PUT api/users/:id/unban
// private/admin
export const unBanUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.ban = false;
        await user.save();
        res.json({ message: 'User unbaned' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export const sendEmail = asyncHandler(async (req, res) => {
    const { email, message } = req.body;
    try {
        sendSpecialEmail(email, message);
        res.json({
            success: true,
            message: 'sent!',
        });
    } catch (error) {
        console.log(error);
    }
});
