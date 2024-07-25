import mongoose from "mongoose";

const Schema = mongoose.Schema;
export const Service = new Schema({
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0 // min 0 in case of a free service promotion
    }
  });