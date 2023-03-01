"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const finanzas_1 = __importDefault(require("../models/finanzas"));
const profile_1 = __importDefault(require("../models/profile"));
class FinanzasController {
    static getSumPropertys(req, res) {
        finanzas_1.default
            .aggregate([
            {
                $group: {
                    _id: null,
                    balance: { $sum: "$balance" },
                    pending: { $sum: "$pending" },
                    inputs: { $sum: "$input" },
                },
            },
        ])
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
                    data: data[0],
                });
            }
        });
    }
    static getPendingUsers(req, res) {
        finanzas_1.default
            .find({
            pending: { $gte: 1 },
        }, {
            balance: true,
            pending: true,
            input: true,
            profile: true
        })
            .limit(10)
            .sort({ pending: -1 })
            .populate("user")
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
    static updatefinanzas(amount, id, clase) {
        return new Promise((resolve, reject) => {
            let value = parseInt(amount);
            let p = 0;
            let i = 0;
            let b = 0;
            if (clase === 'input') {
                i = value;
                p = -value;
                b = value;
                finanzas_1.default
                    .updateOne({ user: id }, {
                    $inc: { balance: b, pending: p, input: i }
                })
                    .exec((err, data) => {
                    if (err) {
                        resolve({
                            ok: false,
                            message: "error"
                        });
                    }
                    if (!data) {
                        resolve({
                            ok: false,
                            message: "No find User"
                        });
                    }
                    if (data) {
                        resolve({
                            ok: true,
                            message: "Succedde",
                            data
                        });
                    }
                });
            }
            else if (clase === 'output') {
                p = value;
                b = -value;
                finanzas_1.default
                    .updateOne({ user: id }, {
                    $inc: { balance: b, pending: p }
                })
                    .exec((err, data) => {
                    if (err) {
                        resolve({
                            ok: false,
                            message: "error"
                        });
                    }
                    if (!data) {
                        resolve({
                            ok: false,
                            message: "No find User"
                        });
                    }
                    if (data) {
                        resolve({
                            ok: true,
                            message: "Succedde",
                            data
                        });
                    }
                });
            }
        });
    }
    static correcionfinanzas(amount, id, clase) {
        return new Promise((resolve, reject) => {
            let value = parseInt(amount);
            let p = 0;
            let i = 0;
            let b = 0;
            if (clase === 'input') {
                i = -value;
                p = value;
                b = -value;
                finanzas_1.default
                    .updateOne({ user: id }, {
                    $inc: { balance: b, pending: p, input: i }
                })
                    .exec((err, data) => {
                    if (err) {
                        resolve({
                            ok: false,
                            message: "error"
                        });
                    }
                    if (!data) {
                        resolve({
                            ok: false,
                            message: "No find User"
                        });
                    }
                    if (data) {
                        resolve({
                            ok: true,
                            message: "Succedde",
                            data
                        });
                    }
                });
            }
            else if (clase === 'output') {
                p = -value;
                b = value;
                finanzas_1.default
                    .updateOne({ user: id }, {
                    $inc: { balance: b, pending: p }
                })
                    .exec((err, data) => {
                    if (err) {
                        resolve({
                            ok: false,
                            message: "error"
                        });
                    }
                    if (!data) {
                        resolve({
                            ok: false,
                            message: "No find User"
                        });
                    }
                    if (data) {
                        resolve({
                            ok: true,
                            message: "Succedde",
                            data
                        });
                    }
                });
            }
        });
    }
    static getLastInputs(req, res) {
        finanzas_1.default
            .aggregate([
            {
                $unwind: "$inputs",
            },
            {
                $unwind: "$user",
            },
            {
                $project: {
                    amount: "$inputs.amount",
                    date: "$inputs.date",
                    admin: "$inputs.admin",
                    user: "$user",
                },
            },
        ])
            .limit(10)
            .sort({ date: -1 })
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
    static getFinanzasProfile(req, res) {
        let id = req.params.id;
        finanzas_1.default
            .find({ user: id })
            .populate("user")
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
    static getfinanzasProfiles(req, res) {
        finanzas_1.default
            .find({}, { imagenes: false, listados: false })
            .populate("user")
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
    static getProfiles(req, res) {
        profile_1.default
            .find({ active: true }, { imagenes: false, listados: false })
            .populate("user")
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
exports.default = FinanzasController;
