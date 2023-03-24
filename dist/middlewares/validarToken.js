"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarJWT = void 0;
const enviroment_1 = require("../global/enviroment");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validarJWT = (req, res, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            message: "Invalid Parameters"
        });
    }
    try {
        const data = jsonwebtoken_1.default.verify(token, enviroment_1.SEED);
        next();
    }
    catch (error) {
        return res.status(401).json({
            ok: false,
            message: "Ingrese de nuevo Session Expirada"
        });
    }
};
exports.validarJWT = validarJWT;
