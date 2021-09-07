import mongoose from 'mongoose';

const profitSchema = mongoose.Schema(
    {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        price: {
            type: Number,
            required: true,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Profit', profitSchema);
