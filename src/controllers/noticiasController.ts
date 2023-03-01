import { Request, Response } from "express";
import modelnoticias from "../models/noticias";

export default class NoticiasController {
  static create(req: Request, res: Response) {
    let { titulo, mensaje, admin } = req.body;

    let a = new modelnoticias({
      titulo,
      mensaje,
      admin,
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
  static getActive(req: Request, res: Response) {    
    modelnoticias.find({status:true}).exec((err: any, data: any) => {
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
  static getAll(req: Request, res: Response) {    
    modelnoticias.find({}).exec((err: any, data: any) => {
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
  static editnoticias(req: Request, res: Response) {
    let { _id, status } = req.body;

    modelnoticias
      .updateOne(
        { _id: _id },
        {
          $set: {
            status: status,
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

  static deleteOne(req: Request, res: Response) {
    let {id} = req.body;

    modelnoticias
      .deleteOne(
        { _id: id }
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
