import mongoose from "mongoose";

const Schema = mongoose.Schema;
export const Comment = new Schema({
  username: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  booking: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
},
{ versionKey: false });

export default mongoose.model("Comment", Comment, "comment");

