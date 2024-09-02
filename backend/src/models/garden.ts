import mongoose from "mongoose";

const Schema = mongoose.Schema;
export const Garden = new Schema({
  width: {
    type: Number,
    required: true,
    min: 1,
  },
  height: {
    type: Number,
    required: true,
    min: 1,
  },
  type: {
    type: String,
    required: true,
    enum: ["private", "restaurant"],
  },
  waterArea: {
    type: Number,
    min:1
  },
  greenArea: {
    type: Number,
    min: 1
  },
  sittingArea: {
    type: Number,
    min: 1
  }

});
