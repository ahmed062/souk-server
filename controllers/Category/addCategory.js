import Async from 'express-async-handler';
import Category from '../../models/Category.js';

const addCategory = Async(async (req, res) => {
	const category = await Category.findOne({ name: req.body.name });
	if (category != null)
		res.status(400).json({
			success: false,
			message: 'the category already exists',
		});
	else {
		const newCategory = await Category.create(req.body);
		res.status(201).json({
			success: true,
			message: `${newCategory.name} has been created successfully`,
			data: newCategory,
		});
	}
});

export default addCategory;
