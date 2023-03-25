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
const admin_1 = __importDefault(require("../models/admin"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Jwt_1 = require("../helpers/Jwt");
class AdminController {
    static login(req, res) {
        let body = req.body;
        admin_1.default
            .findOne({ email: body.email })
            .exec((err, usuarioDB) => __awaiter(this, void 0, void 0, function* () {
            console.log('user', usuarioDB);
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
            console.log();
            if (!bcrypt_1.default.compareSync(body.password, usuarioDB.password)) {
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
            usuarioDB.password = ":D";
            return res.status(200).json({
                ok: true,
                usuarioDB,
                token,
            });
        }));
    }
    static crearUsuario(req, res) {
        const { nombre, email, pass, role } = req.body;
        const password = bcrypt_1.default.hashSync(pass, 10);
        const usuario = new admin_1.default({
            nombre,
            role: role,
            email,
            password: password,
        });
        usuario.save((err, usuarioDB) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    message: "Error ",
                });
            }
            if (!usuarioDB) {
                return res.status(401).json({
                    ok: false,
                    message: "Error ",
                });
            }
            return res.status(200).json({
                ok: true,
            });
        });
    }
    static check(req, res) {
        let email = req.params.id;
        admin_1.default.findOne({ email: email }).exec((err, email) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: "Error",
                    err,
                });
            }
            if (!email) {
                return res.status(200).json({
                    email: true,
                });
            }
            return res.status(200).json({
                email: false,
            });
        });
    }
    static getAdmin(req, res) {
        let id = req.params.id;
        admin_1.default
            .find({ _id: id }, { nombre: true })
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
    static getAllAdmin(req, res) {
        admin_1.default.find({}).exec((err, data) => {
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
    static editAdmin(req, res) {
        let { _id, nombre, role, email, status } = req.body;
        admin_1.default
            .updateOne({ _id: _id }, {
            $set: {
                nombre,
                role: role,
                email,
                status
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
    static changePassword(req, res) {
        let { _id, pass } = req.body;
        let password = bcrypt_1.default.hashSync(pass, 10);
        admin_1.default
            .updateOne({ _id: _id }, {
            $set: {
                password: password,
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
}
exports.default = AdminController;
