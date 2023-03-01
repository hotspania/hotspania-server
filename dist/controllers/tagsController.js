"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tags_1 = __importDefault(require("../models/tags"));
const tagsColletion_1 = __importDefault(require("../models/tagsColletion"));
class TagsController {
    static create(req, res) {
        let { user, titulo } = req.body;
        let a = new tags_1.default({
            user,
            titulo,
        });
        a.save((err, data) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    message: "Error ",
                });
            }
            if (!data) {
                return res.status(401).json({
                    ok: false,
                    message: "Error ",
                });
            }
            return res.status(200).json({
                ok: true,
                data,
            });
        });
    }
    static getOne(req, res) {
        let id = req.params.id;
        tags_1.default.find({ user: id }).exec((err, data) => {
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
    static deleteOne(req, res) {
        let { id } = req.body;
        tags_1.default.deleteOne({ _id: id }).exec((err, data) => {
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
    static Savetagcolletion(req, res) {
        let { titulo } = req.body;
        let a = new tagsColletion_1.default({
            titulo,
        });
        a.save((err, data) => {
            if (err) {
                return res.status(501).json({
                    ok: false,
                    err,
                });
            }
            if (data) {
                return res.status(200).json({
                    ok: true,
                });
            }
        });
    }
    static gettagcolletion(req, res) {
        tagsColletion_1.default.find({}).exec((err, data) => {
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
    static editagcolletion(req, res) {
        let { _id, titulo } = req.body;
        tagsColletion_1.default
            .updateOne({ _id: _id }, {
            $set: {
                titulo: titulo,
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
    static deletetagcolletion(req, res) {
        let id = req.params.id;
        tagsColletion_1.default.deleteOne({ _id: id }).exec((err, data) => {
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
exports.default = TagsController;
