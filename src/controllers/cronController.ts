import { Request, Response } from "express";
import modelProfile from "../models/profile";
import modelFinanzas from "../models/finanzas";
import modelUser from "../models/users";
import modelonline from "../models/onlineRecords";
import cron from "node-cron";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import OnlineController from "./onlineController";

export default class CronController {
  static async createProfiles(req: Request, res: Response) {
    let users: any = await CronController.getUsers()
      .then((x) => x)
      .catch((e) => e);
    return res.status(200).json({
      ok: true,
      users
    });
  }

  static getUsers() {
    return new Promise((resolve, reject) => {
      modelProfile
        .find({
          active:true,
          freeze:false
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
              modelProfile
                .updateOne(
                  { _id: x._id },
                  {
                    $inc: { dias: +1 },
                  }
                )
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
          } else {
            console.log("NO RECORDS FOUND TO DISCOUNT DAYS");
            resolve(false);
          }
        });
    });
  }
  static crearProfile(id: any) {
    return new Promise((resolve, reject) => {
      let a = new modelProfile({
        user: id,
      });
      a.save(async (err: any, data: any) => {
        if (err) {
          reject(false);
        }
        if (data) {
          resolve(true);
        }
      });
    });
  }
  static crearFinanzas(id: any) {
    return new Promise((resolve, reject) => {
      let a = new modelFinanzas({
        user: id,
      });
      a.save(async (err: any, data: any) => {
        if (err) {
          reject(false);
        }
        if (data) {
          resolve(true);
        }
      });
    });
  }
  static activeprofiles() {
    cron.schedule("0 0 * * *", async () => {
      console.log("EXECUTING THE DAILY  TASK");
      let x = await CronController.discountDays()
        .then((x) => {
          CronController.setOffProfiles()
            .then((x) => x)
            .catch((e) => console.log("ERROR GODOWN"));
        })
        .catch((e) => e);
      let y =await CronController.updateProfiles().then(x=>x).catch(e=>e);
    },{
      scheduled: true,
      timezone: "America/Argentina/Buenos_Aires"
    });
  }
  static updateProfiles() {
    return new Promise((resolve, reject) => {
      let today = dayjs().format();
      let desde = dayjs("01-01-2000").format();
      modelProfile
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
              modelProfile
                .updateOne(
                  { _id: x._id },
                  {
                    $set: {
                      comienzo: "",
                      active: true,
                      visible: true,
                    },
                  }
                )
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
          } else {
            console.log("NO RECORDS FOUND TO ACTIVATED");
            resolve(false);
          }
        });
    });
  }
  static discountDays() {
    return new Promise((resolve, reject) => {
      modelProfile
        .find({
          dias: {
            $gte: 1,
          },
          active:true,
          freeze:false
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
              modelProfile
                .updateOne(
                  { _id: x._id },
                  {
                    $inc: { dias: -1 },
                  }
                )
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
          } else {
            console.log("NO RECORDS FOUND TO DISCOUNT DAYS");
            resolve(false);
          }
        });
    });
  }
  static setOffProfiles() {
    return new Promise((resolve, reject) => {
      modelProfile
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
              modelProfile
                .updateOne(
                  { _id: x._id },
                  {
                    $set: {
                      active: false,
                      freeze: false,
                      visible: false,
                      online: false,
                    },
                  }
                )
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
          } else {
            console.log("NO RECORDS FOUND TO GO DOWN");
            resolve(false);
          }
        });
    });
  }
  static async createPassword(user: any) {
    return new Promise((resolve, reject) => {
      let password = bcrypt.hashSync(user.realData.dni, 10);
      modelUser
        .updateOne(
          { _id: user._id },
          {
            $set: {
              pass: password,
            },
          }
        )
        .exec((err: any, data: any) => {
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
  }

  static setoffonlinefichas() {
    cron.schedule("* * * * *", async () => {
      console.log("EXECUTING THE ONLINE  TASK");
     await CronController.onlineoff()
      .then((x) => x)
      .catch((e) => console.log("ERROR ONLINE TASK"));
    });
  }

  static onlineoff(){
    return new Promise((resolve, reject) => {
      let today = dayjs().format();
      let desde = dayjs("01-01-2000").format();
      
      modelonline
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
            data.forEach((x:any) => {
              modelProfile
                .updateOne(
                  { user: x.user },
                  {
                    $set: {                     
                      online: false,
                    },
                  }
                )
                .exec(async (error, resp) => {
                  if (error) {
                    console.log("Error");
                  }
                  if (!resp) {
                    console.log("No records GO SET OFFLINE");
                  }
                  if (resp) {
                   await OnlineController.deleteOnlineRecord(x._id);
                    console.log("GO OFFLINE " + data.length + " RECORDS");
                  }
                });
            });
            resolve(true);
          } else {
            console.log("NO RECORDS FOUND TO GO DOWN");
            resolve(false);
          }
        });
    });

  }


}
