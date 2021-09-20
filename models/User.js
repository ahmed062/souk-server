import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const usersSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            minLength: 6,
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        phone: {
            type: String,
        },
        country: {
            type: String,
        },
        address1: {
            type: String,
        },
        address2: {
            type: String,
        },
        verificationCode: {
            type: String,
        },
        role: {
            type: String,
            enum: ['admin', 'user', 'seller'],
            default: 'user',
        },
        avatar: {
            type: Buffer,
        },
        plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
        moneyAfterProfit: Number,
        orderAmount: { type: Number, default: 0 },
        wishlist: Array,
        ban: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

usersSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

usersSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Generate and hash password token
usersSchema.methods.getResetPasswordToken = function () {
    // Genetate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

export default mongoose.model('User', usersSchema);
