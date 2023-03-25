"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const letra_1 = __importDefault(require("../models/letra"));
const dayjs_1 = __importDefault(require("dayjs"));
class LetraController {
    static crear(req, res) {
        let { position } = req.body;
        let $pos = parseInt(position);
        let a = new letra_1.default({
            number: $pos,
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
    static getAll(req, res) {
        letra_1.default
            .find({})
            .populate("user")
            .populate("profile")
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
    static asignar(req, res) {
        let { user, profile, dias, id, fecha_inicio, active, taked } = req.body;
        let $fecha_inicio = (0, dayjs_1.default)(fecha_inicio);
        let x = parseInt(dias);
        let fecha_fin = $fecha_inicio.add(x, "day").format();
        letra_1.default
            .updateOne({ _id: id }, {
            $set: {
                user: user,
                profile: profile,
                active: active,
                taked: taked,
                fin: fecha_fin,
                comienzo: $fecha_inicio,
            },
            $inc: { dias: x },
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
    static GetActive() {
        return new Promise((resolve, reject) => {
            letra_1.default
                .find({ active: true }, { user: false })
                .exec((err, data) => {
                if (err) {
                    reject(false);
                }
                if (!data) {
                    resolve(false);
                }
                if (data) {
                    resolve(data);
                }
            });
        });
    }
}
exports.default = LetraController;
