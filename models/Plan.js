import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
	name: String,
	percent: Number,
});

export default mongoose.model('Plan', planSchema);
