import express from 'express';
import addCategory from '../controllers/Category/addCategory.js';
import editCategory from '../controllers/Category/editCategory.js';
import deleteCategory from '../controllers/Category/removeCategory.js';
import { protect, seller } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.route('/api/category').post(protect, seller, addCategory);
router
    .route('/api/category/:slug')
    .put(protect, seller, editCategory)
    .delete(protect, seller, deleteCategory);

export default router;
