import { Product } from '../../models/Product.js';
import Async from 'express-async-handler';
import slugify from 'slugify';
import { sendAdEmail } from '../User/userEmails.js';
import User from '../../models/User.js';

export const addProduct = Async(async (req, res) => {
	const product = await Product.findOne({ slug: slugify(req.body.name) });
	const users = await User.find({ role: 'user' });

	if (product != null) {
		return res.status(400).json('The product already exists');
	}
	if (req.body.images && req.body.images.length === 0) {
		return res.status(400).json('The images are required');
	}
	req.body.seller = req.user._id;
	await Product.create(req.body, (err, result) => {
		if (err) console.log('err in add product', err);

		res.json(
			result && {
				success: true,
				message: 'created :)',
				data: result,
			}
		);

		users.map((user) => {
			sendAdEmail(user.email, user.firstName, req, result.name);
		});
		images = [];
	});
});
