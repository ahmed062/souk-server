import asyncHandler from 'express-async-handler';
import Order from '../../models/Order.js';
import User from '../../models/User.js';
import { sellerOrders } from './order.js';

// PUT /api/orders/:id/status
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

// GET /api/orders/sellerorders
// Private/seller
export const getSellerOrders = asyncHandler(async (req, res) => {
	const orders = await sellerOrders(req, res);
	res.json(orders);
});

// GET /api/orders/sellercustomers
// Private/seller
export const getSellerCustomers = asyncHandler(async (req, res) => {
	const orders = await sellerOrders(req, res);
	const customers = orders.map((order) => order.user);

	const removeDuplicates = (inputArray) => {
		const ids = [];
		return inputArray.reduce((sum, element) => {
			if (!ids.includes(element.toString())) {
				sum.push(element);
				ids.push(element.toString());
			}
			return sum;
		}, []);
	};
	const uniqueCustomers = removeDuplicates(customers);
	const users = [];
	for (let i = 0; i < uniqueCustomers.length; i++) {
		let user = await User.findById(uniqueCustomers[i]).select(
			'-avatar -password'
		);
		users.push(user);
	}

	res.json(users);
});

// DELETE api/orders/:id
// private/seller
export const deleteOrder = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);

	if (order) {
		await order.remove();
		res.json({ message: 'Order removed' });
	} else {
		res.status(404);
		throw new Error('Order not found');
	}
});
