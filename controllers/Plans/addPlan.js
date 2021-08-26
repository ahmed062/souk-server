import Async from 'express-async-handler';
import Plan from '../../models/Plan.js';

const addPlan = Async(async (req, res) => {
	await Plan.create(req.body, (err) => {
		if (err) return res.status(400).send(err);
		res.json({ success: true, message: 'done!' });
	});
});

export default addPlan;
