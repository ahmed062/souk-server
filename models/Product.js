import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema(
	{
		name: String,
		images: Array,
		subcategory: {
			type: ObjectId,
			ref: 'Subcateogry',
		},
		originalPrice: Number,
		discountPrice: Number,
		details: String,
		brand: String,
		color: String,
		seller: {
			type: ObjectId,
			ref: 'User',
		},
	},
	{
		toJSON: true,
		virtual: true,
	}
);

export default mongoose.model('Product', productSchema);
