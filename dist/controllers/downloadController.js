"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
class DownloadController {
    static getFile(req, res) {
        let tipo = req.params.tipo;
        let img = req.params.id;
        let pathFile = path_1.default.resolve(__dirname, `../../uploads/${tipo}/${img}`);
        if (fs_1.default.existsSync(pathFile)) {
            res.sendFile(pathFile);
        }
        else {
            let noimage = path_1.default.resolve(__dirname, '../../assets/noimage.jpg');
            res.sendFile(noimage);
        }
    }
    static getPhotoFile(req, res) {
        let tipo = req.params.tipo;
        let img = req.params.id;
        let width = parseInt(req.params.width);
        let height = parseInt(req.params.height);
        let pathFile = path_1.default.resolve(__dirname, `../../uploads/${tipo}/${img}`);
        if (fs_1.default.existsSync(pathFile)) {
            (0, sharp_1.default)(pathFile).resize(width, height).jpeg({ mozjpeg: true }).toBuffer().then(data => res.end(data)).catch(err => {
                console.log("error");
            });
            // res.sendFile(pathFile);
        }
        else {
            let noimage = path_1.default.resolve(__dirname, '../../assets/noimage.jpg');
            res.sendFile(noimage);
        }
    }
    static downFile(req, res) {
        let tipo = req.params.tipo;
        let img = req.params.id;
        var pathFile = path_1.default.resolve(__dirname, `../../uploads/${tipo}/${img}`);
        res.download(pathFile);
    }
}
exports.default = DownloadController;
