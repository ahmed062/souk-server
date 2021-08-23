import Product from '../../models/Product.js';
import currency from 'currency-converter-module';
import slugify from 'slugify';
import Async from 'express-async-handler';

export const getProducts = Async(async (req, res) => {
	const products = await Product.find().exec();
	res.status(200).json({
		success: true,
		data: products,
	});
});
