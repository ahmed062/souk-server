import Copon from '../../models/Copon.js';
import asyncHandler from 'express-async-handler';

export const addCopon = asyncHandler(async (req, res) => {
	const { title, discount, expireDate, products } = req.body;

	const copon = await Copon.create({
		owner: req.user._id,
		title,
		discount,
		expireDate,
		products,
	});

	if (copon) {
		res.status(201).json(copon);
	}
});

export const editCopon = asyncHandler(async (req, res) => {
	const { title, discount, expireDate, products } = req.body;

	const copon = await Copon.findById(req.params.id);

	if (copon) {
		let updatedCopon = await Copon.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		updatedCopon = await copon.save();

		res.status(201).json(updatedCopon);
	} else {
		res.status(404);
		throw new Error('There is no copon with this id');
	}
});

// GET /api/copons/:id
// Private/seller
export const getCoponById = asyncHandler(async (req, res) => {
	const copon = await Copon.findById(req.params.id);

	if (copon) {
		res.json(copon);
	} else {
		res.status(404);
		throw new Error('Copon not found');
	}
});

// GET /api/copons/myconpons
// Private/seller
export const getMyCopons = asyncHandler(async (req, res) => {
	const copons = await Copon.find({ owner: req.user._id });
	res.json(copons);
});

// GET /api/copons
// Private/Admin
export const getAllCopons = asyncHandler(async (req, res) => {
	const copons = await Copon.find();

	res.json(copons);
});

// DELETE /api/copons/:id
// private/seller
export const deleteCopon = asyncHandler(async (req, res) => {
	const copon = await Copon.findById(req.params.id);

	if (copon) {
		await copon.remove();
		res.json('Copon removed');
	} else {
		res.status(404);
		throw new Error('Copon not found');
	}
});
