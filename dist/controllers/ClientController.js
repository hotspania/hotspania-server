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
const profile_1 = __importDefault(require("../models/profile"));
const users_1 = __importDefault(require("../models/users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Jwt_1 = require("../helpers/Jwt");
const loginController_1 = __importDefault(require("./loginController"));
class ClientControler {
    static getFichas(req, res) {
        let term = req.params.category;
        let status = req.query.status;
        let query = "";
        if (term === "all") {
            query = "Lista General";
        }
        else if (term === "barcelona") {
            query = "Lista General";
        }
        else if (term === "vip") {
            query = "V.I.P";
        }
        else if (term === "premium") {
            query = "Premium";
        }
        else if (term === "promo") {
            query = "PROMO";
        }
        else if (term === "disponibles") {
            query = "disponible";
        }
        if (!!status) {
            profile_1.default
                .find({
                listados: { $in: query },
                active: true,
                visible: true,
                online: true,
                freeze: false,
            }, { imagenes: false, listados: false })
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
                    let x = data.map((x) => {
                        return {
                            username: x.user.fakeData.username,
                            online: x.online,
                            imagen: x.imagen,
                        };
                    });
                    const allfichas = (ar) => ar.sort(() => Math.random() - 0.5);
                    let a = allfichas(x);
                    return res.status(201).json({
                        ok: true,
                        data: a,
                    });
                }
            });
        }
        else {
            profile_1.default
                .find({
                listados: { $in: query },
                active: true,
                visible: true,
                freeze: false,
            }, { imagenes: false, listados: false })
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
                    let x = data.map((x) => {
                        return {
                            username: x.user.fakeData.username,
                            online: x.online,
                            imagen: x.imagen,
                        };
                    });
                    const allfichas = (ar) => ar.sort(() => Math.random() - 0.5);
                    let a = allfichas(x);
                    return res.status(201).json({
                        ok: true,
                        data: a,
                    });
                }
            });
        }
    }
    static getFicha(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = req.params.user;
            let username = query.replace("-", " ");
            let $username = username.toLowerCase();
            let fakedata = yield ClientControler.getid($username)
                .then((x) => x)
                .catch((e) => e);
            if (!fakedata) {
                return res.status(401).json({
                    ok: false,
                    message: "No hay usuario",
                });
            }
            else {
                let profile = yield ClientControler.getprofile(fakedata._id)
                    .then((x) => x)
                    .catch((e) => e);
                if (!profile) {
                    return res.status(401).json({
                        ok: false,
                        message: "No hay usuario",
                    });
                }
                else {
                    return res.status(200).json({
                        ok: true,
                        data: fakedata,
                        colletion: profile,
                    });
                }
            }
        });
    }
    static getid(username) {
        return new Promise((resolve, reject) => {
            users_1.default
                .findOne({ "fakeData.username": username }, { realData: false, email: false })
                .exec((err, data) => {
                if (err) {
                    resolve(false);
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
    static getprofile(id) {
        return new Promise((resolve, reject) => {
            profile_1.default
                .findOne({ user: id }, { imagenes: true, imagen: true, online: true })
                .exec((err, data) => {
                if (err) {
                    resolve(false);
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
    static Clientlogin(req, res) {
        let body = req.body;
        users_1.default
            .findOne({ email: body.email })
            .exec((err, usuarioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: "Error",
                    err,
                });
            }
            if (!usuarioDB) {
                return res.status(401).json({
                    ok: false,
                    message: "No se encuentra el usuario",
                });
            }
            if (!bcrypt_1.default.compareSync(body.pass, usuarioDB.pass)) {
                return res.status(400).json({
                    ok: false,
                    message: "Error contraseña incorrectas",
                });
            }
            else {
                usuarioDB.password = ":D";
                return res.status(200).json({
                    ok: true,
                    usuarioDB,
                });
            }
        });
    }
    static ClientApplogin(req, res) {
        let body = req.body;
        users_1.default
            .findOne({ _id: body.id }, { pass: false })
            .exec((err, usuarioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: "Error",
                    err,
                });
            }
            if (!usuarioDB) {
                return res.status(401).json({
                    ok: false,
                    message: "No se encuentra el usuario",
                });
            }
            if (usuarioDB) {
                return res.status(200).json({
                    ok: true,
                    usuarioDB,
                });
            }
        });
    }
    static loginNoFace(req, res) {
        let body = req.body;
        let email = body.email.trim().toLowerCase();
        users_1.default
            .findOne({ email: email })
            .exec((err, usuarioDB) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                let x = yield loginController_1.default.saveLoginNofaceRecord(body.email, "ERROR SERVER", "0", "true");
                return res.status(500).json({
                    ok: false,
                    message: "Error",
                    err,
                });
            }
            if (!usuarioDB) {
                let x = yield loginController_1.default.saveLoginNofaceRecord(body.email, "ERROR CORREO", "0", "true");
                return res.status(401).json({
                    ok: false,
                    message: "No se encuentra el usuario",
                });
            }
            if (!bcrypt_1.default.compareSync(body.pass, usuarioDB.pass)) {
                let x = yield loginController_1.default.saveLoginNofaceRecord(body.email, "ERROR PASSWORD", "0", "true");
                return res.status(400).json({
                    ok: false,
                    message: "Error contraseña incorrectas",
                });
            }
            let payload = {
                id: usuarioDB.id,
                email: usuarioDB.email,
                nombre: usuarioDB.nombre,
            };
            let token = yield (0, Jwt_1.generarJWT)(payload);
            usuarioDB.pass = ":D";
            let x = yield loginController_1.default.saveLoginNofaceRecord(body.email, "EXITOSO", "100", "false");
            return res.status(200).json({
                ok: true,
                usuarioDB,
                token,
            });
        }));
    }
    static setVisible(req, res) {
        let { id, visible } = req.body;
        profile_1.default
            .updateOne({ user: id }, {
            $set: {
                visible,
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
    static getvencimientos(req, res) {
        profile_1.default
            .find({ active: true, dias: { $lt: 10 } }, { imagenes: false, listados: false })
            .populate("user")
            .sort({ dias: 1 })
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
    static StatusToken(req, res) {
        return res.status(200).json({
            ok: true,
        });
    }
}
exports.default = ClientControler;
