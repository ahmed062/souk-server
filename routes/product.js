import express from 'express';
import { addProduct } from '../controllers/Product/addProduct.js';
import { deleteProduct } from '../controllers/Product/deleteProduct.js';
import { editProduct } from '../controllers/Product/editProduct.js';
import getProduct from '../controllers/Product/getProduct.js';
import { getProducts } from '../controllers/Product/getProducts.js';
import {
	createProductReview,
	getPenddingReviews,
	updateApproveOfReviews,
} from '../controllers/Product/Review.js';
import addToRetrievedProducts from '../controllers/Retrieved Product/addToRetrievedProducts.js';
import getRetrievedProducts from '../controllers/Retrieved Product/getRetrievedProducts.js';
import updateAccept from '../controllers/Retrieved Product/updateAccept.js';
import { seller, protect } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.route('/api/product').post(protect, seller, addProduct).get(getProducts);
router.route('/api/review/:slug').post(protect, createProductReview);
router
	.route('/api/review')
	.get(protect, seller, getPenddingReviews)
	.put(protect, seller, updateApproveOfReviews);
router
	.route('/api/product/:slug')
	.put(editProduct)
	.delete(deleteProduct)
	.get(getProduct);

router
	.route('/api/retrieve')
	.post(protect, addToRetrievedProducts)
	.get(protect, seller, getRetrievedProducts)
	.put(protect, seller, updateAccept);

export default router;
