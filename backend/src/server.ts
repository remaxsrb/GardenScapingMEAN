import express from 'express';
import dotenv from 'dotenv';
dotenv.config()

import cors from "cors";
import mongoose from "mongoose";
import bookingRouter from './routers/models/booking';
import firmRouter from './routers/models/firm';
import userRouter from './routers/models/user';
import commentRouter from './routers/models/comment';
import fileRouter from './routers/utility/file';
import path from 'path';

import captchaRouter from './routers/utility/captcha';

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI!);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});



// Routers
const router = express.Router();
router.use("/user", userRouter);
router.use("/firm", firmRouter);
router.use("/booking", bookingRouter);
router.use("/comment", commentRouter);
router.use("/file", fileRouter);
router.use("/captcha", captchaRouter);




// Main route
app.use("/", router);
app.use('/files/photos', express.static(path.join(__dirname, '../files/photos')));
app.use('/files/gardens', express.static(path.join(__dirname, '..//files/gardens')));

app.listen(process.env.PORT, () => console.log(`Express server running on port 4000`));