import { Product } from '../../models/Product.js';
import Async from 'express-async-handler';

export const getProduct = Async(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug }).populate(
        'reviews subcategory seller'
    );

    const approvedReviews = await product.reviews.filter(
        (r) => r.approve === true
    );
    product.reviews = approvedReviews;

    res.status(200).json({
        success: true,
        data: product,
    });
});

export const getProductById = Async(async (req, res) => {
    const product = await Product.findById(req.params.id).populate(
        'reviews subcategory seller'
    );

    const approvedReviews = await product.reviews.filter(
        (r) => r.approve === true
    );
    product.reviews = approvedReviews;

    res.status(200).json({
        success: true,
        data: product,
    });
});

// export default getProduct;
