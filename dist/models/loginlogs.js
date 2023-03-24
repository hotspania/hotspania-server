"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const login_log = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'user'
    },
    url: String,
    email: String,
    status: String,
    tipo: String,
    deviceid: String,
    similarity: String,
    error: String,
    creado: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false // You should be aware of the outcome after set to false
});
exports.default = (0, mongoose_1.model)('login_log', login_log);
