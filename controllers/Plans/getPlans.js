import Async from 'express-async-handler';
import Plan from '../../models/Plan.js';

const getPlans = Async(async (req, res) => {
	const plans = await Plan.find();
	res.json(plans);
});

export default getPlans;
