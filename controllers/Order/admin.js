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
    // get orders for the seller
    const orders = await sellerOrders(req, res);

    // checking if there's orders or not
    if (orders.length !== 0) {
        // filter the orders to get only the nonpaid ones
        const newOrders = orders.filter((order) => !order.isPaidProfit);
        // mapping throw it to get only the items not all the order
        const myorderItems = newOrders.map((order) => order.orderItems);
        let price = [];

        // looping throw the items and return just the price
        for (let i = 0; i < myorderItems.length; i++) {
            for (let j = 0; j < myorderItems[i].length; j++) {
                price.push(myorderItems[i][j].price);
            }
        }

        // getting the seller to get the plan from it
        const seller = await User.findById(req.params.id).select(
            '-password -avatar'
        );
        if (seller) {
            const plan = await Plan.findById(seller.plan);
            const profit = plan.percent;
            // calculating all the prices together and take the profit from each one of it
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
