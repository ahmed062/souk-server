import User from '../../models/User.js';
import Async from 'express-async-handler';
export const addToWishlist = Async(async (req, res) => {
	const user = await User.findOne({ email: req.user.email });

	if (user === null) {
		res.status(401).json('you should login to use the wishlist');
	}
	let { product } = req.body;
	let { wishlist } = user;
	const existWish = wishlist.find((id) => id === product);
	if (existWish) {
		user.wishlist = user.wishlist.filter((id) => id !== existWish);
		await user.save();
		res.json({ success: false, message: 'item removed from wishlist' });
		return;
	}

	wishlist = wishlist.push(product);
	await user.save();
	res.json({
		success: false,
		message: 'item added to wishlist',
	});
});
