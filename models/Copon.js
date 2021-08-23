import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;
const coponSchema = new mongoose.Schema(
	{
		title: String,
		code: String,
		expireDate: Date,
		owner: {
			type: ObjectId,
			ref: 'User',
		},
		discount: Number,
		products: [{ type: ObjectId, ref: 'Product' }],
	},
	{
		toJSON: true,
		virtual: true,
	}
);

export default mongoose.model('Copon', coponSchema);
