import mongoose from "mongoose";
import { Address } from "./address";
import { Service } from "./service";
import { Vacation } from "./vacation";

const Schema = mongoose.Schema;
const Firm = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: Address,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      match: /^06\d{7,8}$/,
    },
    reviewCount: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    services: [Service],
    vacation: {
      type: Vacation,
      required: true,
    },
  },
  { versionKey: false },
);

export default mongoose.model("Firm", Firm, "firms");
