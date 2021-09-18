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

export const extraStatistics = async (req, res) => {
	const products = await Product.find();
	const orders = await Order.find().select('orderItems');
	const pendingOrders = await Order.find({ deliverStatus: 'Pending' });
	const deliveredOrders = await Order.find({ deliverStatus: 'Delivered' });
	const onGoingOrders = await Order.find({ deliverStatus: 'On Going' });
	// let arr = ;
	const soldProducts = orders
		.map((order) => order.orderItems.length)
		.reduce((acc, item) => acc + item, 0);

	const returnedProducts = await RerievedProduct.find({ accept: true });
	const penddingReviews = await Review.find({ approve: false });

	res.json({
		addedProducts: products.length,
		soldProducts,
		returnedProducts: returnedProducts.length,
		penddingReviews: penddingReviews.length,
		orders: {
			totalOrders: orders.length,
			pendingOrders: pendingOrders.length,
			deliveredOrders: deliveredOrders.length,
			onGoingOrders: onGoingOrders.length,
		},
	});
};

export const sellerExtraStatistics = async (req, res) => {
	const products = await Product.find({ seller: req.user._id });
	const orders = await Order.find({
		'orderItems.product': products,
	}).populate('orderItems.product');

	let sellerOrders = orders.map((order) => order.orderItems);
	sellerOrders = sellerOrders.pop(
		(item) => products.indexOf(item.product) !== -1
	);

	const pendingOrders = orders.filter(
		(order) => order.deliverStatus === 'Pending'
	);
	const deliveredOrders = orders.filter(
		(order) => order.deliverStatus === 'Delivered'
	);
	const onGoingOrders = await orders.filter(
		(order) => order.deliverStatus === 'On Going'
	);

	const returnedProducts = await RerievedProduct.find({
		accept: true,
		product: products,
	});
	const penddingReviews = await Review.find({
		approve: false,
		product: products,
	});

	const soldProducts = orders
		.map((order) => order.orderItems.length)
		.reduce((acc, item) => acc + item, 0);

	res.json({
		returnedProducts,
		penddingReviews,
		addedProducts: products.length,
		orders: {
			totalOrders: orders,
			pendingOrders: pendingOrders.length,
			deliveredOrders: deliveredOrders.length,
			onGoingOrders: onGoingOrders.length,
		},
	});
};
