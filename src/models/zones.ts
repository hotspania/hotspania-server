import { Schema, model } from "mongoose";

const zone = new Schema(
  {
    titulo: String,
  },
  {
    versionKey: false,
  }
);

export default model("zone", zone);
