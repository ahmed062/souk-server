import express from 'express';
import addToRetrievedProducts from '../controllers/Retrieved Product/addToRetrievedProducts.js';
import getRetrievedProducts from '../controllers/Retrieved Product/getRetrievedProducts.js';
import updateAccept from '../controllers/Retrieved Product/updateAccept.js';
import { seller, protect } from '../middlewares/authMiddleware.js';
const router = express.Router();

router
	.route('/api/retrieve')
	.post(protect, addToRetrievedProducts)
	.get(protect, seller, getRetrievedProducts)
	.put(protect, seller, updateAccept);

export default router;
