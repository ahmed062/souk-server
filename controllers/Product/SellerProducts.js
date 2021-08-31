import { Product } from '../../models/Product.js';
import Async from 'express-async-handler';

const sellerProducts = Async(async (req, res) => {
    const sellerId = req.params.sellerId;
    const products = await Product.find({ seller: sellerId });
    res.json({ success: true, data: products });
});

export default sellerProducts;
