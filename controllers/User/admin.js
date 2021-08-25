import User from '../../models/User.js';
import asyncHandler from 'express-async-handler';

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
