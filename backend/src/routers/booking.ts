import express from "express";
import { BookingController } from "../controllers/booking";
const bookingRouter = express.Router();

bookingRouter
  .route("/create")
  .post((req, res) => new BookingController().create(req, res));

bookingRouter
  .route("/active_booking_desc")
  .get((req, res) => new BookingController().getActiveBookingDesc(req, res));

bookingRouter
  .route("/archived_booking_desc")
  .get((req, res) => new BookingController().getArchivedBookingDesc(req, res));

bookingRouter
  .route("/non_started")
  .get((req, res) =>
    new BookingController().sortActiveByFirmDateDesc(req, res)
  );

bookingRouter
  .route("/jobs_to_finish")
  .get((req, res) =>
    new BookingController().sortJobsToEndForDecoratorDateDesc(req, res)
  );

  bookingRouter
  .route("/all_for_decorator")
  .get((req, res) =>
    new BookingController().allForDecorator(req, res)
  );


bookingRouter
  .route("/past_day_count")
  .get((req, res) => new BookingController().getPastDayCount(req, res));
bookingRouter
  .route("/past_week_count")
  .get((req, res) => new BookingController().getPastWeekCount(req, res));

bookingRouter
  .route("/past_month_count")
  .get((req, res) => new BookingController().getPastMonthCount(req, res));

bookingRouter
  .route("/accept_job")
  .post((req, res) => new BookingController().acceptJob(req, res));

bookingRouter
  .route("/cancel_booking")
  .post((req, res) => new BookingController().cancelBooking(req, res));

bookingRouter
  .route("/finish_job")
  .post((req, res) => new BookingController().finishJob(req, res));

bookingRouter
  .route("/rate")
  .post((req, res) => new BookingController().rate(req, res));

  bookingRouter
  .route("/request_maintenance")
  .post((req, res) => new BookingController().requestMaintenance(req, res));

  bookingRouter
  .route("/maintain")
  .post((req, res) => new BookingController().maintain(req, res));

export default bookingRouter;
