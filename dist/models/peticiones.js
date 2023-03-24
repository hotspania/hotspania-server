"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const peticion = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
    },
    mensaje: {
        type: String,
    },
    respuesta: {
        type: String,
    },
    admin: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "admin",
    },
    status: {
        type: String,
        default: 'PENDING'
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    versionKey: false,
});
exports.default = (0, mongoose_1.model)("peticion", peticion);
