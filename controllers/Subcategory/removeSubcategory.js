import Async from 'express-async-handler';
import Subcategory from '../../models/Subcategory.js';

const deleteSubcategory = Async(async (req, res) => {
	await Subcategory.findOneAndDelete(
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

export default deleteSubcategory;
