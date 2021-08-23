import express from 'express';
import {
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser,
} from '../controllers/User/admin.js';
import { login, signup } from '../controllers/User/auth.js';
import {
    deleteAvatar,
    getUserProfile,
    updateUserProfileEmail,
    updateUserProfileInfo,
    updateUserProfilePassword,
    updateUserProfilePhone,
    updateUserProfileToSeeler,
    upload,
    uploadAvatar,
} from '../controllers/User/userProfile.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getAllUsers).post(signup);
router.route('/login').post(login);

router.route('/profile').get(protect, getUserProfile);
router.route('/profile/info').put(protect, updateUserProfileInfo);
router.route('/profile/email').put(protect, updateUserProfileEmail);
router.route('/profile/password').put(protect, updateUserProfilePassword);
router.route('/profile/phone').put(protect, updateUserProfilePhone);
router.route('/profile/seller').put(protect, updateUserProfileToSeeler);
router
    .route('/profile/avatar')
    .post(protect, upload.single('avatar'), uploadAvatar)
    .delete(protect, deleteAvatar);
// router.route('/profile/:id/avatar').get(protect, getProfileAvatar);
router
    .route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

export default router;
