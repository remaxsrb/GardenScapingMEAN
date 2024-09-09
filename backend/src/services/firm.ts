import { ObjectId } from "mongodb";
import Firm from "../models/firm";

class FirmService {
  async create(firmData: any) {
    return await Firm.create(firmData);
  }

  async getIdName() {
    return await Firm.find({}, "_id name");
  }

  async getName(_id: string) {
    const firm = await Firm.findById(_id);
    return firm ? firm.name : null 
  }

  async getPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return await Firm.find({}).skip(skip).limit(limit);
  }

  //write specific get methods for each display view to optimize data flow

  async countDocuments() {
    return await Firm.countDocuments();
  }

  async sortAllByField(field: string, direction: "asc" | "desc") {
    const sortOptions: { [field: string]: "asc" | "desc" | 1 | -1 } = {
      [field]: direction === "desc" ? -1 : 1,
    };
    return await Firm.find({}).sort(sortOptions);
  }

  async sortPaginated(
    page: number,
    limit: number,
    field: string,
    order: 1 | -1,
  ) {
    const sortOptions: { [field: string]: 1 | -1 } = {
      [field]: order,
    };

    const skip = (page - 1) * limit;

    return await Firm.find({}).sort(sortOptions).skip(skip).limit(limit);
  }

  async readByValue(value: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return await Firm.find({field:value}).skip(skip).limit(limit);

  }

  async readByFields(name: string, address: any) {
    const query: { [key: string]: any } = {};

    if (name !== "" && name !== null) {
      query.name = name;
    }
    if (address.street !== "" && address.street !== null) {
      query["address.street"] = address.street;
    }
    if (address.number !== "" && address.number !== null) {
      query["address.number"] = address.number;
    }
    if (address.city !== "" && address.city !== null) {
      query["address.city"] = address.city;
    }

    return await Firm.find(query);
  }

  async rate(ownerReview: number, _id: string | undefined) {
    var newReviewCount = 0;
    var newRating = 0;
    const firm = await Firm.findOne({ _id });
    if (firm) {
      newReviewCount = firm.reviewCount++;
      const newRating = Math.min(
        (firm.rating * firm.reviewCount + ownerReview) / newReviewCount,
        5.0,
      );
    }

    const updateQuery = { _id: _id };
    const update = {
      reviewCount: newReviewCount,
      rating: newRating,
    };

    return await Firm.updateOne(updateQuery, update);
  }
}
export default new FirmService();
