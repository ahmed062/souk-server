import { Product } from '../../models/Product.js';
import Async from 'express-async-handler';

const getProduct = Async(async (req, res) => {
	const product = await Product.findOne({ slug: req.params.slug }).populate(
		'reviews'
	);

	const approvedReviews = product.reviews.filter((r) => r.approve === true);
	product.reviews = approvedReviews;
	console.log(approvedReviews);
	res.status(200).json({
		success: true,
		data: product,
	});
});

export default getProduct;
