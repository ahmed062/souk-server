import express from 'express';
import {
	statistics,
	extraStatistics,
	sellerExtraStatistics,
} from '../controllers/Dashboard/Dashboar.js';
import { admin, protect, seller } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.route('/api/statistics').get(protect, admin, statistics);
router.route('/api/extraStatistics').get(protect, admin, extraStatistics);
router
	.route('/api/sellerExtraStatistics')
	.get(protect, seller, sellerExtraStatistics);
export default router;
