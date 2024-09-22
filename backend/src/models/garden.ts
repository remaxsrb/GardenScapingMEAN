import mongoose from "mongoose";

const Shape = new mongoose.Schema({ 
    id: String,
    type: String,
    color: String,
    width: Number,
    height: Number,
    x: Number,
    y: Number
}

);


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
  },
  layout: {
    type:[Shape],
    required: true
  }

});
