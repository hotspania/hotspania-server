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
const notification_1 = __importDefault(require("../models/notification"));
class NotificationController {
    static save(req, res) {
        let { titulo, descripcion, tipo } = req.body;
        let a = new notification_1.default({
            titulo,
            descripcion,
            tipo,
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
                return res.status(200).json({
                    ok: true,
                    id: _id,
                });
            }
        }));
    }
    static getAll(req, res) {
        notification_1.default.find({}).exec((err, data) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if (!data) {
                return res.status(201).json({
                    ok: false,
                    message: "Error no se encuentra ninguna notificacion",
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
    static delete(req, res) {
        let id = req.params.id;
        notification_1.default.deleteOne({ '_id': id }).exec((err, data) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!data) {
                return res.status(201).json({
                    ok: false,
                    message: 'Error no se encuentra ningun record'
                });
            }
            if (data) {
                return res.status(201).json({
                    ok: true,
                    data
                });
            }
        });
    }
    static deleteAll(req, res) {
        notification_1.default.deleteMany({}).exec((err, data) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!data) {
                return res.status(201).json({
                    ok: false,
                    message: 'Error no se encuentra ningun record'
                });
            }
            if (data) {
                return res.status(201).json({
                    ok: true,
                    message: 'Todas las notificaciones borradas'
                });
            }
        });
    }
}
exports.default = NotificationController;
