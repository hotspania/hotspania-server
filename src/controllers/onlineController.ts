import { Request, Response } from "express";
import modelProfile from "../models/profile";
import modeluser from "../models/users";
import modelonline from "../models/onlineRecords";
import dayjs from "dayjs";

export default class OnlineController {

  static async setOnline(req: Request, res: Response) {
    let { id, online, time } = req.body;
    let datefin = dayjs().add(time, "hour").format();
    let existe: any = await OnlineController.searchOnline(id)
      .then((x) => x)
      .catch((e) => e);

    let y = await OnlineController.deleteOnlineRecord(existe._id);

    let x = await OnlineController.saveOnlineRecord(id, datefin)
      .then((x) => x)
      .catch((e) => e);

    modelProfile
      .updateOne(
        { user: id },
        {
          $set: {
            online,
          },
        }
      )
      .exec((err: any, data: any) => {
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
  }
  static setOfflineProfile(id: any, hour: any) {
    let time = hour * 3600 * 1000;

    setTimeout(async () => {
      let existe: any = await OnlineController.searchOnline(id)
        .then((x) => x)
        .catch((e) => e);
      if (existe) {
        OnlineController.deleteOnlineRecord(existe._id);
        modelProfile
          .updateOne(
            { user: id },
            {
              $set: {
                online: false,
              },
            }
          )
          .exec((err: any, data: any) => {
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
    }, time);
  }
  static searchOnline(id: any) {
    return new Promise((reject, resolve) => {
      modelonline.findOne({ user: id }).exec((err: any, data: any) => {
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

  static getTimeOnline(req: Request, res: Response) {
    let id = req.params.id;
    modelonline.findOne({ user: id }).exec((err: any, data: any) => {
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

  static saveOnlineRecord(id: any, time: any) {
    return new Promise((reject, resolve) => {
      let a = new modelonline({
        user: id,
        online: true,
        time,
      });
      a.save((err: any, data: any) => {
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
  static deleteOnlineRecord(id: any) {
    modelonline.deleteOne({ _id: id }).exec((err: any, data: any) => {
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

  static deleteOnline(req: Request, res: Response) {
    let id = req.params.id;

    modelonline.deleteOne({ user: id }).exec((err: any, data: any) => {
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
