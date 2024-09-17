import { ObjectId } from "mongodb";
import Firm from "../../models/firm";

class FirmService {
  async create(firmData: any) {
    return await Firm.create(firmData);
  }

  async getIdName() {
    return await Firm.find({}, "_id name");
  }

  async getName(_id: string) {
    const firm = await Firm.findById(_id);
    return firm ? firm.name : null;
  }

  async getPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return await Firm.find({}).skip(skip).limit(limit);
  }

  async countDocuments() {
    return await Firm.countDocuments();
  }

  async countFilteredDocuments(
    name: string,
    street: string,
    number: string,
    city: string
  ) {
    const query: any = {};

    if (name !== "") {
      query.name = { $regex: name, $options: "i" };
    }

    if (street !== "") {
      query["address.street"] = { $regex: street, $options: "i" };

      if (city === "") {
        if (number !== "") {
          query["address.number"] = number;
        }
      } else {
        query["address.city"] = { $regex: city, $options: "i" };

        if (number !== "") {
          query["address.number"] = number;
        }
      }
    }

    return await Firm.countDocuments(query);
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
    order: 1 | -1
  ) {
    const sortOptions: { [field: string]: 1 | -1 } = {
      [field]: order,
    };

    const skip = (page - 1) * limit;

    return await Firm.find({}).sort(sortOptions).skip(skip).limit(limit);
  }

  async search(
    name: string,
    street: string,
    number: string,
    city: string,
    page: number,
    limit: number
  ) {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (name !== "") {
      query.name = { $regex: name, $options: "i" };
    }

    if (street !== "") {
      query["address.street"] = { $regex: street, $options: "i" };

      if (city === "") {
        if (number !== "") {
          query["address.number"] = number;
        }
      } else {
        query["address.city"] = { $regex: city, $options: "i" };

        if (number !== "") {
          query["address.number"] = number;
        }
      }
    }

    return await Firm.find(query).skip(skip).limit(limit).populate("address");
  }

  async rate(ownerReview: number, _id: string | undefined) {
    const firm = await Firm.findById({ _id });
    if (firm) {
      const newReviewCount = firm.reviewCount + 1;
      const newRating = Math.min(
        (firm.rating * firm.reviewCount + ownerReview) / newReviewCount,
        5.0
      );

      const updateQuery = { _id: _id };
      const update = {
        reviewCount: newReviewCount,
        rating: newRating,
      };

      return await Firm.findByIdAndUpdate(updateQuery, update);
    }
  }
}
export default new FirmService();
