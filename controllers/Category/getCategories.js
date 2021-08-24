import Category from '../../models/Category.js';
import Async from 'express-async-handler';

const getProducts = Async(async (req, res) => {
    const categories = await Category.find().exec();
    res.status(200).json({
        // success: true,
        data: categories,
    });
});

export default getProducts;
