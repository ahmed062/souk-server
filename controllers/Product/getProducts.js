import { Product } from '../../models/Product.js';
import Async from 'express-async-handler';

export const getProducts = Async(async (req, res) => {
	const products = await Product.find()
		.populate('reviews subcategory seller')
		.select('-images');
	products.map(
		(p) => (p.reviews = p.reviews.filter((r) => r.approve === true))
	);
	res.status(200).json({
		success: true,
		data: products,
	});
});
