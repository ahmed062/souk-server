import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema(
	{
		name: String,
		image: String,
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
		},
	},
	{
		toJSON: true,
		virtual: true,
	}
);

export default mongoose.model('Subcateogry', subcategorySchema);
