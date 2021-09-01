import express from 'express';
import {
    addOrderItems,
    getMyOrders,
    getOrderById,
    getOrders,
    getSellerOrders,
    getSellerProfit,
    updateOrderToDelivered,
    updateOrderToPaid,
    updateOrderToPaidProfit,
} from '../controllers/Order/order.js';
import { updateOrderPrice } from '../controllers/Order/useOrderCopon.js';
import { protect, seller } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, seller, getOrders);
router.route('/sellerorders').get(protect, getSellerOrders);
router.route('/:id/sellerprofit').get(protect, getSellerProfit);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/usecopon').put(protect, updateOrderPrice);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/payprofit').put(protect, updateOrderToPaidProfit);
router.route('/:id/deliver').put(protect, seller, updateOrderToDelivered);

export default router;
