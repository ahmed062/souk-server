import { Product } from '../../models/Product.js';
import Async from 'express-async-handler';

export const deleteProduct = Async(async (req, res) => {
	const { slug } = req.params;
	await Product.findOneAndDelete({ slug }, (err) => {
		if (err) return res.status(400).send(err);
		res.json({ success: true, message: 'done!' });
	}).exec();
});
