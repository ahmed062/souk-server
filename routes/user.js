import express from 'express';
import {
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser,
    sendEmail,
    getAllSellers,
    payProfit,
} from '../controllers/User/admin.js';
import {
    facebookLogin,
    facebookSignup,
    login,
    signup,
    verifyEmail,
} from '../controllers/User/auth.js';
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
import { addToWishlist } from '../controllers/User/userWishlist.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getAllUsers).post(signup);
router.route('/sellers').get(protect, admin, getAllSellers);
router.route('/login').post(login);
router.route('/facebooksignup').post(facebookSignup);
router.route('/facebooklogin').post(facebookLogin);
router.route('/verifyemail').post(verifyEmail);
router.route('/verifyphone').post(protect, verifyPhoneNumber);
router.route('/forgotpassword').post(forgotPassword);
router.route('/forgotpassword/:resettoken').post(resetPassword);
router.route('/sendEmail').post(protect, admin, sendEmail);

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
router.route('/:id/payprofit').post(protect, admin, payProfit);

router.route('/sendEmail').post(protect, admin, sendEmail);
router.route('/wishlist').post(protect, addToWishlist);

export default router;
