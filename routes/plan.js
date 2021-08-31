import express from 'express';
import addPlan from '../controllers/Plans/addPlan.js';
import getPlans from '../controllers/Plans/getPlans.js';
import { admin, protect } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.route('/api/plan').post(protect, admin, addPlan).get(getPlans);

export default router;
