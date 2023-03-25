"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const image = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'user'
    },
    autorizo: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'admin'
    },
    url: String,
    status: String,
    tipo: String,
    height: String,
    width: String,
    description: String,
    creado: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false // You should be aware of the outcome after set to false
});
exports.default = (0, mongoose_1.model)('image', image);
