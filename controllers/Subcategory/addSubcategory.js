import Async from 'express-async-handler';
import Subcateogry from '../../models/Subcategory.js';

const addSubcategory = Async(async (req, res) => {
	const subcategory = await Subcateogry.findOne({ name: req.body.name });
	if (subcategory != null)
		res.status(400).json({
			success: false,
			message: 'the subcategory already exists',
		});
	else {
		const newSubcategory = await Subcateogry.create(req.body);
		res.status(201).json({
			success: true,
			message: `${newSubcategory.name} has been created successfully`,
			data: newSubcategory,
		});
	}
});

export default addSubcategory;
