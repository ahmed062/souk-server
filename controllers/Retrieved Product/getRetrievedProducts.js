import Async from 'express-async-handler';
import RetrievedProduct from '../../models/RetrievedProduct.js';

const getRetrievedProducts = Async(async (req, res) => {
	const retrieves = await RetrievedProduct.find().populate('product');
	res.json(retrieves);
});

export default getRetrievedProducts;
