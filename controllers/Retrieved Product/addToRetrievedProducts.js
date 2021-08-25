import Async from 'express-async-handler';
import RetrievedProduct from '../../models/RetrievedProduct.js';

const addToRetrievedProducts = Async(async (req, res) => {
	await RetrievedProduct.create(req.body, (err) => {
		if (err) return res.status(400).send(err);
		res.json({ success: true, message: 'done!' });
	});
});

export default addToRetrievedProducts;
