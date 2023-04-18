"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const notification = new mongoose_1.Schema({
    titulo: String,
    descripcion: String,
    tipo: String,
    fecha_creacion: {
        type: Date,
        default: Date.now,
    },
}, {
    versionKey: false,
});
exports.default = (0, mongoose_1.model)("notification", notification);
