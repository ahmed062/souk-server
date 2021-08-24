import express from 'express';
import {
	deleteUser,
	getAllUsers,
	getUserById,
	updateUser,
} from '../controllers/User/admin.js';
import { login, signup, verifyEmail } from '../controllers/User/auth.js';
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
router.use(protect);
router.route('/').get(admin, getAllUsers).post(signup);
router.route('/login').post(login);
router.route('/verifyemail').post(verifyEmail);

router.route('/profile').get(getUserProfile);
router.route('/profile/info').put(updateUserProfileInfo);
router.route('/profile/email').put(updateUserProfileEmail);
router.route('/profile/password').put(updateUserProfilePassword);
router.route('/profile/phone').put(updateUserProfilePhone);
router.route('/profile/seller').put(updateUserProfileToSeeler);
router
	.route('/profile/avatar')
	.post(upload.single('avatar'), uploadAvatar)
	.delete(deleteAvatar);
// router.route('/profile/:id/avatar').get(protect, getProfileAvatar);

router.use(admin);

router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

export default router;
