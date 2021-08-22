import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';

dotenv.config();

connectDB();

const app = express();

app.listen(process.env.PORT || 5000, () => {
    console.log(
        `app is listening in ${process.env.NODE_ENV} mode on port ${process.env.PORT} `
            .yellow.bold
    );
});
