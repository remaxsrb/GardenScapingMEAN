import mongoose from "mongoose";

const Schema = mongoose.Schema;
export const ServicePricing = new Schema({
  service: {
    type: Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
});
