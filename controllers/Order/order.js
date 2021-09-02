import asyncHandler from 'express-async-handler';
import Order from '../../models/Order.js';
import Plan from '../../models/Plan.js';
import { Product } from '../../models/Product.js';
import User from '../../models/User.js';
import { getUserById } from '../User/admin.js';

// POST /api/orders
// Private
export const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
        return;
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }
});

// GET /api/orders/:id
// Private
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// PUT /api/orders/:id/pay
// Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };
        const { orderItems } = order;
        for (let i = 0; i < orderItems.length; i++) {
            let product = await Product.findOne({
                slug: orderItems[i].product,
            }).exec();
            productQty = product.quantity;
            product.quantity = productQty - orderItems[i].qty;
            product = await product.save();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// PUT /api/orders/:id/payprofit
// Private
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

// GET /api/orders/:id/status
// Private/Seller
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.deliverStatus = req.body.deliverStatus || order.deliverStatus;

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// GET /api/orders/:id/deliver
// Private/Seller
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.deliverStatus = 'Delivered';
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// GET /api/orders/myorders
// Private
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

const sellerOrders = asyncHandler(async (req, res) => {
    const products = await Product.find({ seller: req.user._id });
    const orders = await Order.find({
        'orderItems.product': products,
    });

    const myorders = orders.map((order) => order.orderItems);
    myorders.pop((item) => products.indexOf(item.product) !== -1);

    return orders;
});

// GET /api/orders/sellerorders
// Private/seller
export const getSellerOrders = asyncHandler(async (req, res) => {
    const orders = await sellerOrders(req, res);
    res.json(orders);
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
