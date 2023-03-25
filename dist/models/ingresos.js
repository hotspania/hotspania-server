"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ingreso = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
    },
    profile: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "profile",
    },
    amount: {
        type: Number,
    },
    paquete: [],
    description: {
        type: String
    },
    admin: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "admin",
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    versionKey: false, // You should be aware of the outcome after set to false
});
exports.default = (0, mongoose_1.model)("ingreso", ingreso);
