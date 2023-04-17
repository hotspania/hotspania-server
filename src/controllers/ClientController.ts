import { Request, Response } from "express";
import modelProfile from "../models/profile";
import modeluser from "../models/users";
import modelonline from "../models/onlineRecords";
import modelLogs from "../models/loginlogs";
import modelFinanzas from "../models/finanzas";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import { generarJWT } from "../helpers/Jwt";
import LoginController from "./loginController";

export default class ClientControler {
  static getFichas(req: Request, res: Response) {
    let term = req.params.category;
    let status = req.query.status;

    let query = "";

    if (term === "all") {
      query = "Lista General";
    } else if (term === "barcelona") {
      query = "Lista General";
    } else if (term === "vip") {
      query = "V.I.P";
    } else if (term === "premium") {
      query = "Premium";
    } else if (term === "promo") {
      query = "PROMO";
    } else if (term === "disponibles") {
      query = "disponible";
    }

    if (!!status) {
      modelProfile
        .find(
          {
            user: {
              activa: 1,
            },
            //listados: { $in: query },
            visible: true,
            online: true,
            freeze: false,
          },
          { 
            imagenes: false, listados: false
          },
        )
        .populate("user")
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
            let x = data.map((x: any) => {
              return {
                username: x.user.fakeData.username,
                online: x.online,
                imagen: x.imagen,
              };
            });

            const allfichas = (ar: any) => ar.sort(() => Math.random() - 0.5);
            let a = allfichas(x);
            return res.status(201).json({
              ok: true,
              data: a,
            });
          }
        });
    } else {
      modelProfile
        .find(
          {
            user: {
              activa: 1,
            },
            //listados: { $in: query },
            visible: true,
            freeze: false,
          },
          { imagenes: false, listados: false }
        )
        .populate("user")
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
            let x = data.map((x: any) => {
              return {
                username: x.user.fakeData.username,
                online: x.online,
                imagen: x.imagen,
              };
            });
            const allfichas = (ar: any) => ar.sort(() => Math.random() - 0.5);
            let a = allfichas(x);
            return res.status(201).json({
              ok: true,
              data: a,
            });
          }
        });
    }
  }
  static async getFicha(req: Request, res: Response) {
    let query = req.params.user;
    let username = query.replace("-", " ");
    let $username = username.toLowerCase();

    let fakedata: any = await ClientControler.getid($username)
      .then((x) => x)
      .catch((e) => e);
    if (!fakedata) {
      return res.status(401).json({
        ok: false,
        message: "No hay usuario",
      });
    } else {
      let profile = await ClientControler.getprofile(fakedata._id)
        .then((x) => x)
        .catch((e) => e);

      if (!profile) {
        return res.status(401).json({
          ok: false,
          message: "No hay usuario",
        });
      } else {
        return res.status(200).json({
          ok: true,
          data: fakedata,
          colletion: profile,
        });
      }
    }
  }
  static getid(username: any) {
    return new Promise((resolve, reject) => {
      modeluser
        .findOne(
          { "fakeData.username": username },
          { realData: false, email: false }
        )
        .exec((err: any, data: any) => {
          if (err) {
            resolve(false);
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
  static getprofile(id: any) {
    return new Promise((resolve, reject) => {
      modelProfile
        .findOne({ user: id }, { imagenes: true, imagen: true, online: true })
        .exec((err: any, data: any) => {
          if (err) {
            resolve(false);
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
  static Clientlogin(req: Request, res: Response) {
    let body = req.body;

    modeluser
      .findOne({ email: body.email })
      .exec((err: any, usuarioDB: any) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            message: "Error",
            err,
          });
        }
        if (!usuarioDB) {
          return res.status(401).json({
            ok: false,
            message: "No se encuentra el usuario",
          });
        }

        if (!bcrypt.compareSync(body.pass, usuarioDB.pass)) {
          return res.status(400).json({
            ok: false,
            message: "Error contraseña incorrectas",
          });
        } else {
          usuarioDB.password = ":D";
          return res.status(200).json({
            ok: true,
            usuarioDB,
          });
        }
      });
  }
  static ClientApplogin(req: Request, res: Response) {
    let body = req.body;
    modeluser
      .findOne({ _id: body.id }, { pass: false })
      .exec((err: any, usuarioDB: any) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            message: "Error",
            err,
          });
        }
        if (!usuarioDB) {
          return res.status(401).json({
            ok: false,
            message: "No se encuentra el usuario",
          });
        }

        if (usuarioDB) {
          return res.status(200).json({
            ok: true,
            usuarioDB,
          });
        }
      });
  }
  static loginNoFace(req: Request, res: Response) {
    let body = req.body;

    let email = body.email.trim().toLowerCase();

    modeluser
      .findOne({ email: email })
      .exec(async (err: any, usuarioDB: any) => {
        if (err) {
          let x = await LoginController.saveLoginNofaceRecord(
            body.email,
            "ERROR SERVER",
            "0",
            "true"
          );
          return res.status(500).json({
            ok: false,
            message: "Error",
            err,
          });
        }
        if (!usuarioDB) {
          let x = await LoginController.saveLoginNofaceRecord(
            body.email,
            "ERROR CORREO",
            "0",
            "true"
          );
          return res.status(401).json({
            ok: false,
            message: "No se encuentra el usuario",
          });
        }

        if (!bcrypt.compareSync(body.pass, usuarioDB.pass)) {
          let x = await LoginController.saveLoginNofaceRecord(
            body.email,
            "ERROR PASSWORD",
            "0",
            "true"
          );
          return res.status(400).json({
            ok: false,
            message: "Error contraseña incorrectas",
          });
        }
        let payload = {
          id: usuarioDB.id,
          email: usuarioDB.email,
          nombre: usuarioDB.nombre,
        };

        let token = await generarJWT(payload);

        usuarioDB.pass = ":D";
        let x = await LoginController.saveLoginNofaceRecord(
          body.email,
          "EXITOSO",
          "100",
          "false"
        );
        return res.status(200).json({
          ok: true,
          usuarioDB,
          token,
        });
      });
  }
  static setVisible(req: Request, res: Response) {
    let { id, visible } = req.body;

    modelProfile
      .updateOne(
        { user: id },
        {
          $set: {
            visible,
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
          return res.status(201).json({
            ok: true,
            data,
          });
        }
      });
  }
  static getvencimientos(req: Request, res: Response) {
    modelProfile
      .find(
        { active: true, dias: { $lt: 10 } },
        { imagenes: false, listados: false }
      )
      .populate("user")
      .sort({ dias: 1 })
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
          return res.status(201).json({
            ok: true,
            data,
          });
        }
      });
  }

  static StatusToken(req: Request, res: Response) {
    return res.status(200).json({
      ok: true,
    });
  }
}
