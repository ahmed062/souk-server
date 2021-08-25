import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;
const coponSchema = new mongoose.Schema(
    {
        title: { type: String, unique: true, required: true },
        expireDate: Date,
        owner: {
            type: ObjectId,
            ref: 'User',
            required: true,
        },
        discount: { type: Number, required: true },
        products: [{ type: ObjectId, ref: 'Product', required: true }],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Copon', coponSchema);
