import Subcategory from '../../models/Subcategory.js';
import Async from 'express-async-handler';

const getSubcategories = Async(async (req, res) => {
	res.status(200).json(await Subcategory.find());
});

export default getSubcategories;
