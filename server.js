import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';

import { Server, Socket } from 'socket.io';

// routes
import userRouter from './routes/user.js';
import orderRouter from './routes/order.js';
import coponRouter from './routes/copon.js';
import category from './routes/category.js';
import subcategory from './routes/subcategory.js';
import product from './routes/product.js';
import plan from './routes/plan.js';

import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
const app = express();
app.use(cors('*'));
dotenv.config();

connectDB();
app.use(express.json());

// routes
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/copons', coponRouter);
app.use(plan);
app.use(category);
app.use(subcategory);
app.use(product);

app.use(errorHandler);
app.use(notFound);

const server = app.listen(process.env.PORT || 5000, () => {
	console.log(
		`app is listening in ${process.env.NODE_ENV} mode on port ${process.env.PORT} `
			.yellow.bold
	);
});

// chat server
const io = new Server(server);
io.on('connection', (socket) => {
	console.log('made Socket connection', socket.id);
	socket.on('chat', (data) => {
		io.sockets.emit('chat', data);
	});

	socket.on('typing', (data) => socket.broadcast.emit('typing', data));
});
