import { Schema, model } from "mongoose";

const tagcolletion = new Schema(
  {
    titulo: String,
  },
  {
    versionKey: false,
  }
);

export default model("tagcolletion", tagcolletion);
