import express from 'express';
import { statistics } from '../controllers/Dashboard/Dashboar.js';
const router = express.Router();

router.route('/api/statistics').get(statistics);

export default router;
