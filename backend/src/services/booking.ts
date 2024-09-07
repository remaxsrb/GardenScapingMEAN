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
    return await Booking.findByIdAndUpdate(_id, {decorator, startDate });
  }


  async finishJob(_id: string, finishDate: Date, jobPhoto: string) {
    const booking = await Booking.findOne({ _id });

    const updateQuery = { _id: _id };
    const update = {
      finishDate: finishDate,
      photo: jobPhoto,
    };

    return await Booking.updateOne(updateQuery, update);
  }
}

export default new BookingService();
