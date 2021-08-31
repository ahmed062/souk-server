import User from '../../models/User.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../../utils/generateToken.js';
import { sendVerifyEmail } from './userEmails.js';

// POST api/users
// private
export const signup = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, country, role, plan } =
        req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        country,
        role,
        plan,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastname: user.lastName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
            plan: user.plan,
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

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    try {
        sendVerifyEmail(email, name, verificationCode);
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

// POST api/users/facebooklogin
// private
export const facebookLogin = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user) {
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
        throw new Error('Invalid email');
    }
});

// export const loginOrRegister = async (req, res) => {
//     const user = await User.findOne({ email: req.body.email });
//     if (user === null) {
//         return signup(req, res);
//     } else {
//         return login(req, res);
//     }
// };
