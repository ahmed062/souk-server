import Async from 'express-async-handler';
import Category from '../../models/Category.js';

const deleteCategory = Async(async (req, res) => {
	await Category.findOneAndDelete(
		{ slug: req.params.slug },
		(err, result) => {
			if (err) return res.status(400).send(err);
			res.status(200).json({
				success: true,
				message: `deleted`,
			});
		}
	);
});

export default deleteCategory;
