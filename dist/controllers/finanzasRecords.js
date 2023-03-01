"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compras_1 = __importDefault(require("../models/compras"));
const ingresos_1 = __importDefault(require("../models/ingresos"));
const finanzasController_1 = __importDefault(require("./finanzasController"));
class RecordsController {
    static addCompra(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { user, paquete, description, amount, profile, admin } = req.body;
            let x = yield finanzasController_1.default.updatefinanzas(amount, user, "output");
            let a = new compras_1.default({
                user,
                profile,
                amount,
                description: description,
                admin,
                paquete
            });
            a.save((err, data) => {
                if (err) {
                    return res.status(401).json({
                        ok: false,
                        message: "Error "
                    });
                }
                if (!data) {
                    return res.status(401).json({
                        ok: false,
                        message: "Error "
                    });
                }
                return res.status(200).json({
                    ok: true
                });
            });
        });
    }
    static addIngreso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { user, paquete, description, amount, profile, admin } = req.body;
            let x = yield finanzasController_1.default.updatefinanzas(amount, user, "input");
            let a = new ingresos_1.default({
                user,
                profile,
                amount,
                description: description,
                admin: admin,
                paquete,
            });
            a.save((err, data) => {
                if (err) {
                    return res.status(401).json({
                        ok: false,
                        message: "Error "
                    });
                }
                if (!data) {
                    return res.status(401).json({
                        ok: false,
                        message: "Error "
                    });
                }
                return res.status(200).json({
                    ok: true
                });
            });
        });
    }
    static getComprasUser(req, res) {
        let id = req.params.id;
        compras_1.default.find({ user: id }).sort({ date: -1 }).exec((err, data) => {
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
    static getIngresosUser(req, res) {
        let id = req.params.id;
        ingresos_1.default.find({ user: id }).sort({ date: -1 }).exec((err, data) => {
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
    static getLastCompras(req, res) {
        compras_1.default.find({}).limit(100).sort({ date: -1 }).exec((err, data) => {
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
    static getLastIngresos(req, res) {
        ingresos_1.default.find({}).limit(100).sort({ date: -1 }).exec((err, data) => {
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
    static deleteRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { item, id, admin, tipo } = req.body;
            if (tipo === 'output') {
                let x = yield finanzasController_1.default.correcionfinanzas(item.amount, id, "output");
                compras_1.default.deleteOne({ _id: item._id }).exec((err, data) => {
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
            else if (tipo === 'input') {
                let x = yield finanzasController_1.default.correcionfinanzas(item.amount, id, "input");
                ingresos_1.default.deleteOne({ _id: item._id }).exec((err, data) => {
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
        });
    }
}
exports.default = RecordsController;
