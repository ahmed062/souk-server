import express from 'express';
import { addProduct } from '../controllers/Product/addProduct.js';
import { deleteProduct } from '../controllers/Product/deleteProduct.js';
import { editProduct } from '../controllers/Product/editProduct.js';
import {
    getProduct,
    getProductById,
} from '../controllers/Product/getProduct.js';
import { getProducts } from '../controllers/Product/getProducts.js';
import {
    createProductReview,
    getPenddingReviews,
    updateApproveOfReviews,
} from '../controllers/Product/Review.js';
import sellerProducts from '../controllers/Product/SellerProducts.js';
import addToRetrievedProducts from '../controllers/Retrieved Product/addToRetrievedProducts.js';
import getRetrievedProducts from '../controllers/Retrieved Product/getRetrievedProducts.js';
import updateAccept from '../controllers/Retrieved Product/updateAccept.js';
import { seller, protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js';
const router = express.Router();

router.route('/api/product').post(protect, seller, addProduct).get(getProducts);
router
    .route('/api/upload')
    .post(protect, seller, upload.array('images'), async (req, res) => {
        if (req.files[0] == undefined)
            res.status(400).send('please select images');
        res.send(req.files.map((file) => file.filename));
    });

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

router.route('/api/product/single/:id').get(protect, seller, getProductById);
router
    .route('/api/retrieve')
    .post(protect, addToRetrievedProducts)
    .get(protect, seller, getRetrievedProducts)
    .put(protect, seller, updateAccept);

router.route('/api/seller/:sellerId').get(sellerProducts);

export default router;
