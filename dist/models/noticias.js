"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const noticia = new mongoose_1.Schema({
    titulo: {
        type: String,
        lowercase: true,
    },
    mensaje: {
        type: String,
        lowercase: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    admin: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "admin",
    },
    creado: {
        type: Date,
        default: Date.now,
    },
}, {
    versionKey: false,
});
exports.default = (0, mongoose_1.model)("noticia", noticia);
