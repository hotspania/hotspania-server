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
const users_1 = __importDefault(require("../models/users"));
const photospecs_1 = __importDefault(require("../models/photospecs"));
const images_1 = __importDefault(require("../models/images"));
const profile_1 = __importDefault(require("../models/profile"));
const cronController_1 = __importDefault(require("./cronController"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uploadController_1 = __importDefault(require("./uploadController"));
class UserController {
    //DATOS DE FICHAS
    static createRealData(req, res) {
        let { nombre, dni, telefono, fecha_nacimiento, email } = req.body;
        let $dni = dni.replace(/ /g, "").trim();
        let password = bcrypt_1.default.hashSync($dni, 10);
        //let $telefono = telefono.replace(/ /g, "").trim();
        let $email = email.replace(/ /g, "").trim();
        let a = new users_1.default({
            realData: {
                nombre,
                dni: $dni,
                //telefono: $telefono,
                fecha_nacimiento: null,
            },
            email: $email,
            pass: password,
        });
        a.save((err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                return res.status(501).json({
                    ok: false,
                    err,
                });
            }
            if (data) {
                let { _id } = data;
                let x = yield cronController_1.default.crearProfile(_id)
                    .then((x) => x)
                    .catch((e) => e);
                let y = yield cronController_1.default.crearFinanzas(_id)
                    .then((x) => x)
                    .catch((e) => e);
                return res.status(200).json({
                    ok: true,
                    id: _id,
                });
            }
        }));
    }
    static putFakeData(req, res) {
        let { id, username, edad, fumadora, 
        //atencion,
        //tags,
        idioma, zonas, telefono, whatsapp, llamadas, busto, cintura, genero, estatura, peso, cadera, servicios, 
        //clase,
        inicio, fin, horario_inicio, horario_fin, city, zone, } = req.body;
        users_1.default.updateOne({ _id: id }, {
            $set: {
                fakeData: {
                    username,
                    edad,
                    fumadora,
                    //atencion,
                    //tags,
                    idioma,
                    zonas,
                    telefono,
                    whatsapp,
                    llamadas,
                    busto,
                    cintura,
                    genero,
                    estatura,
                    peso,
                    cadera,
                    servicios,
                    //clase,
                    inicio,
                    fin,
                    horario_inicio,
                    horario_fin,
                    city,
                    zone,
                },
            },
        }, { new: true }).exec((err, data) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if (!data) {
                return res.status(401).json({
                    ok: false,
                    message: "Error no se encuentra el usuario",
                });
            }
            if (data) {
                return res.status(201).json({
                    ok: true,
                    id,
                    message: "Exito usuario modificado",
                });
            }
        });
    }
    static editRealData(req, res) {
        let { id, nombre, dni, telefono, fecha_nacimiento, email } = req.body;
        users_1.default.updateOne({ _id: id }, {
            $set: {
                realData: {
                    nombre,
                    dni,
                    //telefono: telefono.replace(/ /g, "").trim(),
                    fecha_nacimiento,
                },
                email,
            },
        }, { new: true }).exec((err, data) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if (!data) {
                return res.status(401).json({
                    ok: false,
                    message: "Error no se encuentra el usuario",
                });
            }
            if (data) {
                return res.status(201).json({
                    ok: true,
                    id,
                    message: "Exito usuario modificado",
                });
            }
        });
    }
    static getFichas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { name, dni, email, whatsapp, cel, status } = req.query;
            let query = [];
            !!name
                ? query.push({ "realData.nombre": { $regex: `${name}`, $options: "i" } })
                : "";
            !!name
                ? query.push({
                    "fakeData.username": { $regex: `${name}`, $options: "i" },
                })
                : "";
            !!dni
                ? query.push({ "realData.dni": { $regex: `${dni}`, $options: "i" } })
                : "";
            !!email ? query.push({ email: { $regex: `${email}`, $options: "i" } }) : "";
            !!whatsapp
                ? query.push({
                    "fakeData.whatsapp": { $regex: `${whatsapp}`, $options: "i" },
                })
                : "";
            !!cel
                ? query.push({ "realData.telefono": { $regex: `${cel}`, $options: "i" } })
                : "";
            !!status ? query.push({ auth: status }) : "0";
            if (query.length > 0) {
                users_1.default.find({ $or: query }).exec((err, data) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err,
                        });
                    }
                    if (!data) {
                        return res.status(201).json({
                            ok: false,
                            message: "Error no se encuentra ningun usuario",
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
            else {
                users_1.default.find({}).exec((err, data) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err,
                        });
                    }
                    if (!data) {
                        return res.status(201).json({
                            ok: false,
                            message: "Error no se encuentra ningun usuario",
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
    static getFicha(req, res) {
        let id = req.params.id;
        users_1.default.find({ _id: id }, { fakeData: true }).exec((err, data) => {
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
    static getAllFicha(req, res) {
        let id = req.params.id;
        users_1.default.find({ _id: id }).exec((err, data) => {
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
    static changePassword(req, res) {
        let { _id, pass } = req.body;
        let password = bcrypt_1.default.hashSync(pass, 10);
        users_1.default.updateOne({ _id: _id }, {
            $set: {
                pass: password,
            },
        }).exec((err, data) => {
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
    //SPECS DE IMAGENES
    static setSpecs(req, res) {
        let { id, specs } = req.body;
        let a = new photospecs_1.default({
            user: id,
            retoques: specs,
        });
        a.save((err, data) => {
            if (err) {
                return res.status(501).json({
                    ok: false,
                    err,
                });
            }
            if (data) {
                let { _id } = data;
                return res.status(200).json({
                    ok: true,
                    _id,
                });
            }
        });
    }
    static getSpecs(req, res) {
        let id = req.params.id;
        photospecs_1.default.findOne({ user: id }).exec((err, data) => {
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
    //GET IMAGENES
    static getImagesUser(req, res) {
        let id = req.params.id;
        let status = req.params.status;
        let tipo = req.params.tipo;
        images_1.default.find({ user: id, status: status, tipo: tipo }).exec((err, data) => {
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
    static getPendingImagesUser(req, res) {
        let id = req.params.id;
        images_1.default.find({ user: id, status: "PENDING", tipo: "original" }).exec((err, data) => {
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
    static getDniUser(req, res) {
        let id = req.params.id;
        images_1.default.find({ user: id, tipo: "dni" }).exec((err, data) => {
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
    //ACTIVAR PROFILE
    static activarProfile(req, res) {
        let { id } = req.body;
        profile_1.default.updateOne({ user: id }, {
            $set: {
                comienzo: "",
                active: true,
                visible: true,
            },
        }).exec((err, data) => {
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
    static check(req, res) {
        let email = req.params.id;
        users_1.default.findOne({ email: email }).exec((err, email) => {
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
    static checkUsername(req, res) {
        let username = req.params.id;
        users_1.default.findOne({ "fakeData.username": username }).exec((err, username) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: "Error",
                    err,
                });
            }
            if (!username) {
                return res.status(200).json({
                    username: true,
                });
            }
            return res.status(200).json({
                username: false,
            });
        });
    }
    static deleteficha(req, res) {
        let { _id } = req.body;
    }
    static deleteProfile(user) {
        return new Promise((resolve, reject) => {
            profile_1.default
                .deleteOne({ user: user })
                .exec((err, data) => {
                if (err) {
                    resolve(false);
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
    static deleteUser(user) {
        return new Promise((resolve, reject) => {
            users_1.default
                .deleteOne({ user: user })
                .exec((err, data) => {
                if (err) {
                    resolve(false);
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
    static deleteFotos(imagenes, tipo) {
        return new Promise((resolve, reject) => {
            imagenes.forEach((x) => __awaiter(this, void 0, void 0, function* () {
                yield uploadController_1.default.borraArchivo(x, tipo);
            }));
            resolve(true);
        });
    }
}
exports.default = UserController;
