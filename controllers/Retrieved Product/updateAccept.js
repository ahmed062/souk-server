import Async from 'express-async-handler';
import RetrievedProduct from '../../models/RetrievedProduct.js';

const updateAccept = Async(async (req, res) => {
	await RetrievedProduct.findByIdAndUpdate(
		req.body.id,
		{
			accept: req.body.accept,
			retrieveMoney: req.body.money,
		},
		(err, result) => {
			if (err) return res.status(400).send(err);
			res.json({ success: true, message: 'done!', result });
		}
	);
});

export default updateAccept;
