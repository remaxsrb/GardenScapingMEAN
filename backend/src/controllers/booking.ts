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


  async handleGetBookings(req: express.Request, res: express.Response, status: string) {
    try {
      const _id = req.query.id as string;
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
  
      let bookings = await bookingService.sortByDateDesc(_id, status, page, limit);

      
      const totalDocuments = await bookingService.countDocuments();
  
      return res.json({
        page,
        limit,
        totalDocuments,
        totalPages: Math.ceil(totalDocuments / limit),
        bookings,
      });
    } catch (err: any) {
      res.status(500).send(err);
    }
  }
  
  async getActiveStartDesc(req: express.Request, res: express.Response) {
    return this.handleGetBookings(req, res, "active");
  }
  
  async getArchivedStartDesc(req: express.Request, res: express.Response) {
    return this.handleGetBookings(req, res, "archived");
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
 