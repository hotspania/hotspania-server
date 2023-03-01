import { Schema, model } from "mongoose";

const noticia = new Schema(
  {
    titulo: {
      type: String,
      lowercase: true,
    },
    mensaje: {
      type: String,
      lowercase: true,
    },
    status:{
       type:Boolean,
       default:true, 
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "admin",
    },
    creado: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

export default model("noticia", noticia);
