import mongoose from 'mongoose';

const retrievedProductSchema = new mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
		},
		accept: {
			type: Boolean,
			default: false,
		},
		retrieveMoney: {
			type: Number,
			default: 0.0,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Reverse populate with virtuals
retrievedProductSchema.virtual('products', {
	ref: 'Product',
	localField: '_id',
	foreignField: 'product',
	justOne: false,
});
export default mongoose.model('RerievedProduct', retrievedProductSchema);
