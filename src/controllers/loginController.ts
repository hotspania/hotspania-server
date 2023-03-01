import { Request, Response } from "express";
import modeluser from "../models/users";
import modelLog from "../models/loginlogs";
import imageModel from '../models/images';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import AWS from "aws-sdk";

import {
  CADUCIDAD_TOKEN,
  SEED,
  UPLOADFOLDER,
  AWS_KEY_VALUE,
  AWS_REGION_VALUE,
  AWS_SECRET_KEY_VALUE,
} from "../global/enviroment";
import UploadController from "./uploadController";
import { generarJWT } from '../helpers/Jwt';

export default class LoginController {

  static async checkFace(req: Request, res: Response) {
    let { id, device, image,error } = req.body;
    let key = "logs";
    let key2 = "login";
    const fileName = `${id}${key}${new Date().getMilliseconds() * 5263}.jpg`;

    let dir = path.resolve(
      __dirname,
      `../../${UPLOADFOLDER}/${key}/${fileName}`
    );

    fs.writeFileSync(`${dir}`, image, "base64");

 

    let logindata = await UploadController.checkRecord(id, "login")
      .then((x:any) => x.ok)
      .catch((e) => false);

    if (!logindata) {
      return res.status(400).json({
        ok: false,
        message: "Error Rostro incorrecto",
      });
    } else {

      let TargetImage = fs.readFileSync(
        path.resolve(__dirname, `../../${UPLOADFOLDER}/${key}/${fileName}`)
      );
        
      let SourceImage = fs.readFileSync(
        path.resolve(__dirname, `../../${UPLOADFOLDER}/${key2}/${logindata.url}`)
      );
  
      if (!AWS_KEY_VALUE || !AWS_REGION_VALUE || !AWS_SECRET_KEY_VALUE)
        throw new Error("Missing aws enviroment vars");
  
      const client = new AWS.Rekognition({
        accessKeyId: AWS_KEY_VALUE,
        secretAccessKey: AWS_SECRET_KEY_VALUE,
        region: AWS_REGION_VALUE,
      });
  
      // Usando un FileStream para enviar a AWS
      let params = {
        TargetImage: {
          Bytes: TargetImage,
        },
        SourceImage: {
          Bytes: SourceImage,
        },
        SimilarityThreshold: 0,
      };
  
      client.compareFaces(params, async function (err: any, response: any) {
        if (err) {
          let similarity = 0;
          let x = await LoginController.saveLoginRecord(id, fileName, device,similarity,error)
          .then((x) => x)
          .catch((e) => e);

          return res.status(400).json({
            ok: false,
            message: "Error Rostro incorrecto",
          });
        } else {
          let similarity = response.FaceMatches[0].Similarity;

          let x = await LoginController.saveLoginRecord(id, fileName, device,similarity,error)
          .then((x) => x)
          .catch((e) => e);
  
          if (similarity > 90) {
            let user = await LoginController.getUser(id)
              .then((x: any) => x[0])
              .catch((e) => false);
  
            if (!user) {
              return res.status(400).json({
                ok: false,
                message: "Error contraseña incorrectas",
              });
            }

            let payload = {
              id: id,
              email: user.email,
              nombre: user.fakeData.username,
            }
  
            let token =await generarJWT(payload);        
  
            return res.status(200).json({
              ok: true,
              token,
              user: id,
            });
          } else {
            return res.status(400).json({
              ok: false,
              message: "Error contraseña incorrectas",
            });
          }
        } // if
      });



    }

  }

  static getUser(id: any) {
    return new Promise((resolve, reject) => {
      modeluser.find({ _id: id }).exec((err: any, data: any) => {
        if (err) {
          reject(false);
        }
        if (!data) {
          reject(false);
        }
        if (data) {
          resolve(data);
        }
      });
    });
  }

  static saveLoginRecord(id: any, filename: any, device: any,similarity:any,error:any) {
    return new Promise((resolve, reject) => {
      let a = new modelLog({
        user: id,
        url: filename,
        deviceid: device,
        similarity,
        error
      }).save((err: any, data: any) => {
        if (err) {
          reject(false);
        }
        if (!data) {
          reject(false);
        }
        if (data) {
          resolve(data);
        }
      });
    });
  }
  static saveLoginNofaceRecord(email: any, status: any,similarity:any,error:any) {
    return new Promise((resolve, reject) => {
      let a = new modelLog({
        email: email,
        status: status,
        similarity,
        error
      }).save((err: any, data: any) => {
        if (err) {
          reject(false);
        }
        if (!data) {
          reject(false);
        }
        if (data) {
          resolve(data);
        }
      });
    });
  }


  static getRecords(req:Request,res:Response){
    let number =parseInt(req.params.id);
    let skip =parseInt(req.params.skip);
   

    modelLog.find({}).populate('user').limit(number).skip(skip).sort({'creado':-1})
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

  static getLoginImage(req:Request,res:Response){
    let id =req.params.id;
    imageModel.findOne({user:id,tipo:'login'})
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


  static renovarToken(req:Request,res:Response,next:any){

    const token = req.header('x-token');

    if(!token){
      return res.status(401).json({
        ok:false,
        message:"Invalid Parameters"
      })
    }

    try {

      
    } catch (error) {
      return res.status(401).json({
        ok:false,
        message:"Invalid Parameters Token"
      })

    }



  }







}
