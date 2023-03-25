"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const server_1 = __importDefault(require("./server/server"));
const body_parser_1 = __importDefault(require("body-parser"));
const router_1 = __importDefault(require("./routes/router"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const enviroment_1 = require("./global/enviroment");
const webrouter_1 = __importDefault(require("./routes/webrouter"));
const cronController_1 = __importDefault(require("./controllers/cronController"));
const server = server_1.default.Instance;
mongoose_1.default.Promise = global.Promise;
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json({ limit: '100mb' }));
server.app.use((0, express_fileupload_1.default)());
server.app.use((0, cors_1.default)({ origin: true, credentials: true }));
server.app.use("/api", router_1.default);
server.app.use("/web", webrouter_1.default);
mongoose_1.default
    .connect(enviroment_1.DBURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
    console.log('DataBase Running');
    server.start(() => {
        console.log("Server Running : " + enviroment_1.SERVER_PORT);
        cronController_1.default.activeprofiles();
        cronController_1.default.setoffonlinefichas();
    });
}).catch(err => console.log(err));
