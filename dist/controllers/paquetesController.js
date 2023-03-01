"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const package_1 = __importDefault(require("../models/package"));
class PaquetesController {
    static createpaquete(req, res) {
        let { clase, titulo, price, days } = req.body;
        let a = new package_1.default({
            clase,
            titulo,
            price,
            days
        });
        a.save((err, data) => {
            if (err) {
                return res.status(501).json({
                    ok: false,
                    err,
                });
            }
            if (data) {
                return res.status(200).json({
                    ok: true,
                });
            }
        });
    }
    static editpaquete(req, res) {
        let { _id, clase, titulo, price, days, status } = req.body;
        package_1.default
            .updateOne({ _id: _id }, {
            $set: {
                clase,
                titulo,
                price,
                days,
                status,
            },
        })
            .exec((err, data) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if (!data) {
                return res.status(401).json({
                    ok: false,
                    message: "Error no se encuentra ningun record",
                });
            }
            if (data) {
                return res.status(200).json({
                    ok: true,
                    data,
                });
            }
        });
    }
    static getPaquetes(req, res) {
        let { status } = req.query;
        let query = [];
        status ? (query = { status: status }) : (query = {});
        package_1.default.find(query).exec((err, data) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if (!data) {
                return res.status(201).json({
                    ok: false,
                    message: "Error no se encuentra ningun record",
                });
            }
            if (data) {
                return res.status(201).json({
                    ok: true,
                    data,
                });
            }
        });
    }
}
exports.default = PaquetesController;
