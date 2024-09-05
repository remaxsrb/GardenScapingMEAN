import mongoose from "mongoose";
import { Garden } from "./garden";
import { Service } from "./service";

const Schema = mongoose.Schema;
export const Booking = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  firm: {
    type: Schema.Types.ObjectId,
    ref: "Firm",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  finishDate: {
    type: Date
  },
  garden: {
    type: Garden,
    required: true
  },
  photo: {
    type: String
  },
  services: [Service],
  requests: {
    type: String
  },
  status: {
    type: String,
    enum: ["active", "archived"],
    default: "active"
  },
  rating: {
    type: Number,
    min:0,
    max:5,
    default: 0
  }

},
{ versionKey: false });

export default mongoose.model("Booking", Booking, "bookings");