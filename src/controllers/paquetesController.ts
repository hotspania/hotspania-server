import { Request, Response } from "express";
import paqueteModel from "../models/package";

export default class PaquetesController {
  
  static createpaquete(req: Request, res: Response) {
    let { clase, titulo, price, days } = req.body;

    let a = new paqueteModel({
      clase,
      titulo,
      price,
      days
    });

    a.save((err: any, data: any) => {
      if (err) {
        return res.status(501).json({
          ok: false,
          err,
        });
      }
      if (data) {
        return res.status(200).json({
          ok: true,
        });
      }
    });
  }

  static editpaquete(req: Request, res: Response) {
    let { _id, clase, titulo, price, days, status } = req.body;

    paqueteModel
      .updateOne(
        { _id: _id },
        {
          $set: {
            clase,
            titulo,
            price,
            days,
            status,
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
          return res.status(401).json({
            ok: false,
            message: "Error no se encuentra ningun record",
          });
        }
        if (data) {
          return res.status(200).json({
            ok: true,
            data,
          });
        }
      });
  }

  static getPaquetes(req: Request, res: Response) {
    let { status } = req.query;
    let query: any = [];

    status ? (query = { status: status }) : (query = {});

    paqueteModel.find(query).exec((err: any, data: any) => {
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
