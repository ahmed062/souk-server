import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import userRouter from './routes/user.js';
import category from './routes/category.js';
import subcategory from './routes/subcategory.js';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use('/api/users', userRouter);

app.use(category);
app.use(subcategory);

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
	console.log(
		`app is listening in ${process.env.NODE_ENV} mode on port ${process.env.PORT} `
			.yellow.bold
	);
});
