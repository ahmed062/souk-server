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

    if (order) {
        res.json(order);
        console.log(order._id.toString(11, 35));
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// POST /api/orders/:id/excelsheetcreate
// Private/Seller
export const createExcelSheet = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        convertJsonToExcel(order);
        res.json('created');
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// POST /api/orders/:id/excelsheetsend
// Private/Seller
export const sendExcelSheet = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        sendExcelEmail(req.body.email, order._id);
        res.json('sent');
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
        if (order.isPaid) {
            throw new Error('Order is already paid');
        }
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };

        // add the price to the moneyAfterProfit for the seller
        let productSellers = [];

        for (let i = 0; i < order.orderItems.length; i++) {
            const product = await Product.findById(
                order.orderItems[i].product
            ).select('-images');
            const seller = await User.findById(product.seller).select(
                '-avatar'
            );

            seller.moneyAfterProfit += product.originalPrice;
            await seller.save();
            productSellers.push({
                seller: seller,
                price: product.originalPrice,
            });
        }

        // decrease the qty of the products
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
