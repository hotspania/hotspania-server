import { Request, Response } from "express";
import NotificationModel from "../models/notification";

export default class NotificationController {

  static save(req: Request, res: Response) {
    let { titulo, descripcion, tipo } = req.body;
    let a = new NotificationModel({
        titulo,
        descripcion,
        tipo,
    });

    a.save(async (err: any, data: any) => {
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
    });
  }

  static getAll(req: Request, res: Response) {
    NotificationModel.find({}).exec((err: any, data: any) => {
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

  static delete(req: Request, res: Response) {

    let id = req.params.id;
    NotificationModel.deleteOne({ '_id': id }).exec((err: any, data: any) => {
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

  static deleteAll(req: Request, res: Response) {

    NotificationModel.deleteMany({  }).exec((err: any, data: any) => {
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
