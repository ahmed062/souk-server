import express from 'express';
const router = express.Router();
import addSubcategory from '../controllers/Subcategory/addSubcategory.js';
import editSubcategory from '../controllers/Subcategory/editSubcategory.js';
import deleteSubcategory from '../controllers/Subcategory/removeSubcategory.js';

import { admin, protect } from '../middlewares/authMiddleware.js';
router.use(protect, admin);
router.route('/api/subcategory').post(addSubcategory);
router
	.route('/api/subcategory/:slug')
	.put(editSubcategory)
	.delete(deleteSubcategory);

export default router;
