import express from "express";
import { BookingController } from "../controllers/booking"; 
const bookingRouter = express.Router();

bookingRouter.route('/create').post(
    (req, res) => new BookingController().create(req, res)
)

bookingRouter.route('/get_active_start_desc').get(
    (req, res) => new BookingController().getActiveStartDesc(req, res)
)

bookingRouter.route('/get_archived_start_desc').get(
    (req, res) => new BookingController().getArchivedStartDesc(req, res)
)

bookingRouter.route('/finishJob').post(
    (req, res) => new BookingController().finishJob(req, res)
)




export default bookingRouter;