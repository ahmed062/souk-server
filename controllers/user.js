import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import multer from 'multer';
import sharp from 'sharp';

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

// GET api/users/:id
// private/admin
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password -avatar');
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
    const users = await User.find({}).select('-password -avatar');

    res.json(users);
});

// GET api/users/profile
// private
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastname: user.lastName,
            email: user.email,
            role: user.role,
            phone: user.phone,
            country: user.country,
            address1: user.address1,
            address2: user.address2,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// PUT api/users/profile/seller
// private
export const updateUserProfileToSeeler = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.role = 'seller';
        const updatedUser = await user.save();
        res.json({
            role: updatedUser.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// PUT api/users/profile/info
// private
export const updateUserProfileInfo = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.country = req.body.country || user.country;
        user.address1 = req.body.address1 || user.address1;
        user.address2 = req.body.address2 || user.address2;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastname: updatedUser.lastName,
            country: updatedUser.country,
            address1: updatedUser.address1,
            address2: updatedUser.address2,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// PUT api/users/profile/email
// private
export const updateUserProfileEmail = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.email = req.body.email || user.email;
        const updatedUser = await user.save();
        res.json({
            email: updatedUser.email,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// PUT api/users/profile/password
// private
export const updateUserProfilePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.password = req.body.password || user.password;
        const updatedUser = await user.save();
        res.json({
            password: updatedUser.password,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// PUT api/users/profile/phone
// private
export const updateUserProfilePhone = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.phone = req.body.phone || user.phone;
        const updatedUser = await user.save();
        res.json({
            phone: updatedUser.phone,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Update user
// Put /api/users/:id
// Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.role = req.body.role;

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

export const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error('it must be an image'));
        }

        cb(undefined, true);
    },
});

export const uploadAvatar = asyncHandler(
    async (req, res) => {
        const buffer = await sharp(req.file.buffer)
            .png()
            .resize({ width: 250, height: 250 })
            .toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.send();
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);

export const deleteAvatar = asyncHandler(async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

// export const getProfileAvatar = asyncHandler(async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);

//         if (!user || !user.avatar) {
//             throw new Error();
//         }

//         res.set('Content-type', 'image/png');
//         res.send(user.avatar);
//     } catch (e) {
//         res.status(404).send();
//     }
// });
