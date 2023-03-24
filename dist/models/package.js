"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paquete = new mongoose_1.Schema({
    clase: String,
    titulo: String,
    price: Number,
    days: Number,
    status: {
        type: Boolean,
        default: true
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false // You should be aware of the outcome after set to false
});
exports.default = (0, mongoose_1.model)('paquete', paquete);
