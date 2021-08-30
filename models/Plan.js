import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
	name: { type: String, default: 'customer' },
	percent: Number,
});

export default mongoose.model('Plan', planSchema);
