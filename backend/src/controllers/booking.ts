import express from "express";
import bookingService from "../services/booking";

export class BookingController {
  async create(req: express.Request, res: express.Response) {
    try {
      await bookingService.create(req.body);
      return res.json({ status: 201, message: "Booking  created" });
    } catch (err: any) {
      const statusCode = err.status || 500;
      const message = err.message || "Error creating a booking";
      return res.status(statusCode).json({ message });
    }
  }

  async getActiveStartDesc(req: express.Request, res: express.Response) {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);

      const firms = await bookingService.sortActiveByDateDesc(page, limit);
      const totalDocuments = await bookingService.countDocuments();

      return res.json({
        page,
        limit,
        totalDocuments,
        totalPages: Math.ceil(totalDocuments / limit),
        firms,
      });
    } catch (err: any) {
      res.status(500).send(err);
    }
  }

  async getArchivedStartDesc(req: express.Request, res: express.Response) {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);

      const firms = await bookingService.sortArchivedByDateDesc(page, limit);
      const totalDocuments = await bookingService.countDocuments();

      return res.json({
        page,
        limit,
        totalDocuments,
        totalPages: Math.ceil(totalDocuments / limit),
        firms,
      });
    } catch (err: any) {
      res.status(500).send(err);
    }
  }
  
  async finishJob(req: express.Request, res: express.Response) {
    try {
      const { _id } = req.body;
      const { finishDate } = req.body;
      const { jobPhoto } = req.body;
      
      await bookingService.finishJob(_id, finishDate, jobPhoto);
      return res.status(200);

    } catch (err: any) {
      res.status(500).send(err);
    }
  }
  
}
export default new BookingController();
