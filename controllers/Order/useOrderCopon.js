import asyncHandler from 'express-async-handler';
import Copon from '../../models/Copon.js';
import Order from '../../models/Order.js';
import { Product } from '../../models/Product.js';

// comparing to arrays and get the common ones in a new array
export const compare = (arr1, arr2) => {
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

// PUT /api/orders/:id/usecopon
// Private
export const updateOrderPrice = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    const { title } = req.body;

    if (order) {
        const copon = await Copon.findOne({ title });

        if (copon) {
            // check if the copon is in the usedCopons array or not
            if (order.usedCopons.indexOf(title) === -1) {
                const result = compare(order.orderItems, copon.products);
                if (result !== []) {
                    // git only the products who's in the result array
                    const products = await Product.find({
                        _id: { $in: result },
                    });

                    // calculating all the prices together and take the descount from each one of it
                    const price = products
                        .map(
                            (item) =>
                                (item.originalPrice =
                                    item.originalPrice -
                                    item.originalPrice * (copon.discount / 100))
                        )
                        .reduce((sum, item) => sum + item);

                    // do the total discount from the total price
                    order.totalPrice -= price;
                    // push the copon to the usedCopons array so we can't use it again
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
