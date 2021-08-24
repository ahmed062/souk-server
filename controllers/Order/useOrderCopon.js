import asyncHandler from 'express-async-handler';
import Copon from '../../models/Copon.js';
import Order from '../../models/Order.js';
import Product from '../../models/Product.js';

const compare = (arr1, arr2) => {
    const result = [];
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
            if (arr1[i].product.toString() === arr2[j].toString()) {
                result.push(arr2[j]);
            }
        }
    }

    return result;
};

// PUT /api/orders/:id/price
// Private
export const updateOrderPrice = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    const { title } = req.body;

    if (order) {
        const copon = await Copon.findOne({ title });

        if (copon) {
            if (order.usedCopons.indexOf(title) === -1) {
                const result = compare(order.orderItems, copon.products);
                if (result !== []) {
                    const products = await Product.find({
                        _id: { $in: result },
                    });
                    const price = products
                        .map(
                            (item) =>
                                (item.originalPrice =
                                    item.originalPrice -
                                    item.originalPrice * (copon.discount / 100))
                        )
                        .reduce((sum, item) => sum + item);

                    order.totalPrice -= price;
                    order.usedCopons.push(title);
                    const updatedOrder = await order.save();
                    res.json(updatedOrder);
                } else {
                    throw new Error(
                        'This copon does not support any of these products'
                    );
                }
            } else {
                throw new Error('You have already used this coupon');
            }
        } else {
            res.status(404);
            throw new Error('Copon not found');
        }
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});
