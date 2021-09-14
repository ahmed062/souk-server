import mongoose from 'mongoose';
import slugify from 'slugify';
const categorySchema = new mongoose.Schema(
	{
		name: String,
		slug: String,
	},
	{
		timestamps: true,
	}
);
categorySchema.pre('save', function () {
	this.slug = slugify(this.name);
});

export default mongoose.model('Category', categorySchema);
