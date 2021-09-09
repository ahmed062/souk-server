import User from '../../models/User.js';
import asyncHandler from 'express-async-handler';
import { sendSpecialEmail } from './userEmails.js';
import Profit from '../../models/Profit.js';

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

// PUT /api/users/:id/payprofit
// Private/Admin
export const payProfit = asyncHandler(async (req, res) => {
    const profit = await Profit.create({
        seller: req.params.id,
        price: req.body.price,
        isPaid: true,
        paidAt: Date.now(),
        paymentMethod: req.body.paymentMethod,
        paymentResult: {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        },
    });

    const savedProfit = await profit.save();

    try {
        if (savedProfit) {
            const seller = await User.findById(req.params.id);
            seller.monyAfterProfit = 0;
            await seller.save();
        }
    } catch (error) {
        throw new Error('Something went wrong with the payment');
    }

    res.json(savedProfit);
});
