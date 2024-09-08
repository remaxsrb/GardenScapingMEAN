import Booking from "../models/booking";
import Firm from "../models/firm";

class BookingService {
  async create(bookingData: any) {
    const firm = await Firm.findById(bookingData.firm);

    if (
      firm!.vacation.start <= bookingData.startDate &&
      bookingData.startDate <= firm!.vacation.end
    )
      throw {
        status: 409,
        message: "Booking date is within firm's vacation period",
      };
    return await Booking.create(bookingData);
  }

  async delete(_id: string) {
    return await Booking.findOneAndDelete({ _id });
  }

  async allForDecorator(decorator:string) {
    return await Booking.find({decorator})
  }

  async getPastDayCount() {
    const past24Hours = new Date();
    past24Hours.setDate(past24Hours.getDate() - 1);

    return await Booking.countDocuments({
      bookingDate: { $gte: past24Hours },
    });
  }

  async getPastWeekCount() {
    const pastDay = new Date();
    pastDay.setDate(pastDay.getDate() - 7);

    return await Booking.countDocuments({
      bookingDate: { $gte: pastDay },
    });
  }

  async getPastMonthCount() {
    const pastMonth = new Date();
    pastMonth.setMonth(pastMonth.getMonth() - 1);

    return await Booking.countDocuments({
      bookingDate: { $gte: pastMonth },
    });
  }

  async all(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return await Booking.find({}).skip(skip).limit(limit);
  }

  async sortByDateDesc(
    entity: string,
    status: string,
    page: number,
    limit: number,
    useCase: string
  ) {
    const skip = (page - 1) * limit;

    switch (useCase) {
      case "owner":
        return await Booking.find({ $and: [{ owner: entity }, { status }] })
          .sort({ bookingDate: -1 })
          .skip(skip)
          .limit(limit);
      case "firmNotStarted":
        return await Booking.find({
          $and: [{ firm: entity }, { status: "active" }, { decorator: null }],
        })
          .sort({ bookingDate: -1 })
          .skip(skip)
          .limit(limit);
      case "jobsToEndForDecorator":
        return await Booking.find({
          $and: [{ decorator: entity }, { status: "active" }],
        })
          .sort({ bookingDate: -1 })
          .skip(skip)
          .limit(limit);
        
      default:
        break;
    }
  }

  async countDocuments(entity: string, status: string, useCase: string) {
    switch (useCase) {
      case "owner":
        return await Booking.countDocuments({
          $and: [{ owner: entity }, { status }],
        });
      case "firmNotStarted":
        return await Booking.countDocuments({
          $and: [{ firm: entity }, { status: "active" }, { decorator: null }],
        });
      case "jobsToEndForDecorator":
        return await Booking.countDocuments({
          $and: [{ decorator: entity }, { status: "active" }],
        });
      default:
        break;
    }
  }

  async acceptJob(_id: string, decorator: string, startDate: Date) {
    return await Booking.findByIdAndUpdate(_id, { decorator, startDate });
  }

  async finishJob(_id: string, finishDate: Date, jobPhoto: string) {
    let update = {};

    if (jobPhoto === "") {
      update = {
        finishDate: finishDate,
        status: "archived",
      };
    } else {
      update = {
        finishDate: finishDate,
        photo: jobPhoto,
        status: "archived",
      };
    }

    return await Booking.findByIdAndUpdate(_id, update);
  }

  async rate(_id: string, rating: number) {
    return await Booking.findByIdAndUpdate(_id, { rating });
  }

  async requestMaintenance(_id: string) {
    return await Booking.findByIdAndUpdate(_id, {status:"maintained"});
  }

  async maintain(_id: string,lastServiceDate: Date) {
    return await Booking.findByIdAndUpdate(_id, {lastServiceDate, status:"archived"});
  }
}

export default new BookingService();
