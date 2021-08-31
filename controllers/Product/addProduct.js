import { Product } from '../../models/Product.js';
import Async from 'express-async-handler';
import slugify from 'slugify';
import { sendAdEmail } from '../User/userEmails.js';
import User from '../../models/User.js';
import multer from 'multer';
import sharp from 'sharp';

let images = [];

export const upload = multer({
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
			return cb(new Error('it must be an image'));
		}

		cb(undefined, true);
	},
});

export const uploadImages = Async(async (req, res) => {
	for (let i = 0; i < req.files.length; i++) {
		let buffer = await sharp(req.files[i].buffer)
			.png()
			.resize({ width: 250, height: 250 })
			.toBuffer();
		images.push(buffer);
	}
	res.send(images);
	console.log(images);
});

export const addProduct = Async(async (req, res) => {
	const product = await Product.findOne({ slug: slugify(req.body.name) });
	const users = await User.find({ role: 'user' });

	if (product != null) {
		return res.status(400).json('The product already exists');
	}
	req.body.images = images;
	if (images.length === 0) {
		return res.status(400).json('The images are required');
	}
	req.body.seller = req.user._id;
	await Product.create(req.body, (err, result) => {
		if (err) console.log('err in add product', err);

		res.json({
			success: true,
			message: `done!`,
			product: result,
		});

		users.map((user) => {
			sendAdEmail(user.email, user.firstName, req, result.name);
		});
		images = [];
	});
});
