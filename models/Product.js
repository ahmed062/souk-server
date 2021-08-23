import mongoose from 'mongoose';
import slugify from 'slugify';
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
		slug: { type: String, unique: true },
	},
	{
		toJSON: true,
		virtual: true,
	}
);
productSchema.pre('save', function () {
	this.slug = slugify(this.name);
});

export default mongoose.model('Product', productSchema);
