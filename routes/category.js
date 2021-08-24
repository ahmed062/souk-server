import express from 'express';
import addCategory from '../controllers/Category/addCategory.js';
import editCategory from '../controllers/Category/editCategory.js';
import deleteCategory from '../controllers/Category/removeCategory.js';
import getCategories from '../controllers/Category/getCategories.js';
import { admin, protect } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.route('/api/category').get(getCategories);
router.use(protect, admin);
router.route('/api/category').post(addCategory);
router.route('/api/category/:slug').put(editCategory).delete(deleteCategory);

export default router;
