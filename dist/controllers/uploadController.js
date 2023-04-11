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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const image_size_1 = __importDefault(require("image-size"));
const images_1 = __importDefault(require("../models/images"));
const loginlogs_1 = __importDefault(require("../models/loginlogs"));
const enviroment_1 = require("../global/enviroment");
class UploadController {
    static uploadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.files) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "No se ha subido archivo",
                    },
                });
            }
            const id = req.params.id;
            const key = req.params.tipo;
            const archivo = req.files.archivo;
            const fileExt = archivo.mimetype;
            const fileSize = archivo.size;
            let { height, width } = (0, image_size_1.default)(archivo.data);
            const ext = archivo.mimetype.split("/")[1];
            const fileName = `${id}${key}${new Date().getMilliseconds()}.${ext}`;
            let extensionesvalidas = [
                "image/png",
                "image/jpg",
                "image/jpeg",
                "image/webp",
                "image/bmp",
                "image/gif",
                "video/mp4",
                "video/avi",
                "video/3gp",
                "video/mpg",
                "video/mov",
                "video/3gp",
                "video/wmv",
                "video/flv",
            ];
            let keysValors = ["dni", "original", "profile", "edit", "login", "logs"];
            if (fileSize > 4000000) {
                return res.status(400).json({
                    ok: false,
                    message: `Archivo: ${fileName} muy pesado. Escoja otro fichero.`,
                });
            }
            if (extensionesvalidas.indexOf(fileExt) > -1) {
                if (keysValors.includes(key, 0)) {
                    archivo.mv(`${enviroment_1.UPLOADFOLDER}/${key}/${fileName}`, (err) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                message: "error al mover el archivo",
                            });
                        }
                    });
                }
                else {
                    return res.status(401).json({
                        ok: false,
                        message: "Funcion aun no construida",
                    });
                }
                let type = "";
                (key === "original") ? (type = "PENDING") : "";
                (key === "profile") ? (type = "ACCEPTED") : "";
                (key === "dni") ? (type = "ACCEPTED") : "";
                (key === "login") ? (type = "ACCEPTED") : "";
                (key === "logs") ? (type = "ACCEPTED") : "";
                if (key == "dni" || key == "login") {
                    let existe = yield UploadController.checkRecord(id, key).then((data) => data.ok).catch(error => error);
                    if (existe) {
                        UploadController.borraArchivo(existe.url, key);
                        images_1.default.updateOne({ user: id, tipo: key }, {
                            $set: {
                                url: fileName
                            }
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
                                return res.status(200).json({
                                    ok: true,
                                    data,
                                });
                            }
                        });
                    }
                    else {
                        let a = new images_1.default({
                            user: id,
                            url: fileName,
                            status: type,
                            tipo: key,
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
                }
                else if (key == 'logs') {
                    let a = new loginlogs_1.default({
                        user: id,
                        url: fileName,
                        status: type,
                        tipo: key,
                        height: height,
                        width: width
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
                else {
                    let a = new images_1.default({
                        user: id,
                        url: fileName,
                        status: type,
                        tipo: key,
                        height: height,
                        width: width
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
            }
            else {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: "Las extensiones permitidas son " + extensionesvalidas.join(", "),
                        ext: ext,
                    },
                });
            }
        });
    }
    static uploadFiles(req, res) {
        if (!req.files) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se ha subido archivo",
                },
            });
        }
        const archivos = req.files.archivo;
        const id = req.params.id;
        const key = req.params.tipo;
        let filesupload = 0;
        archivos.forEach((archivo) => __awaiter(this, void 0, void 0, function* () {
            let ext = archivo.mimetype.split("/")[1];
            let random = Math.round(Math.random() * 1234);
            const fileName = `${id}${key}${random}-${new Date().getMilliseconds()}.${ext}`;
            const fileSize = archivo.size;
            if (fileSize > 4000000) {
                return res.status(400).json({
                    ok: false,
                    message: `Archivo: ${fileName} muy pesado. Escoja otro fichero.`,
                });
            }
        }));
        archivos.forEach((e) => __awaiter(this, void 0, void 0, function* () {
            let { height, width } = (0, image_size_1.default)(e.data);
            let fileExt = e.mimetype;
            let ext = e.mimetype.split("/")[1];
            let random = Math.round(Math.random() * 1234);
            const fileName = `${id}${key}${random}-${new Date().getMilliseconds()}.${ext}`;
            let extensionesvalidas = [
                "image/png",
                "image/jpg",
                "image/jpeg",
                "image/webp",
                "image/bmp",
                "image/gif",
                "video/mp4",
                "video/avi",
                "video/3gp",
                "video/mpg",
                "video/mov",
                "video/3gp",
                "video/wmv",
                "video/flv",
            ];
            let keysValors = ["dni", "original", "profile", "edit"];
            if (extensionesvalidas.indexOf(fileExt) > -1) {
                if (keysValors.includes(key, 0)) {
                    e.mv(`${enviroment_1.UPLOADFOLDER}/${key}/${fileName}`, (err) => {
                        if (err) {
                        }
                    });
                }
            }
            let type = "";
            (key === "original") ? (type = "PENDING") : "";
            (key === "profile") ? (type = "ACCEPTED") : "";
            (key === "dni") ? (type = "ACCEPTED") : "";
            let upload = yield UploadController.saveFile(id, fileName, type, key, height, width)
                .then((x) => {
                return true;
            })
                .catch((error) => {
                console.log(error);
                return false;
            });
            if (!upload) {
                return res.status(401).json({
                    ok: false,
                    message: "ERROR",
                });
            }
        }));
        return res.status(200).json({
            ok: true,
            message: "Exito Subido todos los archivos",
        });
    }
    static saveFile(user, url, status, tipo, height, width) {
        return new Promise((resolve, reject) => {
            let a = new images_1.default({
                user,
                url,
                status,
                tipo,
                height,
                width
            });
            a.save((err, data) => {
                if (err) {
                    reject({
                        ok: false,
                        err,
                    });
                }
                if (data) {
                    resolve({
                        ok: true,
                    });
                }
            });
        });
    }
    static borraArchivo(fileName, key) {
        let pathImagen = path_1.default.resolve(__dirname, `../../${enviroment_1.UPLOADFOLDER}/${key}/${fileName}`);
        if (fs_1.default.existsSync(pathImagen)) {
            fs_1.default.unlinkSync(pathImagen);
        }
    }
    static checkfolder(rute) {
        let pathFolder = path_1.default.resolve(__dirname, rute);
        if (fs_1.default.existsSync(pathFolder)) {
            return true;
        }
        else {
            fs_1.default.mkdirSync(pathFolder);
            return true;
        }
    }
    static checkRecord(user, key) {
        return new Promise((resolve, reject) => {
            images_1.default.findOne({ user: user, tipo: key }).exec((err, data) => {
                if (err) {
                    reject({
                        ok: false,
                        err,
                    });
                }
                if (!data) {
                    resolve({
                        ok: false
                    });
                }
                if (data) {
                    resolve({
                        ok: data
                    });
                }
            });
        });
    }
}
exports.default = UploadController;
