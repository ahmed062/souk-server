import mongoose from 'mongoose';
import slugify from 'slugify';

const subcategorySchema = new mongoose.Schema(
	{
		name: String,
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
		},
		slug: String,
	},
	{
		timestamps: true,
	}
);

subcategorySchema.pre('save', function () {
	this.slug = slugify(this.name);
});

export default mongoose.model('Subcateogry', subcategorySchema);
