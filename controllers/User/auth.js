import User from '../../models/User.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../../utils/generateToken.js';
import sendEmail from './userEmails.js';

// POST api/users
// private
export const signup = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, country, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new Error('User is already exists');
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        country,
        role,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastname: user.lastName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// POST api/users/verifyemail
// private
export const verifyEmail = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    try {
        sendEmail(email, name, verificationCode);
        res.json(verificationCode);
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
});

// POST api/users/login
// private
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            lastname: user.lastName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});