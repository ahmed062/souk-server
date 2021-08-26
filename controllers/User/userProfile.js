import User from '../../models/User.js';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import sharp from 'sharp';
import validatePhoneNumber from 'validate-phone-number-node-js';

// GET api/users/profile
// private
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
        res.json(user);
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
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
        if (await user.comparePassword(currentPassword)) {
            user.password = newPassword || user.password;
            const updatedUser = await user.save();
            res.json({
                password: updatedUser.password,
            });
        } else {
            throw new Error('The password you entered is wrong');
        }
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// PUT api/users/profile/phone
// private
export const updateUserProfilePhone = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    const validNumber = validatePhoneNumber.validate(req.body.phone);
    if (validNumber) {
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
    } else {
        res.status(400);
        throw new Error('This number is not valid');
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

// POST api/users/profile/avatar
// private
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

// DELETE api/users/profile/avatar
// private
export const deleteAvatar = asyncHandler(async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});
