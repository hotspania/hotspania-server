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
const dayjs_1 = __importDefault(require("dayjs"));
const profile_1 = __importDefault(require("../models/profile"));
const finanzas_1 = __importDefault(require("../models/finanzas"));
class AnunciosController {
    static addTimeProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, paquete, fecha_inicio } = req.body;
            let data = yield AnunciosController.getRecordProfile(id).then((resp) => resp);
            let inicio = (0, dayjs_1.default)(fecha_inicio).format();
            let $fecha_inicio = (0, dayjs_1.default)(fecha_inicio);
            let x = (parseInt(paquete.days) + 1);
            let fecha_fin = $fecha_inicio.add(x, "day").format();
            profile_1.default
                .updateOne({ user: id }, {
                $set: {
                    fin: fecha_fin,
                    comienzo: inicio,
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
        });
    }
    static checkexist(id) {
        return new Promise((resolve, reject) => {
            finanzas_1.default.find({ user: id }).exec((error, data) => {
                if (error) {
                    reject(error);
                }
                if (!data) {
                    resolve(false);
                }
                if (data) {
                    resolve(true);
                }
            });
        });
    }
    static getProfile(req, res) {
        let id = req.params.id;
        profile_1.default.findOne({ user: id }).exec((err, data) => {
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
    static updateImagesDisponibles(req, res) {
        let { id, imagenes } = req.body;
        profile_1.default
            .updateOne({ user: id }, {
            $set: {
                imagenes: imagenes,
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
    static getRecordProfile(id) {
        return new Promise((resolve, reject) => {
            profile_1.default.findOne({ user: id }).exec((error, data) => {
                if (error) {
                    reject(error);
                }
                if (!data) {
                    resolve(data);
                }
                if (data) {
                    resolve(data);
                }
            });
        });
    }
    static setListados(req, res) {
        let { imagen, id, listados } = req.body;
        profile_1.default
            .updateOne({ user: id }, {
            imagen: imagen,
            listados: listados,
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
    static getProfiles(req, res) {
        profile_1.default
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
    static addmultipaquetes(req, res) {
        let { paquete, usuarios } = req.body;
        usuarios.forEach((element) => __awaiter(this, void 0, void 0, function* () {
            let x = yield AnunciosController.addtime(element, paquete)
                .then((x) => x)
                .catch((error) => error);
        }));
        return res.status(200).json({
            ok: true,
            message: "all ok",
        });
    }
    static addtime(user, paquete) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let fecha_fin_actual = (0, dayjs_1.default)(user.fin);
            // let $fecha_inicio = dayjs(fecha_inicio);
            let x = (parseInt(paquete.days) + 1);
            let fecha_fin = fecha_fin_actual.add(x, "day").format();
            profile_1.default
                .updateOne({ user: user.user._id }, {
                $set: {
                    fin: fecha_fin,
                },
                $inc: { dias: x },
            })
                .exec((err, data) => {
                if (err) {
                    reject(false);
                }
                if (!data) {
                    resolve(false);
                }
                if (data) {
                    resolve(true);
                }
            });
        }));
    }
    static setStates(req, res) {
        let { id, active, freeze, visible, online } = req.body;
        profile_1.default
            .updateOne({ _id: id }, {
            $set: {
                active,
                freeze,
                visible,
                online,
            }
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
    static ajustDays(req, res) {
        let { id, days } = req.body;
        let dias = parseInt(days);
        let fecha = (0, dayjs_1.default)();
        let fecha_fin = fecha.add(dias, "day").format();
        profile_1.default
            .updateOne({ _id: id }, {
            $set: {
                dias: dias,
                fin: fecha_fin
            }
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
exports.default = AnunciosController;
