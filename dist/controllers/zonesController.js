"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zones_1 = __importDefault(require("../models/zones"));
class ZonesController {
    static SaveZone(req, res) {
        let { titulo } = req.body;
        let a = new zones_1.default({
            titulo
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
                    ok: true
                });
            }
        });
    }
    static getZones(req, res) {
        zones_1.default.find({}).exec((err, data) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!data) {
                return res.status(201).json({
                    ok: false,
                    message: 'Error no se encuentra ningun record'
                });
            }
            if (data) {
                return res.status(201).json({
                    ok: true,
                    data
                });
            }
        });
    }
    static editZone(req, res) {
        let { _id, titulo } = req.body;
        zones_1.default.updateOne({ '_id': _id }, {
            $set: {
                titulo: titulo
            }
        }).exec((err, data) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!data) {
                return res.status(201).json({
                    ok: false,
                    message: 'Error no se encuentra ningun record'
                });
            }
            if (data) {
                return res.status(201).json({
                    ok: true,
                    data
                });
            }
        });
    }
    static deleteZone(req, res) {
        let id = req.params.id;
        zones_1.default.deleteOne({ '_id': id }).exec((err, data) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!data) {
                return res.status(201).json({
                    ok: false,
                    message: 'Error no se encuentra ningun record'
                });
            }
            if (data) {
                return res.status(201).json({
                    ok: true,
                    data
                });
            }
        });
    }
}
exports.default = ZonesController;
