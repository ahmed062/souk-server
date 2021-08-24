import express from 'express';
import { addProduct } from '../controllers/Product/addProduct.js';
import { deleteProduct } from '../controllers/Product/deleteProduct.js';
import { editProduct } from '../controllers/Product/editProduct.js';
import { getProducts } from '../controllers/Product/getProducts.js';
import { seller } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.route('/api/product').post(seller, addProduct).get(getProducts);

router.route('/api/product/:slug').put(editProduct).delete(deleteProduct);

export default router;
