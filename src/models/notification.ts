import { Schema, model } from "mongoose";

const notification = new Schema(
  {
    titulo: String,
    descripcion: String,
    tipo: String,
    fecha_creacion: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

export default model("notification", notification);
