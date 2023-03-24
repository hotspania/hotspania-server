import { Request, Response } from "express";
import modelAdmin from "../models/admin";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SEED, CADUCIDAD_TOKEN } from "../global/enviroment";
import { generarJWT } from "../helpers/Jwt";

export default class AdminController {
  static login(req: Request, res: Response) {
    let body = req.body;
    modelAdmin
      .findOne({ email: body.email })
      .exec(async (err: any, usuarioDB: any) => {
        console.log('user', usuarioDB);
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

        console.log()

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
          return res.status(400).json({
            ok: false,
            message: "Error contraseña incorrectas",
          });
        }
        let payload={  
            id: usuarioDB.id,
            email: usuarioDB.email,
            nombre: usuarioDB.nombre,
          }        

        let token =await generarJWT(payload);

        usuarioDB.password = ":D";
        return res.status(200).json({
          ok: true,
          usuarioDB,
          token,
        });
      });
  }
  static crearUsuario(req: Request, res: Response) {
    const { nombre, email, pass, role } = req.body;
    const password = bcrypt.hashSync(pass, 10);

    const usuario = new modelAdmin({
      nombre,
      role: role,
      email,
      password: password,
    });

    usuario.save((err: any, usuarioDB: any) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          message: "Error ",
        });
      }

      if (!usuarioDB) {
        return res.status(401).json({
          ok: false,
          message: "Error ",
        });
      }
      return res.status(200).json({
        ok: true,
      });
    });
  }
  static check(req: Request, res: Response) {
    let email = req.params.id;
    modelAdmin.findOne({ email: email }).exec((err: any, email: any) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error",
          err,
        });
      }
      if (!email) {
        return res.status(200).json({
          email: true,
        });
      }
      return res.status(200).json({
        email: false,
      });
    });
  }

  static getAdmin(req: Request, res: Response) {
    let id = req.params.id;
    modelAdmin
      .find({ _id: id }, { nombre: true })
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
            data: data[0],
          });
        }
      });
  }

  static getAllAdmin(req: Request, res: Response) {
    modelAdmin.find({}).exec((err: any, data: any) => {
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
  static editAdmin(req: Request, res: Response) {
    let { _id, nombre, role, email,status } = req.body;

    modelAdmin
      .updateOne(
        { _id: _id },
        {
          $set: {
            nombre,
            role: role,
            email,
            status
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

  static changePassword(req: Request, res: Response) {
    let { _id, pass } = req.body;
    let password = bcrypt.hashSync(pass, 10);
    modelAdmin
      .updateOne(
        { _id: _id },
        {
          $set: {
            password: password, 
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





}
