import express from "express";
import bookingService from "../../services/model/booking";
import firmService from "../../services/model/firm";

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

  async allForDecorator(req: express.Request, res: express.Response) {
    try {
     const bookings = await bookingService.allForDecorator(req.query.id as string);

     return res.json(bookings);

    } catch (err: any) {
      res.status(500).send(err);
    }
  }

  async allForFirm(req: express.Request, res: express.Response) {
    try {
     const bookings = await bookingService.allForFirm(req.query.id as string);

     return res.json(bookings);

    } catch (err: any) {
      res.status(500).send(err);
    }
  }

  async getPastDayCount(req: express.Request, res: express.Response) {

    try {
      const count = await bookingService.getPastDayCount();

      return res.json(count);
    } catch (err: any) {
      res.status(500).send(err);
    }
  }

  async getPastTwoYears(req: express.Request, res: express.Response) {

    try {
      const bookings = await bookingService.getPastTwoYears(req.query.id as string);

      return res.json(bookings);
    } catch (err: any) {
      res.status(500).send(err);
    }
  }

  async getPastWeekCount(req: express.Request, res: express.Response) {
    try {
      const count = await bookingService.getPastWeekCount();

      return res.json(count);
    } catch (err: any) {
      res.status(500).send(err);
    }
  }
  async getPastMonthCount(req: express.Request, res: express.Response) {
    try {
      const count = await bookingService.getPastMonthCount();

      return res.json(count);
    } catch (err: any) {
      res.status(500).send(err);
    }
  }


  async handleGetBookings(
    req: express.Request,
    res: express.Response,
    status: string,
    useCase: string
  ) {
    try {
      let _id = req.query.id as string;
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);

      const bookings = await bookingService.sortByDateDesc(
        _id,
        status,
        page,
        limit,
        useCase
      );

      //? dohvata ime firme kad se sorita umesto ID-a

      let updatedBookings = null;
      if (bookings) {
        updatedBookings = await Promise.all(
          bookings.map(async (booking) => {
            return {
              ...booking.toObject(),
              firm: await firmService.getName(booking.firm.toString()),
            };
          })
        );
      }

      const totalDocuments = await bookingService.countDocuments(_id, status, useCase);

      return res.json({
        page,
        limit,
        totalDocuments,
        totalPages: Math.ceil(totalDocuments! / limit),
        bookings: updatedBookings,
      });
    } catch (err: any) {
      res.status(500).send(err);
    }
  }

  async getActiveBookingDesc(req: express.Request, res: express.Response) {
    return this.handleGetBookings(req, res, "active", 'owner');
  }

  async getArchivedBookingDesc(req: express.Request, res: express.Response) {
    return this.handleGetBookings(req, res, "archived", 'owner');
  }

  async sortActiveByFirmDateDesc(req: express.Request, res: express.Response) {
    return this.handleGetBookings(req, res, 'active', "firmNotStarted");
  } 

  async sortJobsToEndForDecoratorDateDesc(req: express.Request, res: express.Response) {
    return this.handleGetBookings(req, res, 'active', "jobsToEndForDecorator");
  } 

  async toRequestMaintaining(req: express.Request, res: express.Response) {
    return this.handleGetBookings(req, res, 'maintained', "maintenanceForOwner");
  } 

  async toMaintain(req: express.Request, res: express.Response) {
    return this.handleGetBookings(req, res, 'maintained', "maintenanceForDecorator");
  } 

  async latestPhotos(req: express.Request, res: express.Response) {
    try {
      const bookings = await bookingService.getLatestPhotos();

      return res.json(bookings);
    } catch (err: any) {
      res.status(500).send(err);
    }
  }

  async acceptJob(req: express.Request, res: express.Response) {
    try {
      const { _id } = req.body;
      const { startDate } = req.body ;
      const { decorator } = req.body;


      await bookingService.acceptJob(_id, decorator, startDate);
      return res.status(200);
    } catch (err: any) {
      res.status(500).send(err);
    }
  }

  async cancelBooking(req: express.Request, res: express.Response) {
    try {
      const {_id} = req.body;
      await bookingService.delete(_id);
      return res.json({ status: 200, message: "Booking  deleted" });
    } catch (err: any) {
      const statusCode = err.status || 500;
      const message = err.message || "Error deleting booking";
      return res.status(statusCode).json({ message });
    }
  }
  

  async finishJob(req: express.Request, res: express.Response) {
    try {
      const { _id } = req.body;
      const { finishDate } = req.body;
      const { photo } = req.body;

      await bookingService.finishJob(_id, finishDate, photo);
      return res.status(200);
    } catch (err: any) {
      res.status(500).send(err);
    }
  }

  async rate(req: express.Request, res: express.Response) {
    try {
      const { _id } = req.body;
      const { rating } = req.body;

      await bookingService.rate(_id, rating);

      const booking = await bookingService.findFirm(_id);

      const firm = booking?.firm.toString();

      await firmService.rate(rating, firm);
      
      return res.status(200);
    } catch (err: any) {
      res.status(500).send(err);
    }
  }

  async requestMaintenance(req: express.Request, res: express.Response) {
    try {
      const { _id } = req.body;

      await bookingService.requestMaintenance(_id);
      return res.status(200);
    } catch (err: any) {
      res.status(500).send(err);
    }
  } 

  async rejectMaintenance(req: express.Request, res: express.Response) {
    try {
      const { _id } = req.body;

      await bookingService.rejectMaintenance(_id);
      return res.status(200);
    } catch (err: any) {
      res.status(500).send(err);
    }
  } 

  async maintain(req: express.Request, res: express.Response) {
    try {
      const { _id } = req.body;
      const { lastServiceDate } = req.body;

      await bookingService.rate(_id, lastServiceDate);
      return res.status(200);
    } catch (err: any) {
      res.status(500).send(err);
    }
  }

}

export default new BookingController();
