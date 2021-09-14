import express from 'express';
const router = express.Router();
import addSubcategory from '../controllers/Subcategory/addSubcategory.js';
import editSubcategory from '../controllers/Subcategory/editSubcategory.js';
import getSubcategories from '../controllers/Subcategory/getSubcategories.js';
import deleteSubcategory from '../controllers/Subcategory/removeSubcategory.js';

import { protect, seller } from '../middlewares/authMiddleware.js';

router
	.route('/api/subcategory')
	.post(protect, seller, addSubcategory)
	.get(getSubcategories);
router
	.route('/api/subcategory/:slug')
	.put(protect, seller, editSubcategory)
	.delete(protect, seller, deleteSubcategory);

export default router;
