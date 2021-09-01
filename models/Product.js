import mongoose from 'mongoose';
import slugify from 'slugify';
const ObjectId = mongoose.Schema.Types.ObjectId;
const reviewSchema = new mongoose.Schema(
	{
		name: String,
		comment: String,
		rating: Number,
		user: {
			type: mongoose.Schema.Types.String,
			ref: 'User',
		},
		approve: { type: Boolean, default: false },
		product: { type: ObjectId, ref: 'Product' },
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
const productSchema = new mongoose.Schema(
	{
		name: String,
		images: [{ type: Buffer }],
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
		rating: { type: Number, default: 0.0 },
		numReviews: { type: Number, default: 0 },
		quantity: Number,
		sku: String,
		mainMaterial: String,
		model: String,
		productionCountry: String,
		productLine: String,
		size: String,
		weight: Number,
		website: String,
		unit: String,
		minimumPurchaseQty: Number,
		tags: Array,
		shippingDays: Number,
		unitPrice: String,
		discountDate: Date,
		seoTags: Array,
		seoDescription: String,
	},

	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);
productSchema.pre('save', function () {
	this.slug = slugify(this.name);
});

// Reverse populate with virtuals
productSchema.virtual('reviews', {
	ref: 'Review',
	localField: '_id',
	foreignField: 'product',
	justOne: false,
});
const Product = mongoose.model('Product', productSchema);
const Review = mongoose.model('Review', reviewSchema);
export { Product, Review };
