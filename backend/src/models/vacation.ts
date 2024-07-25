import mongoose from "mongoose";

const Schema = mongoose.Schema;
export const Vacation = new Schema({
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    }
  });