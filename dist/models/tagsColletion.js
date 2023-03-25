"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tagcolletion = new mongoose_1.Schema({
    titulo: String,
}, {
    versionKey: false,
});
exports.default = (0, mongoose_1.model)("tagcolletion", tagcolletion);
