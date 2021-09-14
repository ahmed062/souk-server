import Order from '../../models/Order.js';

export const statistics = async (req, res) => {
	const orders = await Order.find({}).sort('-createdAt').select('createdAt');
	let newOrders = [];
	orders.find((order) => {
		const newItemDate =
			new Date().getDate() - new Date(order.createdAt).getDate();
		if (newItemDate <= 30) {
			return newOrders.push(order);
		}
	});

	try {
		res.json(newOrders);
	} catch (error) {
		res.status(400).json(error);
	}
};
