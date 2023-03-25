"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const letra = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'user'
    },
    profile: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'profile'
    },
    active: {
        type: Boolean,
        default: false
    },
    freeze: {
        type: Boolean,
        default: false
    },
    taked: {
        type: Boolean,
        default: false
    },
    number: {
        type: Number,
        unique: true
    },
    dias: Number,
    comienzo: String,
    fin: String,
    creado: {
        type: Date,
        default: Date.now
    },
}, {
    versionKey: false // You should be aware of the outcome after set to false
});
exports.default = (0, mongoose_1.model)('letra', letra);
