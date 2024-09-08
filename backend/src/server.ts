import express from 'express';
import cors from "cors";
import mongoose from "mongoose";
import bookingRouter from './routers/booking';
import firmRouter from './routers/firm';
import userRouter from './routers/user';
import commentRouter from './routers/comment';
import fileRouter from './routers/file';

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/baste");

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



// Main route
app.use("/", router);

app.listen(4000, () => console.log(`Express server running on port 4000`));