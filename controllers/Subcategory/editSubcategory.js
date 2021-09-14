import Async from 'express-async-handler';
import slugify from 'slugify';
import Subcategory from '../../models/Subcategory.js';

const editSubcategory = Async(async (req, res) => {
	const { name } = req.body;
	if (name) {
		req.body.slug = slugify(name);
	}
	await Subcategory.findOneAndUpdate(
		{ slug: req.params.slug },
		req.body,
		{ new: true, runValidators: true },
		(err, result) => {
			if (err) return res.status(400).send(err);
			res.status(200).json(
				result != null
					? {
							success: true,
							message: 'updated :)',
							data: result,
					  }
					: {
							success: false,
							message: 'not updated :(',
					  }
			);
		}
	);
});

export default editSubcategory;
