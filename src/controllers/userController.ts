import { Request, Response } from "express";
import UserModel from "../models/users";
import SpecsModel from "../models/photospecs";
import ImagesModel from "../models/images";
import modelProfile from '../models/profile';
import CronController from "./cronController";
import bcrypt from "bcrypt";
import UploadController from "./uploadController";

export default class UserController {
  //DATOS DE FICHAS
  static createRealData(req: Request, res: Response) {
    let { nombre, dni, telefono, fecha_nacimiento, email } = req.body;
    let $dni= dni.replace(/ /g, "").trim();
    let password = bcrypt.hashSync($dni, 10);
    //let $telefono = telefono.replace(/ /g, "").trim();
    let $email= email.replace(/ /g, "").trim();

    let a = new UserModel({
      realData: {
        nombre,
        dni:$dni,
        //telefono: $telefono,
        fecha_nacimiento: null,
      },
      email:$email,
      pass: password,
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
        let x = await CronController.crearProfile(_id)
          .then((x) => x)
          .catch((e) => e);
        let y = await CronController.crearFinanzas(_id)
          .then((x) => x)
          .catch((e) => e);

        return res.status(200).json({
          ok: true,
          id: _id,
        });
      }
    });
  }
  static putFakeData(req: Request, res: Response) {
    let {
      id,
      username,
      edad,
      fumadora,
      //atencion,
      //tags,
      idioma,
      zonas,
      telefono,
      whatsapp,
      llamadas,
      busto,
      cintura,
      genero,
      estatura,
      peso,
      cadera,
      servicios,
      //clase,
      inicio,
      fin,
      horario_inicio,
      horario_fin,
      city,
      zone,
    } = req.body;

    UserModel.updateOne(
      { _id: id },
      {
        $set: {
          fakeData: {
            username,
            edad,
            fumadora,
            //atencion,
            //tags,
            idioma,
            zonas,
            telefono,
            whatsapp,
            llamadas,
            busto,
            cintura,
            genero,
            estatura,
            peso,
            cadera,
            servicios,
            //clase,
            inicio,
            fin,
            horario_inicio,
            horario_fin,
            city,
            zone,
          },
        },
      },
      { new: true }
    ).exec((err: any, data: any) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!data) {
        return res.status(401).json({
          ok: false,
          message: "Error no se encuentra el usuario",
        });
      }
      if (data) {
        return res.status(201).json({
          ok: true,
          id,
          message: "Exito usuario modificado",
        });
      }
    });
  }
  static editRealData(req: Request, res: Response) {
    let { id, nombre, dni, telefono, fecha_nacimiento, email } = req.body;
    UserModel.updateOne(
      { _id: id },
      {
        $set: {
          realData: {
            nombre,
            dni,
            //telefono: telefono.replace(/ /g, "").trim(),
            fecha_nacimiento,
          },
          email,
        },
      },
      { new: true }
    ).exec((err: any, data: any) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!data) {
        return res.status(401).json({
          ok: false,
          message: "Error no se encuentra el usuario",
        });
      }
      if (data) {
        return res.status(201).json({
          ok: true,
          id,
          message: "Exito usuario modificado",
        });
      }
    });
  }
  static async getFichas(req: Request, res: Response) {
    let { name, dni, email, whatsapp, cel, status } = req.query;
    let query: Array<any> = [];

    !!name
      ? query.push({ "realData.nombre": { $regex: `${name}`, $options: "i" } })
      : "";
    !!name
      ? query.push({
          "fakeData.username": { $regex: `${name}`, $options: "i" },
        })
      : "";
    !!dni
      ? query.push({ "realData.dni": { $regex: `${dni}`, $options: "i" } })
      : "";
    !!email ? query.push({ email: { $regex: `${email}`, $options: "i" } }) : "";
    !!whatsapp
      ? query.push({
          "fakeData.whatsapp": { $regex: `${whatsapp}`, $options: "i" },
        })
      : "";
    !!cel
      ? query.push({ "realData.telefono": { $regex: `${cel}`, $options: "i" } })
      : "";
    !!status ? query.push({ auth: status }) : "0";

    if (query.length > 0) {
      UserModel.find({ $or: query }).exec((err: any, data: any) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }
        if (!data) {
          return res.status(201).json({
            ok: false,
            message: "Error no se encuentra ningun usuario",
          });
        }
        if (data) {
          return res.status(201).json({
            ok: true,
            data,
          });
        }
      });
    } else {
      UserModel.find({}).exec((err: any, data: any) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }
        if (!data) {
          return res.status(201).json({
            ok: false,
            message: "Error no se encuentra ningun usuario",
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
  static getFicha(req: Request, res: Response) {
    let id = req.params.id;

    UserModel.find({ _id: id }, { fakeData: true }).exec(
      (err: any, data: any) => {
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
      }
    );
  }
  static getAllFicha(req: Request, res: Response) {
    let id = req.params.id;

    UserModel.find({ _id: id }).exec((err: any, data: any) => {
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
  static changePassword(req: Request, res: Response) {
    let { _id, pass } = req.body;
    let password = bcrypt.hashSync(pass, 10);
    UserModel.updateOne(
      { _id: _id },
      {
        $set: {
          pass: password,
        },
      }
    ).exec((err: any, data: any) => {
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
  //SPECS DE IMAGENES
  static setSpecs(req: Request, res: Response) {
    let { id, specs } = req.body;

    let a = new SpecsModel({
      user: id,
      retoques: specs,
    });

    a.save((err: any, data: any) => {
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
          _id,
        });
      }
    });
  }
  static getSpecs(req: Request, res: Response) {
    let id = req.params.id;
    SpecsModel.findOne({ user: id }).exec((err: any, data: any) => {
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

  //GET IMAGENES


  static getImagesUser(req: Request, res: Response) {
    let id = req.params.id;
    let status = req.params.status;
    let tipo = req.params.tipo;

    ImagesModel.find({ user: id, status: status, tipo: tipo }).exec(
      (err: any, data: any) => {
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
      }
    );
  }
  static getPendingImagesUser(req: Request, res: Response) {
    let id = req.params.id;
    ImagesModel.find({ user: id, status: "PENDING", tipo: "original" }).exec(
      (err: any, data: any) => {
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
      }
    );
  }
  static getDniUser(req: Request, res: Response) {
    let id = req.params.id;
    ImagesModel.find({ user: id, tipo: "dni" }).exec((err: any, data: any) => {
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



  //ACTIVAR PROFILE

  static activarProfile(req: Request, res: Response) {

    let { id }= req.body;

    modelProfile.updateOne(
      { user:id },
      {
        $set: {
          comienzo: "",
          active: true,
          visible: true,
        },
      }
    ).exec((err: any, data: any) => {
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

  static check(req: Request, res: Response) {
    let email = req.params.id;
    UserModel.findOne({ email: email }).exec((err: any, email: any) => {
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

  static checkUsername(req: Request, res: Response) {
    let username = req.params.id;
    UserModel.findOne({ "fakeData.username": username }).exec((err: any, username: any) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error",
          err,
        });
      }
      if (!username) {
        return res.status(200).json({
          username: true,
        });
      }
      return res.status(200).json({
        username: false,
      });
    });
  }

  static deleteficha(req: Request, res: Response){
    let { _id }=req.body;
    
  


  }

  static deleteProfile(user:any){
    return new Promise((resolve, reject) => {
      modelProfile
        .deleteOne({ user: user })
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
  static deleteUser(user:any){
    return new Promise((resolve, reject) => {
      UserModel
        .deleteOne({ user: user })
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
  static deleteFotos(imagenes:any,tipo:any){
    return new Promise((resolve, reject) => {
      imagenes.forEach(async (x:any) => {
       await UploadController.borraArchivo(x,tipo);        
      });
      resolve(true);
    });
  }


}
