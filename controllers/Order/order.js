import asyncHandler from 'express-async-handler';
import Order from '../../models/Order.js';
import { Product } from '../../models/Product.js';
import { sendExcelEmail } from '../User/userEmails.js';
import convertJsonToExcel from './ExcelSheet.js';

// POST /api/orders
// Private
export const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        shippingPrice,
        totalPrice,
        phoneNumber,
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
            shippingPrice,
            totalPrice,
            paymentMethod,
            totalPrice,
            phoneNumber,
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

    sendExcelEmail('ashaban7642@gmail.com', order._id.toString());

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// GET /api/orders/:id/Excel
// Private
export const sentExcelSheet = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    // convertJsonToExcel(order);

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
                _id: orderItems[i].product,
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

// GET /api/orders/myorders
// Private
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

export const sellerOrders = asyncHandler(async (req, res) => {
    const products = await Product.find({ seller: req.user._id });
    const orders = await Order.find({
        'orderItems.product': products,
    });

    const myorders = orders.map((order) => order.orderItems);
    myorders.pop((item) => products.indexOf(item.product) !== -1);

    return orders;
});
