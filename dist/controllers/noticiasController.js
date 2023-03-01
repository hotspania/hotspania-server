"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const noticias_1 = __importDefault(require("../models/noticias"));
class NoticiasController {
    static create(req, res) {
        let { titulo, mensaje, admin } = req.body;
        let a = new noticias_1.default({
            titulo,
            mensaje,
            admin,
        });
        a.save((err, data) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    message: "Error ",
                });
            }
            if (!data) {
                return res.status(401).json({
                    ok: false,
                    message: "Error ",
                });
            }
            return res.status(200).json({
                ok: true,
                data,
            });
        });
    }
    static getActive(req, res) {
        noticias_1.default.find({ status: true }).exec((err, data) => {
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
    static getAll(req, res) {
        noticias_1.default.find({}).exec((err, data) => {
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
    static editnoticias(req, res) {
        let { _id, status } = req.body;
        noticias_1.default
            .updateOne({ _id: _id }, {
            $set: {
                status: status,
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
    static deleteOne(req, res) {
        let { id } = req.body;
        noticias_1.default
            .deleteOne({ _id: id })
            .exec((err, data) => {
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
exports.default = NoticiasController;
