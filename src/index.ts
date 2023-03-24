import cors from "cors";
import Server from "./server/server";
import bodyParser from "body-parser";
import router from "./routes/router";
import mongoose from "mongoose";
import fileUpload  from 'express-fileupload';

import { DBURL, SERVER_PORT } from './global/enviroment';
import webrouter from "./routes/webrouter";
import CronController from "./controllers/cronController";

const server = Server.Instance;
mongoose.Promise= global.Promise;

server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json({limit:'100mb'}));
server.app.use( fileUpload() );

server.app.use(cors({ origin: true, credentials: true }));

server.app.use("/api", router);
server.app.use("/web",  webrouter);

mongoose
  .connect(DBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DataBase Running');
    server.start(() => {
      console.log("Server Running : "+ SERVER_PORT);
      CronController.activeprofiles();
      CronController.setoffonlinefichas();
    });
  }).catch( err=>console.log(err));
