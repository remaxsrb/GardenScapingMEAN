import mongoose from "mongoose";

const Schema = mongoose.Schema;
export const Comment = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    type: {
      type: String,
      enum: ["rejection", "review"],
    },
    text: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

export default mongoose.model("Comment", Comment, "comments");
