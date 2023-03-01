import { Request, Response } from "express";
import modelpeticiones from "../models/peticiones";

export default class PeticionesController {
  static create(req: Request, res: Response) {
    let { user, mensaje } = req.body;

    let a = new modelpeticiones({
      user,
      mensaje,
    });

    a.save((err: any, data: any) => {
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
  static getAll(req: Request, res: Response) {
    let query = req.params.id;

    modelpeticiones.find({ status: query }).populate('user').exec((err: any, data: any) => {
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
  static getOne(req: Request, res: Response) {
    let id = req.params.id;
    modelpeticiones.find({ user: id }).exec((err: any, data: any) => {
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
  static editPeticion(req: Request, res: Response) {
    let { _id, status, respuesta, admin } = req.body;

    modelpeticiones
      .updateOne(
        { _id: _id },
        {
          $set: {
            status,
            respuesta,
            admin,
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
}
