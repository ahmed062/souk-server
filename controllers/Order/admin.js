import asyncHandler from 'express-async-handler';
import Order from '../../models/Order.js';
import Plan from '../../models/Plan.js';
import User from '../../models/User.js';
import { sellerOrders } from './order.js';

// PUT /api/orders/:id/payprofit
// Private/Admin
export const updateOrderToPaidProfit = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaidProfit = true;
        order.paidProfitAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// GET /api/orders/:id/sellerprofit
// Private/admin
export const getSellerProfit = asyncHandler(async (req, res) => {
    const orders = await sellerOrders(req, res);
    if (orders.length !== 0) {
        const newOrders = orders.filter((order) => !order.isPaidProfit);
        const myorderItems = newOrders.map((order) => order.orderItems);
        let price = [];

        for (let i = 0; i < myorderItems.length; i++) {
            for (let j = 0; j < myorderItems[i].length; j++) {
                price.push(myorderItems[i][j].price);
            }
        }

        const seller = await User.findById(req.params.id).select(
            '-password -avatar'
        );
        if (seller) {
            const plan = await Plan.findById(seller.plan);
            const profit = plan.percent;
            const priceAfterProfit = price
                .map((price) => (price -= price * (profit / 100)))
                .reduce((sum, item) => sum + item);

            res.json(priceAfterProfit);
        } else {
            res.status(404);
            throw new Error('Seller not found');
        }
    } else {
        res.json([]);
    }
});

// GET /api/orders
// Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
    let orders = await Order.find({}).populate('user', 'id name');

    res.json(orders);
});
