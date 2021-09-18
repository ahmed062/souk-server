import { Product, Review } from '../../models/Product.js';
import User from '../../models/User.js';
import Async from 'express-async-handler';
import Order from '../../models/Order.js';
export const createProductReview = Async(async (req, res) => {
	const { rating, comment } = req.body;
	const { slug } = req.params;
	const product = await Product.findOne({ slug }).populate('reviews');
	const user = await User.findOne({ email: req.user.email });

	if (product !== null) {
		const alreadyReviewed = await Review.findOne({
			user: req.user.email,
			product: product._id,
		});

		if (!rating) {
			return res.status(400).json({
				success: false,
				err: 'rating is required',
			});
		}
		if (!comment) {
			return res.status(400).json({
				success: false,
				err: 'comment is required',
			});
		}

		const order = await Order.findOne({
			user: user._id,
			'orderItems.product': product._id,
		});

		if (order == null || order.deliverStatus !== 'Delivered') {
			return res.status(400).json({
				access: false,
				message: 'please buy the product',
			});
		}

		if (alreadyReviewed !== null) {
			return res.status(400).json({
				success: false,
				err: 'you already reviewed it',
			});
		}

		const review = {
			name: user.name,
			rating: Number(rating),
			comment,
			user: user.email,
			product: product._id,
		};
		await Review.create(review).then(async () => {
			const productReview = await Review.find({ product: product._id });
			product.numReviews = productReview.length;
			product.rating =
				productReview.reduce((acc, item) => item.rating + acc, 0) /
				productReview.length;
			await product.save();
			res.status(201).json({
				success: true,
				message: 'thanks for your review',
			});
		});
	}
});

export const getPenddingReviews = Async(async (req, res) => {
	const reviews = await Review.find({ approve: false });
	res.json({ success: true, data: reviews }).populate('product');
});

export const updateApproveOfReviews = Async(async (req, res) => {
	await Review.findByIdAndUpdate(
		req.body.id,
		{
			approve: req.body.approve,
		},
		(err, result) => {
			if (err) return res.status(400).send(err);
			res.json(
				result && {
					success: true,
					message: 'approved :)',
					data: result,
				}
			);
		}
	);
});
