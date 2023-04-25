import { Request, Response } from "express";
import ImageModel from "../models/images";
import modelprofile from "../models/profile";
import fs from "fs";
import path from "path";
import UploadController from "./uploadController";
import AdmZip from "adm-zip";

export default class ImagesController {
  static async changeImage(req: Request, res: Response) {
    let { user, url, tipo, _id } = req.body;

    let save = await ImagesController.saveImage(user, url, tipo)
      .then((ok) => ok)
      .catch((error) => error);

    ImageModel.updateOne(
      { _id: _id },
      {
        $set: {
          status: "ACCEPTED",
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
  static async rejectImage(req: Request, res: Response) {
    let { mensaje, id } = req.body;

    ImageModel.updateOne(
      { _id: id },
      {
        $set: {
          status: "DENNIED",
          description: mensaje,
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
  static async changestatusImage(req: Request, res: Response) {
    let { id,status } = req.body;

    ImageModel.updateOne(
      { _id: id },
      {
        $set: {
          status:status
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
  static saveImage(user: string, url: string, tipo: string) {
    return new Promise((resolve, reject) => {
      let pathFile = path.resolve(__dirname, `../../uploads/${tipo}/${url}`);
      let destFile = path.resolve(__dirname, `../../uploads/profile/${url}`);

      fs.copyFileSync(pathFile, destFile);

      let a = new ImageModel({
        user: user,
        url: url,
        tipo: "profile",
        status: "ACCEPTED",
      });

      a.save((err: any, data: any) => {
        if (err) {
          reject({
            ok: false,
          });
        }
        if (data) {
          resolve({
            ok: true,
          });
        }
      });
    });
  }
  static async deleteImagebyuser(req: Request, res: Response) {
    let { _id, key, url,user } = req.body;   
    await ImagesController.deleteOnprofile(user, url).then(x=>x).catch(e=>e);

    ImageModel.updateOne({ _id: _id },{
      $set:{
        status:"DELETED"
      }
    }).exec((err: any, data: any) => {
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
        });
      }
    });
  }
  static async deleteImage(req: Request, res: Response) {
    let { _id, key, url,user } = req.body;

    UploadController.borraArchivo(url, key);
    await ImagesController.deleteOnprofile(user, url).then(x=>x).catch(e=>e);

    ImageModel.deleteOne({ _id: _id }).exec((err: any, data: any) => {
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
        });
      }
    });
  }
  static deleteOnprofile(user: any, url: any) {
    return new Promise((resolve, reject) => {
      modelprofile.findOne({ user: user }).exec((err: any, data: any) => {
        if (err) {
          reject(false);
        }
        if (!data) {
          reject(false);
        }
        if (data) {
          let x = data.imagenes.filter((x: any) => x !== url);
          modelprofile.updateOne({user:user},{$set:{
            imagenes:x
          }}).exec((err: any, data: any) => {
            if (err) {
              reject(false);
            }
            if (!data) {
              reject(false);
            }
            if (data) {
              resolve(true);
            }
          });
        }
      });
    });

  }
  static async rejectImages(req: Request, res: Response) {
    let { mensaje, data } = req.body;
    let count = 0;

    await data.forEach((item: any) => {
      ImagesController.rejectOneimage(item, mensaje)
        .then((x) => count + 1)
        .catch((e) => console.log(true));
    });

    return res.status(200).json({
      ok: true,
    });
  }
  static rejectOneimage(item: any, mensaje: any) {
    return new Promise((resolve, reject) => {
      ImageModel.updateOne(
        { _id: item._id },
        {
          $set: {
            status: "DENNIED",
            description: mensaje,
          },
        }
      ).exec((err: any, data: any) => {
        if (err) {
          reject(false);
        }
        if (!data) {
          reject(false);
        }
        if (data) {
          resolve(true);
        }
      });
    });
  }
  static changeOneimage(item: any, status: string) {
    return new Promise((resolve, reject) => {
      ImageModel.updateOne(
        { _id: item._id },
        {
          $set: {
            status: status,
          },
        }
      ).exec((err: any, data: any) => {
        if (err) {
          reject(false);
        }
        if (!data) {
          reject(false);
        }
        if (data) {
          resolve(true);
        }
      });
    });
  }
  static saveOneImage(item: any) {
    return new Promise((resolve, reject) => {
      let pathFile = path.resolve(
        __dirname,
        `../../uploads/${item.tipo}/${item.url}`
      );
      let destFile = path.resolve(
        __dirname,
        `../../uploads/profile/${item.url}`
      );

      fs.copyFileSync(pathFile, destFile);

      let a = new ImageModel({
        user: item.user,
        url: item.url,
        tipo: "profile",
        status: "ACCEPTED",
        height: item.height,
        width: item.width,
      });

      a.save((err: any, data: any) => {
        if (err) {
          reject({
            ok: false,
          });
        }
        if (data) {
          resolve({
            ok: true,
          });
        }
      });
    });
  }
  static async aprovedAllImages(req: Request, res: Response) {
    let { data } = req.body;
  
    await data.forEach(async (item: any) => {
      await ImagesController.changeOneimage(item, "ACCEPTED")
        .then((x) => x)
        .catch((e) => console.log(e));
      await ImagesController.saveOneImage(item)
        .then((x) => x)
        .catch((e) => console.log(e));
    });

    return res.status(200).json({
      ok: true,
    });
  }
  static async downloadAllImages(req: Request, res: Response) {
    let { data, id } = req.body;
    let zip = new AdmZip();
    let identifer = `${new Date().getMilliseconds()}${id}`;

    await data.forEach(async (item: any) => {
      let pathFile = path.resolve(
        __dirname,
        `../../uploads/${item.tipo}/${item.url}`
      );
      let buffer = fs.readFileSync(pathFile);
      await ImagesController.changeOneimage(item, "ACCEPTED")
        .then((x) => x)
        .catch((e) => console.log(e));
      await zip.addLocalFile(pathFile);
      let pathFile2 = path.resolve(
        __dirname,
        `../../uploads/zip/${identifer}.zip`
      );
      let zipFileContents = zip.writeZip(pathFile2);
    });

    ImagesController.deleteFile(identifer);

    return res.status(200).json({
      ok: true,
      id: identifer,
    });
  } 
  static deleteFile(id: any) {
    setTimeout(() => {
      UploadController.borraArchivo(`${id}.zip`, "zip");
    }, 20000);
  }
}
