import { Product } from '../../models/Product.js';
import Async from 'express-async-handler';
import slugify from 'slugify';

export const editProduct = Async(async (req, res) => {
	const slug = req.params.slug;
	if (req.body.name) {
		req.body.slug = slugify(req.body.name);
	}

	const product = await Product.findOneAndUpdate(
		{ slug },
		req.body,
		(err) => {
			if (err) return res.status(400).send(err);
		}
	).exec();
	await product.save();
	res.json({ success: true, message: 'done!', product });
});
