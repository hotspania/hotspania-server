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
const finanzas_1 = __importDefault(require("../models/finanzas"));
const users_1 = __importDefault(require("../models/users"));
const onlineRecords_1 = __importDefault(require("../models/onlineRecords"));
const node_cron_1 = __importDefault(require("node-cron"));
const dayjs_1 = __importDefault(require("dayjs"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const onlineController_1 = __importDefault(require("./onlineController"));
class CronController {
    static createProfiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let users = yield CronController.getUsers()
                .then((x) => x)
                .catch((e) => e);
            return res.status(200).json({
                ok: true,
                users
            });
        });
    }
    static getUsers() {
        return new Promise((resolve, reject) => {
            profile_1.default
                .find({
                active: true,
                freeze: false
            })
                .exec((error, data) => {
                if (error) {
                    console.log("ERROR");
                    resolve(false);
                }
                if (!data) {
                    console.log("NO RECORDS FOUND TO DISCOUNT DAYS");
                    resolve(false);
                }
                if (data.length > 0) {
                    data.forEach((x) => {
                        profile_1.default
                            .updateOne({ _id: x._id }, {
                            $inc: { dias: +1 },
                        })
                            .exec((error, resp) => {
                            if (error) {
                                console.log("Error");
                            }
                            if (!resp) {
                                console.log("No records TO DISCOUNT DAYS");
                            }
                            if (resp) {
                                console.log("DISCOUNT DAYS" + data.length + " RECORDS");
                            }
                        });
                    });
                    resolve(data.length);
                }
                else {
                    console.log("NO RECORDS FOUND TO DISCOUNT DAYS");
                    resolve(false);
                }
            });
        });
    }
    static crearProfile(id) {
        return new Promise((resolve, reject) => {
            let a = new profile_1.default({
                user: id,
            });
            a.save((err, data) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    reject(false);
                }
                if (data) {
                    resolve(true);
                }
            }));
        });
    }
    static crearFinanzas(id) {
        return new Promise((resolve, reject) => {
            let a = new finanzas_1.default({
                user: id,
            });
            a.save((err, data) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    reject(false);
                }
                if (data) {
                    resolve(true);
                }
            }));
        });
    }
    static activeprofiles() {
        node_cron_1.default.schedule("0 0 * * *", () => __awaiter(this, void 0, void 0, function* () {
            console.log("EXECUTING THE DAILY  TASK");
            let x = yield CronController.discountDays()
                .then((x) => {
                CronController.setOffProfiles()
                    .then((x) => x)
                    .catch((e) => console.log("ERROR GODOWN"));
            })
                .catch((e) => e);
            let y = yield CronController.updateProfiles().then(x => x).catch(e => e);
        }), {
            scheduled: true,
            timezone: "America/Argentina/Buenos_Aires"
        });
    }
    static updateProfiles() {
        return new Promise((resolve, reject) => {
            let today = (0, dayjs_1.default)().format();
            let desde = (0, dayjs_1.default)("01-01-2000").format();
            profile_1.default
                .find({
                comienzo: {
                    $gte: desde,
                    $lt: today,
                },
            })
                .exec((error, data) => {
                if (error) {
                    console.log("ERROR");
                    resolve(false);
                }
                if (!data) {
                    console.log("NO RECORDS FOUND TO ACTIVATED");
                    resolve(false);
                }
                if (data.length > 0) {
                    data.forEach((x) => {
                        profile_1.default
                            .updateOne({ _id: x._id }, {
                            $set: {
                                comienzo: "",
                                active: true,
                                visible: true,
                            },
                        })
                            .exec((error, resp) => {
                            if (error) {
                                console.log("Error");
                            }
                            if (!resp) {
                                console.log("No records Updated");
                            }
                            if (resp) {
                                console.log("Updated");
                            }
                        });
                    });
                    resolve(true);
                }
                else {
                    console.log("NO RECORDS FOUND TO ACTIVATED");
                    resolve(false);
                }
            });
        });
    }
    static discountDays() {
        return new Promise((resolve, reject) => {
            profile_1.default
                .find({
                dias: {
                    $gte: 1,
                },
                active: true,
                freeze: false
            })
                .exec((error, data) => {
                if (error) {
                    console.log("ERROR");
                    resolve(false);
                }
                if (!data) {
                    console.log("NO RECORDS FOUND TO DISCOUNT DAYS");
                    resolve(false);
                }
                if (data.length > 0) {
                    data.forEach((x) => {
                        profile_1.default
                            .updateOne({ _id: x._id }, {
                            $inc: { dias: -1 },
                        })
                            .exec((error, resp) => {
                            if (error) {
                                console.log("Error");
                            }
                            if (!resp) {
                                console.log("No records TO DISCOUNT DAYS");
                            }
                            if (resp) {
                                console.log("DISCOUNT DAYS" + data.length + " RECORDS");
                            }
                        });
                    });
                    resolve(true);
                }
                else {
                    console.log("NO RECORDS FOUND TO DISCOUNT DAYS");
                    resolve(false);
                }
            });
        });
    }
    static setOffProfiles() {
        return new Promise((resolve, reject) => {
            profile_1.default
                .find({
                dias: 0,
                active: true
            })
                .exec((error, data) => {
                if (error) {
                    console.log("ERROR");
                    resolve(false);
                }
                if (!data) {
                    console.log("NO RECORDS FOUND TO GO DOWN");
                    resolve(false);
                }
                if (data.length > 0) {
                    data.forEach((x) => {
                        profile_1.default
                            .updateOne({ _id: x._id }, {
                            $set: {
                                active: false,
                                freeze: false,
                                visible: false,
                                online: false,
                            },
                        })
                            .exec((error, resp) => {
                            if (error) {
                                console.log("Error");
                            }
                            if (!resp) {
                                console.log("No records GO DOWN");
                            }
                            if (resp) {
                                console.log("GO DOWN " + data.length + " RECORDS");
                            }
                        });
                    });
                    resolve(true);
                }
                else {
                    console.log("NO RECORDS FOUND TO GO DOWN");
                    resolve(false);
                }
            });
        });
    }
    static createPassword(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let password = bcrypt_1.default.hashSync(user.realData.dni, 10);
                users_1.default
                    .updateOne({ _id: user._id }, {
                    $set: {
                        pass: password,
                    },
                })
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
        });
    }
    static setoffonlinefichas() {
        node_cron_1.default.schedule("* * * * *", () => __awaiter(this, void 0, void 0, function* () {
            console.log("EXECUTING THE ONLINE  TASK");
            yield CronController.onlineoff()
                .then((x) => x)
                .catch((e) => console.log("ERROR ONLINE TASK"));
        }));
    }
    static onlineoff() {
        return new Promise((resolve, reject) => {
            let today = (0, dayjs_1.default)().format();
            let desde = (0, dayjs_1.default)("01-01-2000").format();
            onlineRecords_1.default
                .find({
                time: {
                    $gte: desde,
                    $lt: today,
                },
            })
                .exec((error, data) => {
                if (error) {
                    console.log("ERROR");
                    resolve(false);
                }
                if (!data) {
                    console.log("NO RECORDS FOUND TO GO SET OFFLINE");
                    resolve(false);
                }
                if (data.length > 0) {
                    data.forEach((x) => {
                        profile_1.default
                            .updateOne({ user: x.user }, {
                            $set: {
                                online: false,
                            },
                        })
                            .exec((error, resp) => __awaiter(this, void 0, void 0, function* () {
                            if (error) {
                                console.log("Error");
                            }
                            if (!resp) {
                                console.log("No records GO SET OFFLINE");
                            }
                            if (resp) {
                                yield onlineController_1.default.deleteOnlineRecord(x._id);
                                console.log("GO OFFLINE " + data.length + " RECORDS");
                            }
                        }));
                    });
                    resolve(true);
                }
                else {
                    console.log("NO RECORDS FOUND TO GO DOWN");
                    resolve(false);
                }
            });
        });
    }
}
exports.default = CronController;
