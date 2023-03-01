import { Schema, model } from "mongoose";

const ingreso = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: "profile",
    },   
    amount: {
      type: Number,
    },
    paquete: [],
    description:{
      type:String
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "admin",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

export default model("ingreso", ingreso);
