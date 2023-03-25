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
const loginlogs_1 = __importDefault(require("../models/loginlogs"));
const images_1 = __importDefault(require("../models/images"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const enviroment_1 = require("../global/enviroment");
const uploadController_1 = __importDefault(require("./uploadController"));
const Jwt_1 = require("../helpers/Jwt");
class LoginController {
    static checkFace(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, device, image, error } = req.body;
            let key = "logs";
            let key2 = "login";
            const fileName = `${id}${key}${new Date().getMilliseconds() * 5263}.jpg`;
            let dir = path_1.default.resolve(__dirname, `../../${enviroment_1.UPLOADFOLDER}/${key}/${fileName}`);
            fs_1.default.writeFileSync(`${dir}`, image, "base64");
            let logindata = yield uploadController_1.default.checkRecord(id, "login")
                .then((x) => x.ok)
                .catch((e) => false);
            if (!logindata) {
                return res.status(400).json({
                    ok: false,
                    message: "Error Rostro incorrecto",
                });
            }
            else {
                let TargetImage = fs_1.default.readFileSync(path_1.default.resolve(__dirname, `../../${enviroment_1.UPLOADFOLDER}/${key}/${fileName}`));
                let SourceImage = fs_1.default.readFileSync(path_1.default.resolve(__dirname, `../../${enviroment_1.UPLOADFOLDER}/${key2}/${logindata.url}`));
                if (!enviroment_1.AWS_KEY_VALUE || !enviroment_1.AWS_REGION_VALUE || !enviroment_1.AWS_SECRET_KEY_VALUE)
                    throw new Error("Missing aws enviroment vars");
                const client = new aws_sdk_1.default.Rekognition({
                    accessKeyId: enviroment_1.AWS_KEY_VALUE,
                    secretAccessKey: enviroment_1.AWS_SECRET_KEY_VALUE,
                    region: enviroment_1.AWS_REGION_VALUE,
                });
                // Usando un FileStream para enviar a AWS
                let params = {
                    TargetImage: {
                        Bytes: TargetImage,
                    },
                    SourceImage: {
                        Bytes: SourceImage,
                    },
                    SimilarityThreshold: 0,
                };
                client.compareFaces(params, function (err, response) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            let similarity = 0;
                            let x = yield LoginController.saveLoginRecord(id, fileName, device, similarity, error)
                                .then((x) => x)
                                .catch((e) => e);
                            return res.status(400).json({
                                ok: false,
                                message: "Error Rostro incorrecto",
                            });
                        }
                        else {
                            let similarity = response.FaceMatches[0].Similarity;
                            let x = yield LoginController.saveLoginRecord(id, fileName, device, similarity, error)
                                .then((x) => x)
                                .catch((e) => e);
                            if (similarity > 90) {
                                let user = yield LoginController.getUser(id)
                                    .then((x) => x[0])
                                    .catch((e) => false);
                                if (!user) {
                                    return res.status(400).json({
                                        ok: false,
                                        message: "Error contraseña incorrectas",
                                    });
                                }
                                let payload = {
                                    id: id,
                                    email: user.email,
                                    nombre: user.fakeData.username,
                                };
                                let token = yield (0, Jwt_1.generarJWT)(payload);
                                return res.status(200).json({
                                    ok: true,
                                    token,
                                    user: id,
                                });
                            }
                            else {
                                return res.status(400).json({
                                    ok: false,
                                    message: "Error contraseña incorrectas",
                                });
                            }
                        } // if
                    });
                });
            }
        });
    }
    static getUser(id) {
        return new Promise((resolve, reject) => {
            users_1.default.find({ _id: id }).exec((err, data) => {
                if (err) {
                    reject(false);
                }
                if (!data) {
                    reject(false);
                }
                if (data) {
                    resolve(data);
                }
            });
        });
    }
    static saveLoginRecord(id, filename, device, similarity, error) {
        return new Promise((resolve, reject) => {
            let a = new loginlogs_1.default({
                user: id,
                url: filename,
                deviceid: device,
                similarity,
                error
            }).save((err, data) => {
                if (err) {
                    reject(false);
                }
                if (!data) {
                    reject(false);
                }
                if (data) {
                    resolve(data);
                }
            });
        });
    }
    static saveLoginNofaceRecord(email, status, similarity, error) {
        return new Promise((resolve, reject) => {
            let a = new loginlogs_1.default({
                email: email,
                status: status,
                similarity,
                error
            }).save((err, data) => {
                if (err) {
                    reject(false);
                }
                if (!data) {
                    reject(false);
                }
                if (data) {
                    resolve(data);
                }
            });
        });
    }
    static getRecords(req, res) {
        let number = parseInt(req.params.id);
        let skip = parseInt(req.params.skip);
        loginlogs_1.default.find({}).populate('user').limit(number).skip(skip).sort({ 'creado': -1 })
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
    static getLoginImage(req, res) {
        let id = req.params.id;
        images_1.default.findOne({ user: id, tipo: 'login' })
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
    static renovarToken(req, res, next) {
        const token = req.header('x-token');
        if (!token) {
            return res.status(401).json({
                ok: false,
                message: "Invalid Parameters"
            });
        }
        try {
        }
        catch (error) {
            return res.status(401).json({
                ok: false,
                message: "Invalid Parameters Token"
            });
        }
    }
}
exports.default = LoginController;
