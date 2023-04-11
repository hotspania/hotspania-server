import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import sizeOf  from 'image-size';
import imageModel from "../models/images";
import image_logs from '../models/loginlogs';
import { UPLOADFOLDER } from "../global/enviroment";

export default class UploadController {
  static async uploadFile(req: Request, res: Response) {
    if (!req.files) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "No se ha subido archivo",
        },
      });
    }

    const id = req.params.id;
    const key = req.params.tipo;
    const archivo = req.files.archivo;
    const fileExt = archivo.mimetype;
    const fileSize = archivo.size;
    let {height,width} = sizeOf(archivo.data);   
    const ext = archivo.mimetype.split("/")[1];
    const fileName = `${id}${key}${new Date().getMilliseconds()}.${ext}`;
    let extensionesvalidas = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/webp",
      "image/bmp",
      "image/gif",
      "video/mp4",
      "video/avi",
      "video/3gp",
      "video/mpg",
      "video/mov",
      "video/3gp",
      "video/wmv",
      "video/flv",
    ];
    let keysValors = ["dni", "original", "profile", "edit","login","logs"];

    if(fileSize > 4000000) {
      return res.status(400).json({
        ok: false,
        message: `Archivo: ${fileName} muy pesado. Escoja otro fichero.`,
      });
    }

    if (extensionesvalidas.indexOf(fileExt) > -1) {
      if (keysValors.includes(key, 0)) {   
        archivo.mv(`${UPLOADFOLDER}/${key}/${fileName}`, (err: any) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              message: "error al mover el archivo",
            });
          }
        });
      } else {
        return res.status(401).json({
          ok: false,
          message: "Funcion aun no construida",
        });
      }
      let type: string = "";

      (key === "original") ? (type = "PENDING") : "";
      (key === "profile") ? (type = "ACCEPTED") : "";
      (key === "dni") ? (type = "ACCEPTED") : "";
      (key === "login") ? (type = "ACCEPTED") : "";
      (key === "logs") ? (type = "ACCEPTED") : "";

      if(key== "dni" || key =="login"){
        let existe:any=await UploadController.checkRecord(id,key).then((data:any)=>data.ok).catch(error=>error);
        if(existe){
          UploadController.borraArchivo(existe.url,key);

          imageModel.updateOne({user:id,tipo:key},{
            $set:{
              url:fileName
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
              return res.status(200).json({
                ok: true,
                data,
              });
            }
          });
        }else{
          let a = new imageModel({
            user: id,
            url: fileName,
            status:type,
            tipo: key,
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
      }else if(key=='logs'){
        let a = new image_logs({
          user: id,
          url: fileName,
          status:type,
          tipo: key,
          height:height,
          width:width
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
      else{
        let a = new imageModel({
          user: id,
          url: fileName,
          status:type,
          tipo: key,
          height:height,
          width:width
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

    } else {
      return res.status(500).json({
        ok: false,
        err: {
          message:
            "Las extensiones permitidas son " + extensionesvalidas.join(", "),
          ext: ext,
        },
      });
    }
  }
  static uploadFiles(req: Request, res: Response) {
    if (!req.files) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "No se ha subido archivo",
        },
      });
    }

    const archivos: any = req.files.archivo;
    const id: any = req.params.id;
    const key: any = req.params.tipo;
    let filesupload: number = 0;

    archivos.forEach(async (archivo: any) => {
      let ext = archivo.mimetype.split("/")[1];
      let random = Math.round(Math.random() * 1234);
      const fileName = `${id}${key}${random}-${new Date().getMilliseconds()}.${ext}`;
      const fileSize = archivo.size;
      if(fileSize > 4000000) {
        return res.status(400).json({
          ok: false,
          message: `Archivo: ${fileName} muy pesado. Escoja otro fichero.`,
        });
      }
    });

    archivos.forEach(async (e: any) => {
      let {height,width} = sizeOf(e.data);     
      let fileExt = e.mimetype;
      let ext = e.mimetype.split("/")[1];
      let random = Math.round(Math.random() * 1234);
      const fileName = `${id}${key}${random}-${new Date().getMilliseconds()}.${ext}`;
      let extensionesvalidas = [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/webp",
        "image/bmp",
        "image/gif",
        "video/mp4",
        "video/avi",
        "video/3gp",
        "video/mpg",
        "video/mov",
        "video/3gp",
        "video/wmv",
        "video/flv",
      ];
      let keysValors = ["dni", "original", "profile", "edit"];



      if (extensionesvalidas.indexOf(fileExt) > -1) {
        if (keysValors.includes(key, 0)) {
          e.mv(`${UPLOADFOLDER}/${key}/${fileName}`, (err: any) => {
            if (err) {
            }
          });
        }
      }

      let type: string = "";
      (key === "original") ? (type= "PENDING") : "";
      (key === "profile") ? (type = "ACCEPTED") : "";
      (key === "dni") ? (type = "ACCEPTED") : "";

      let upload = await UploadController.saveFile(id, fileName, type, key,height,width)
        .then((x: any) => {
          return true;
        })
        .catch((error: any) => {
          console.log(error);
          return false;
        });

      if (!upload) {
        return res.status(401).json({
          ok: false,
          message: "ERROR",
        });
      }
    });

   return res.status(200).json({
      ok: true,
      message: "Exito Subido todos los archivos",
    });
  }
  static saveFile(user: string, url: string, status: string, tipo: string,height:any,width:any) {
    return new Promise((resolve, reject) => {
      let a = new imageModel({
        user,
        url,
        status,
        tipo,
        height,
        width
      });

      a.save((err: any, data: any) => {
        if (err) {
          reject({
            ok: false,
            err,
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
  static borraArchivo(fileName: any, key: any) {
    let pathImagen = path.resolve(
      __dirname,
      `../../${UPLOADFOLDER}/${key}/${fileName}`
    );
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  static checkfolder(rute: any) {
    let pathFolder = path.resolve(__dirname, rute);

    if (fs.existsSync(pathFolder)) {
      return true;
    } else {
      fs.mkdirSync(pathFolder);
      return true;
    }
  }
  static checkRecord(user:string,key:any){
    return new Promise((resolve,reject)=>{
      imageModel.findOne({user:user,tipo:key}).exec((err:any,data:any)=>{
        if (err) {
          reject({
            ok: false,
            err,
          });
        }
        if(!data){
          resolve({
            ok: false
          });
        }
        if (data) {
          resolve({
            ok:data            
          });
        }
      })

    })
  }
}
