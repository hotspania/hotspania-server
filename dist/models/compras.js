"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const compra = new mongoose_1.Schema({
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
    description: {
        type: String
    },
    paquete: [],
    admin: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "admin",
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    versionKey: false,
});
exports.default = mongoose_1.model("compra", compra);
