import express from 'express';
import {
	deleteUser,
	getAllUsers,
	getUserById,
	updateUser,
} from '../controllers/User/admin.js';
import { loginOrRegister, verifyEmail } from '../controllers/User/auth.js';
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
import {
	forgotPassword,
	resetPassword,
} from '../controllers/User/userResetPassword.js';
import { verifyPhoneNumber } from '../controllers/User/userSms.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/auth').get(admin, getAllUsers).post(loginOrRegister);
router.route('/verifyemail').post(verifyEmail);
router.route('/verifyphone').post(protect, verifyPhoneNumber);
router.route('/forgotpassword').post(protect, forgotPassword);
router.route('/forgotpassword/:resettoken').post(protect, resetPassword);

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
	.get(admin, getUserById)
	.put(admin, updateUser)
	.delete(admin, deleteUser);

export default router;
