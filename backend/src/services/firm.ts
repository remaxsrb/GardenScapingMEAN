import Firm from "../models/firm";

class FirmService {
  async create(firmData: any) {
    return await Firm.create(firmData);
  }

  async getIdName() {
    return await Firm.find({}, "_id name");
  }

  async get(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return await Firm.find({}).skip(skip).limit(limit);
  }

  //write specific get methods for each display view to optimie data flow

  async countDocuments() {
    return await Firm.countDocuments();
  }

  async sortByField(fieldToSort: string, direction: "asc" | "desc") {
    const sortOptions: { [field: string]: "asc" | "desc" | 1 | -1 } = {
      [fieldToSort]: direction === "desc" ? -1 : 1,
    };
    return await Firm.find({}).sort(sortOptions);
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

    return await Firm.findOne(query);
  }

  async rate(ownerReview: number, _id: string) {
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
