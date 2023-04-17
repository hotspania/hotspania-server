import { Request, Response } from "express";
import dayjs from "dayjs";
import modelProfile from "../models/profile";
import modelFinanzas from "../models/finanzas";
import CronController from "./cronController";
import UserModel from "../models/users";

export default class AnunciosController {
  static async addTimeProfile(req: Request, res: Response) {
    let { id, paquete, fecha_inicio } = req.body;

    let data = await AnunciosController.getRecordProfile(id).then(
      (resp: any) => resp
    );
    let inicio = dayjs(fecha_inicio).format();

    let $fecha_inicio = dayjs(fecha_inicio);
    let x = (parseInt(paquete.days)+1);
    let fecha_fin = $fecha_inicio.add(x, "day").format();

    modelProfile
      .updateOne(
        { user: id },
        {
          $set: {
            fin: fecha_fin,
            comienzo: inicio,
          },
          $inc: { dias: x },
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
  static checkexist(id: any) {
    return new Promise((resolve, reject) => {
      modelFinanzas.find({ user: id }).exec((error: any, data: any) => {
        if (error) {
          reject(error);
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
  static getProfile(req: Request, res: Response) {
    let id = req.params.id;

    modelProfile.findOne({ user: id }).exec((err: any, data: any) => {
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
  static updateImagesDisponibles(req: Request, res: Response) {
    let { id, imagenes } = req.body;
    modelProfile
      .updateOne(
        { user: id },
        {
          $set: {
            imagenes: imagenes,
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
  static getRecordProfile(id: any) {
    return new Promise((resolve, reject) => {
      modelProfile.findOne({ user: id }).exec((error: any, data: any) => {
        if (error) {
          reject(error);
        }
        if (!data) {
          resolve(data);
        }
        if (data) {
          resolve(data);
        }
      });
    });
  }
  static setListados(req: Request, res: Response) {
    let { imagen, id, listados } = req.body;

    modelProfile
      .updateOne(
        { user: id },
        {
          imagen: imagen,
          listados: listados,
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
  static getProfiles(req: Request, res: Response) {
    modelProfile
      .find({}, { imagenes: false, listados: false })
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
          return res.status(201).json({
            ok: true,
            data,
          });
        }
      });
  }
  static addmultipaquetes(req: Request, res: Response) {
    let { paquete, usuarios } = req.body;
    usuarios.forEach(async (element: any) => {
      let x = await AnunciosController.addtime(element, paquete)
        .then((x) => x)
        .catch((error) => error);
    });

    return res.status(200).json({
      ok: true,
      message: "all ok",
    });
  }
  static addtime(user: any, paquete: any) {
    return new Promise(async (resolve, reject) => {
      let fecha_fin_actual = dayjs(user.fin);
      // let $fecha_inicio = dayjs(fecha_inicio);
      let x = (parseInt(paquete.days)+1);
      let fecha_fin = fecha_fin_actual.add(x, "day").format();

      modelProfile
        .updateOne(
          { user: user.user._id },
          {
            $set: {
              fin: fecha_fin,
            },
            $inc: { dias: x },
          }
        )
        .exec((err: any, data: any) => {
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
  static setStates(req: Request, res: Response) {
    let { id,active,freeze,visible,online } = req.body;

    modelProfile
      .updateOne(
        { _id: id },
        {
          $set: {
            active,
            freeze,
            visible,
            online,
          }
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
  static ajustDays(req: Request, res: Response) {
    let { id,days } = req.body;
    let dias= parseInt(days);
    let fecha= dayjs();
    let fecha_fin = fecha.add(dias, "day").format();

    modelProfile
      .updateOne(
        { _id: id },
        {
          $set: {
            dias:dias, 
            fin:fecha_fin
          }
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
}
