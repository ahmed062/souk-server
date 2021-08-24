import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// routes
import userRouter from './routes/user.js';
import category from './routes/category.js';
import subcategory from './routes/subcategory.js';
import product from './routes/product.js';

import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
const app = express();

dotenv.config();

connectDB();
app.use(express.json());

// routes
app.use('/api/users', userRouter);
app.use(category);
app.use(subcategory);
app.use(product);

app.use(errorHandler);
app.use(notFound);

app.listen(process.env.PORT || 5000, () => {
    console.log(
        `app is listening in ${process.env.NODE_ENV} mode on port ${process.env.PORT} `
            .yellow.bold
    );
});
