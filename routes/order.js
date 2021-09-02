import express from 'express';
import {
    getOrders,
    getSellerProfit,
    updateOrderToPaidProfit,
} from '../controllers/Order/admin.js';
import {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
} from '../controllers/Order/order.js';
import {
    deleteOrder,
    getSellerOrders,
    updateOrderToDelivered,
} from '../controllers/Order/seller.js';
import { updateOrderPrice } from '../controllers/Order/useOrderCopon.js';
import { protect, seller, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, seller, getOrders);
router.route('/sellerorders').get(protect, seller, getSellerOrders);
router.route('/:id/sellerprofit').get(protect, admin, getSellerProfit);
router.route('/myorders').get(protect, getMyOrders);
router
    .route('/:id')
    .get(protect, getOrderById)
    .delete(protect, seller, deleteOrder);
router.route('/:id/usecopon').put(protect, updateOrderPrice);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/payprofit').put(protect, admin, updateOrderToPaidProfit);
router.route('/:id/deliver').put(protect, seller, updateOrderToDelivered);

export default router;
