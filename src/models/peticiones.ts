import { Schema, model } from "mongoose";

const peticion = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    mensaje: {
      type: String,
    },
    respuesta: {
        type: String,
      },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "admin",
    },
    status:{
        type:String,
        default:'PENDING'
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

export default model("peticion", peticion);