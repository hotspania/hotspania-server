import { Request, Response } from "express";
import letra from "../models/letra";
import dayjs from "dayjs";

export default class LetraController {
  static crear(req: Request, res: Response) {
    let { position } = req.body;

    let $pos = parseInt(position);

    let a = new letra({
      number: $pos,
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

  static getAll(req: Request, res: Response) {
    letra
      .find({})
      .populate("user")
      .populate("profile")
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

  static asignar(req: Request, res: Response) {
    let { user, profile, dias, id, fecha_inicio,active,taked } = req.body;
    let $fecha_inicio = dayjs(fecha_inicio);
    let x = parseInt(dias);
    let fecha_fin = $fecha_inicio.add(x, "day").format();

    letra
      .updateOne(
        { _id: id },
        {
          $set: {
            user: user,
            profile: profile,
            active: active,
            taked: taked,
            fin: fecha_fin,
            comienzo: $fecha_inicio,
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
  

  static GetActive() {
    return new Promise((resolve, reject) => {
      letra
        .find({ active: true }, { user: false })
        .exec((err: any, data: any) => {
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


  //   static aisgnar(user:any,profile:any,dias:any,){
  //     return new Promise((resolve,reject)=>{
  //         letra.find({active:true},{user:false}).exec((err: any, data: any) => {
  //             if (err) {
  //                 reject(false);
  //             }
  //             if (!data) {
  //                 resolve(false);
  //             }
  //             if (data) {
  //                resolve(data)
  //             }
  //           });
  //     })
  //   }
}
