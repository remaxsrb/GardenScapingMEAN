import express from "express";
import { BookingController } from "../controllers/booking"; 
const bookingRouter = express.Router();

bookingRouter.route('/create').post(
    (req, res) => new BookingController().create(req, res)
)

bookingRouter.route('/active_booking_desc').get(
    (req, res) => new BookingController().getActiveBookingDesc(req, res)
)

bookingRouter.route('/archived_booking_desc').get(
    (req, res) => new BookingController().getArchivedBookingDesc(req, res)
)

bookingRouter.route('/non_started').get(
    (req, res) => new BookingController().sortActiveByFirmDateDesc(req, res)
)

bookingRouter.route('/jobs_to_finish').get(
    (req, res) => new BookingController().sortJobsToEndForDecoratorDateDesc(req, res)
)

bookingRouter.route('/accept_job').post(
    (req, res) => new BookingController().acceptJob(req, res)
)

bookingRouter.route('/cancel_booking').post(
    (req, res) => new BookingController().cancelBooking(req, res)
)

bookingRouter.route('/finishJob').post(
    (req, res) => new BookingController().finishJob(req, res)
)




export default bookingRouter; 