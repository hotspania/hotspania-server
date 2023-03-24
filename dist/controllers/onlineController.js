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
const onlineRecords_1 = __importDefault(require("../models/onlineRecords"));
const dayjs_1 = __importDefault(require("dayjs"));
class OnlineController {
    static setOnline(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, online, time } = req.body;
            let datefin = (0, dayjs_1.default)().add(time, "hour").format();
            let existe = yield OnlineController.searchOnline(id)
                .then((x) => x)
                .catch((e) => e);
            let y = yield OnlineController.deleteOnlineRecord(existe._id);
            let x = yield OnlineController.saveOnlineRecord(id, datefin)
                .then((x) => x)
                .catch((e) => e);
            profile_1.default
                .updateOne({ user: id }, {
                $set: {
                    online,
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
                    // OnlineController.setOfflineProfile(id, time);
                    return res.status(201).json({
                        ok: true,
                        data,
                    });
                }
            });
        });
    }
    static setOfflineProfile(id, hour) {
        let time = hour * 3600 * 1000;
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            let existe = yield OnlineController.searchOnline(id)
                .then((x) => x)
                .catch((e) => e);
            if (existe) {
                OnlineController.deleteOnlineRecord(existe._id);
                profile_1.default
                    .updateOne({ user: id }, {
                    $set: {
                        online: false,
                    },
                })
                    .exec((err, data) => {
                    if (err) {
                        console.log("Error");
                    }
                    if (!data) {
                        console.log("No find");
                    }
                    if (data) {
                        console.log("closed");
                    }
                });
            }
        }), time);
    }
    static searchOnline(id) {
        return new Promise((reject, resolve) => {
            onlineRecords_1.default.findOne({ user: id }).exec((err, data) => {
                if (err) {
                    reject(false);
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
    static getTimeOnline(req, res) {
        let id = req.params.id;
        onlineRecords_1.default.findOne({ user: id }).exec((err, data) => {
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
    static saveOnlineRecord(id, time) {
        return new Promise((reject, resolve) => {
            let a = new onlineRecords_1.default({
                user: id,
                online: true,
                time,
            });
            a.save((err, data) => {
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
        });
    }
    static deleteOnlineRecord(id) {
        onlineRecords_1.default.deleteOne({ _id: id }).exec((err, data) => {
            if (err) {
                console.log("Error");
            }
            if (!data) {
                console.log("No se encuentra");
            }
            if (data) {
                console.log("OKI");
            }
        });
    }
    static deleteOnline(req, res) {
        let id = req.params.id;
        onlineRecords_1.default.deleteOne({ user: id }).exec((err, data) => {
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
                    ok: true
                });
            }
        });
    }
}
exports.default = OnlineController;
