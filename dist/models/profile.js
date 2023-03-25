"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const profile = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'user'
    },
    imagenes: [],
    listados: [],
    imagen: {
        type: String,
        default: ""
    },
    active: {
        type: Boolean,
        default: false
    },
    freeze: {
        type: Boolean,
        default: false
    },
    visible: {
        type: Boolean,
        default: false
    },
    online: {
        type: Boolean,
        default: false
    },
    static: {
        type: Boolean,
        default: false
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
exports.default = mongoose_1.model('profile', profile);
