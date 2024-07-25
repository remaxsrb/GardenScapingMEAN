import Booking from "../models/booking";
import Firm from "../models/firm";

class BookingService {
  async create(bookingData: any) {
    const firm = await Firm.findOne(bookingData.firm);

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
    return await Firm.find({}).skip(skip).limit(limit);
  }
  
  async countDocuments() {
    return await Firm.countDocuments();
  }
  
  async finishJob(_id: string, finishDate: Date, jobPhoto: string) {
    const booking = await Booking.findOne({_id});
    
    const updateQuery = { _id: _id };
    const update = {
      finishDate: finishDate,
      photo: jobPhoto
    };

    return await Firm.updateOne(updateQuery, update);
  }
  
}

export default new BookingService();
