import express from 'express';
import {
    getOrders,
    getSellerProfit,
    updateOrderToPaidProfit,
} from '../controllers/Order/admin.js';
import {
    addOrderItems,
    createExcelSheet,
    getMyOrders,
    getOrderById,
    sendExcelSheet,
    updateOrderToPaid,
} from '../controllers/Order/order.js';
import {
    deleteOrder,
    getSellerCustomers,
    getSellerOrders,
    updateOrderStatus,
    updateOrderToDelivered,
} from '../controllers/Order/seller.js';
import { updateOrderPrice } from '../controllers/Order/useOrderCopon.js';
import { sendExcelEmail } from '../controllers/User/userEmails.js';
import { protect, seller, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, seller, getOrders);
router.route('/sellerorders').get(protect, seller, getSellerOrders);
router.route('/sellercustomers').get(protect, seller, getSellerCustomers);
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
router.route('/:id/status').put(protect, seller, updateOrderStatus);
router.route('/:id/excelsheetcreate').post(protect, seller, createExcelSheet);
router.route('/:id/excelsheetsend').post(protect, seller, sendExcelSheet);

export default router;
