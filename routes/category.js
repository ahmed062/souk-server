import express from 'express';
import addCategory from '../controllers/Category/addCategory.js';
import editCategory from '../controllers/Category/editCategory.js';
import deleteCategory from '../controllers/Category/removeCategory.js';
import { admin, protect } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.use(protect, admin);
router.route('/api/category').post(addCategory);
router.route('/api/category/:slug').put(editCategory).delete(deleteCategory);

export default router;
