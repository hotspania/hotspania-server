"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const admin = new mongoose_1.Schema({
    nombre: String,
    email: String,
    password: String,
    role: Number,
    status: {
        type: Number,
        default: 0
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});
exports.default = (0, mongoose_1.model)('admin', admin);
