"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const peticiones_1 = __importDefault(require("../models/peticiones"));
class PeticionesController {
    static create(req, res) {
        let { user, mensaje } = req.body;
        let a = new peticiones_1.default({
            user,
            mensaje,
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
    static getAll(req, res) {
        let query = req.params.id;
        peticiones_1.default.find({ status: query }).populate('user').exec((err, data) => {
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
    static getOne(req, res) {
        let id = req.params.id;
        peticiones_1.default.find({ user: id }).exec((err, data) => {
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
    static editPeticion(req, res) {
        let { _id, status, respuesta, admin } = req.body;
        peticiones_1.default
            .updateOne({ _id: _id }, {
            $set: {
                status,
                respuesta,
                admin,
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
}
exports.default = PeticionesController;
