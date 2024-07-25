import mongoose from "mongoose";
import { Garden } from "./garden";

const Schema = mongoose.Schema;
export const Booking = new Schema({
  username: {
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
  requests: {
    type: String
  }
},
{ versionKey: false });

export default mongoose.model("Booking", Booking, "bookings");