import Product from '../../models/Product.js';
import Async from 'express-async-handler';
import slugify from 'slugify';

export const addProduct = Async(async (req, res) => {
	const product = await Product.findOne({ slug: slugify(req.body.name) });
	if (product != null) {
		return res.status(400).json('The product already exists');
	}
	if (req.body.images.length === 0) {
		return res.status(400).json('The images are required');
	}
	await Product.create(req.body, (err) => {
		if (err) console.log('err in add product', err);
		res.json({
			success: true,
			message: `done!`,
		});
	});
});
