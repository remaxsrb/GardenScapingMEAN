import express from "express";
import { BookingController } from "../controllers/booking"; 
const bookingRouter = express.Router();

bookingRouter.route('/create').post(
    (req, res) => new BookingController().create(req, res)
)

bookingRouter.route('/all/:page/:limit').get(
    (req, res) => new BookingController().all(req, res)
)

bookingRouter.route('/finishJob').post(
    (req, res) => new BookingController().all(req, res)
)




export default bookingRouter;