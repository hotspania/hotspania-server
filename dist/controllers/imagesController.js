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
const images_1 = __importDefault(require("../models/images"));
const profile_1 = __importDefault(require("../models/profile"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uploadController_1 = __importDefault(require("./uploadController"));
const adm_zip_1 = __importDefault(require("adm-zip"));
class ImagesController {
    static changeImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { user, url, tipo, _id } = req.body;
            let save = yield ImagesController.saveImage(user, url, tipo)
                .then((ok) => ok)
                .catch((error) => error);
            images_1.default.updateOne({ _id: _id }, {
                $set: {
                    status: "ACCEPTED",
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
        });
    }
    static rejectImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { mensaje, id } = req.body;
            images_1.default.updateOne({ _id: id }, {
                $set: {
                    status: "DENNIED",
                    description: mensaje,
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
        });
    }
    static changestatusImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, status } = req.body;
            images_1.default.updateOne({ _id: id }, {
                $set: {
                    status: status
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
        });
    }
    static saveImage(user, url, tipo) {
        return new Promise((resolve, reject) => {
            let pathFile = path_1.default.resolve(__dirname, `../../uploads/${tipo}/${url}`);
            let destFile = path_1.default.resolve(__dirname, `../../uploads/profile/${url}`);
            fs_1.default.copyFileSync(pathFile, destFile);
            let a = new images_1.default({
                user: user,
                url: url,
                tipo: "profile",
                status: "ACCEPTED",
            });
            a.save((err, data) => {
                if (err) {
                    reject({
                        ok: false,
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
    static deleteImagebyuser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { _id, key, url, user } = req.body;
            yield ImagesController.deleteOnprofile(user, url).then(x => x).catch(e => e);
            images_1.default.updateOne({ _id: _id }, {
                $set: {
                    status: "DELETED"
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
                    return res.status(201).json({
                        ok: true,
                    });
                }
            });
        });
    }
    static deleteImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { _id, key, url, user } = req.body;
            uploadController_1.default.borraArchivo(url, key);
            yield ImagesController.deleteOnprofile(user, url).then(x => x).catch(e => e);
            images_1.default.deleteOne({ _id: _id }).exec((err, data) => {
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
                    });
                }
            });
        });
    }
    static deleteOnprofile(user, url) {
        return new Promise((resolve, reject) => {
            profile_1.default.findOne({ user: user }).exec((err, data) => {
                if (err) {
                    reject(false);
                }
                if (!data) {
                    reject(false);
                }
                if (data) {
                    let x = data.imagenes.filter((x) => x !== url);
                    profile_1.default.updateOne({ user: user }, { $set: {
                            imagenes: x
                        } }).exec((err, data) => {
                        if (err) {
                            reject(false);
                        }
                        if (!data) {
                            reject(false);
                        }
                        if (data) {
                            resolve(true);
                        }
                    });
                }
            });
        });
    }
    static rejectImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { mensaje, data } = req.body;
            let count = 0;
            yield data.forEach((item) => {
                ImagesController.rejectOneimage(item, mensaje)
                    .then((x) => count + 1)
                    .catch((e) => console.log(true));
            });
            return res.status(200).json({
                ok: true,
            });
        });
    }
    static rejectOneimage(item, mensaje) {
        return new Promise((resolve, reject) => {
            images_1.default.updateOne({ _id: item._id }, {
                $set: {
                    status: "DENNIED",
                    description: mensaje,
                },
            }).exec((err, data) => {
                if (err) {
                    reject(false);
                }
                if (!data) {
                    reject(false);
                }
                if (data) {
                    resolve(true);
                }
            });
        });
    }
    static changeOneimage(item, status) {
        return new Promise((resolve, reject) => {
            images_1.default.updateOne({ _id: item._id }, {
                $set: {
                    status: status,
                },
            }).exec((err, data) => {
                if (err) {
                    reject(false);
                }
                if (!data) {
                    reject(false);
                }
                if (data) {
                    resolve(true);
                }
            });
        });
    }
    static saveOneImage(item) {
        return new Promise((resolve, reject) => {
            let pathFile = path_1.default.resolve(__dirname, `../../uploads/${item.tipo}/${item.url}`);
            let destFile = path_1.default.resolve(__dirname, `../../uploads/profile/${item.url}`);
            fs_1.default.copyFileSync(pathFile, destFile);
            let a = new images_1.default({
                user: item.user,
                url: item.url,
                tipo: "profile",
                status: "ACCEPTED",
                height: item.height,
                width: item.width,
            });
            a.save((err, data) => {
                if (err) {
                    reject({
                        ok: false,
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
    static aprovedAllImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = req.body;
            yield data.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                yield ImagesController.changeOneimage(item, "ACCEPTED")
                    .then((x) => x)
                    .catch((e) => console.log(e));
                yield ImagesController.saveOneImage(item)
                    .then((x) => x)
                    .catch((e) => console.log(e));
            }));
            return res.status(200).json({
                ok: true,
            });
        });
    }
    static downloadAllImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { data, id } = req.body;
            let zip = new adm_zip_1.default();
            let identifer = `${new Date().getMilliseconds()}${id}`;
            yield data.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                let pathFile = path_1.default.resolve(__dirname, `../../uploads/${item.tipo}/${item.url}`);
                let buffer = fs_1.default.readFileSync(pathFile);
                yield ImagesController.changeOneimage(item, "ACCEPTED")
                    .then((x) => x)
                    .catch((e) => console.log(e));
                yield zip.addLocalFile(pathFile);
                let pathFile2 = path_1.default.resolve(__dirname, `../../uploads/zip/${identifer}.zip`);
                let zipFileContents = zip.writeZip(pathFile2);
            }));
            ImagesController.deleteFile(identifer);
            return res.status(200).json({
                ok: true,
                id: identifer,
            });
        });
    }
    static deleteFile(id) {
        setTimeout(() => {
            uploadController_1.default.borraArchivo(`${id}.zip`, "zip");
        }, 20000);
    }
}
exports.default = ImagesController;
