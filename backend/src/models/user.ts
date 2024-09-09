import mongoose from "mongoose";
import { Address } from "./address";
import { CreditCard } from "./creditcard";

const Schema = mongoose.Schema;

const User = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      //no regex matching because password will be hased
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "owner", "decorator"],
    },
    firstname: { type: String },
    lastname: { type: String },
    gender: { type: String, enum: ["male", "female"] },
    address: { type: Address },
    phoneNumber: { type: String, match: /^06\d{7,8}$/ },
    creditCardNumber: { type: CreditCard },
    profilePhoto: { type: String, match: /\.(png|jpg)$/i },
    status: {
      type: String,
      enum: ["pending", "active", "banned"],
    },
    firm: {
      type: Schema.Types.ObjectId,
      ref: "Firm",
    },
  },
  { versionKey: false },
);

export default mongoose.model("User", User, "users");
