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
  decorator: {
    type: Schema.Types.ObjectId,
    ref: "User", 
    default: null
  },
  firm: {
    type: Schema.Types.ObjectId,
    ref: "Firm",
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  startDate: {
    type: Date,
    default: null
  },
  finishDate: {
    type: Date,
    default: null
  },
  lastServiceDate: {
    type: Date,
    default: null
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
    enum: ["active", "archived", "maintained"],
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