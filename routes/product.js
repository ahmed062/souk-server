import express from 'express';
import { addProduct } from '../controllers/Product/addProduct.js';
import { deleteProduct } from '../controllers/Product/deleteProduct.js';
import { editProduct } from '../controllers/Product/editProduct.js';
import { getProducts } from '../controllers/Product/getProducts.js';
import { protect, seller } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.route('/api/product').get(getProducts);
router.use(protect, seller);
router.route('/api/product').post(addProduct);
router.route('/api/product/:slug').put(editProduct).delete(deleteProduct);

export default router;
