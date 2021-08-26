import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
const wishlistSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
});

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
            required: true,
            minLength: 6,
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        phone: {
            type: String,
        },
        country: {
            type: String,
            required: true,
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
        wishlist: [wishlistSchema],
    },
    {
        timestamps: true,
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
