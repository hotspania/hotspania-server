"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const finanza = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'user'
    },
    balance: {
        type: Number,
        default: 0
    },
    input: {
        type: Number,
        default: 0
    },
    pending: {
        type: Number,
        default: 0
    },
    creado: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false // You should be aware of the outcome after set to false
});
exports.default = (0, mongoose_1.model)('finanza', finanza);
