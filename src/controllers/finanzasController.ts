import { Request, Response } from "express";
import modelFinanzas from "../models/finanzas";
import modelprofile from '../models/profile';

export default class FinanzasController {
  static getSumPropertys(req: Request, res: Response) {
    modelFinanzas
      .aggregate([
        {
          $group: {
            _id: null,
            balance: { $sum: "$balance" },
            pending: { $sum: "$pending" },
            inputs: { $sum: "$input" },
          },
        },
      ])
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

  static getPendingUsers(req: Request, res: Response) {
    modelFinanzas
      .find(
        {
          pending: { $gte: 1 },
        },
        {
          balance: true,
          pending: true,
          input: true,
          profile:true
        }
      )
      .limit(10)
      .sort({ pending: -1 })
      .populate("user")
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

  static updatefinanzas(amount:any,id:any,clase:any) {
    return new Promise((resolve,reject)=>{
      let value = parseInt(amount);
      let p:number=0;
      let i:number=0;
      let b:number=0;
      
      if(clase==='input'){
        i=value;
        p=-value;
        b=value;
        
        modelFinanzas
        .updateOne(
          { user: id },
          {
            $inc: { balance: b, pending: p, input: i }        
          }
        )
        .exec((err: any, data: any) => {
          if (err) {
            resolve( {
              ok:false,
              message:"error"
            })
          }
          if (!data) {
            resolve({
              ok:false,
              message:"No find User"
            })
          }
          if (data) {
            resolve({
              ok:true,
              message:"Succedde",
              data
            })        
          }
        });
      }else if(clase==='output'){

        p=value;
        b=-value;

        modelFinanzas
        .updateOne(
          { user: id },
          {
            $inc: { balance: b, pending: p }        
          }
        )
        .exec((err: any, data: any) => {
          if (err) {
            resolve( {
              ok:false,
              message:"error"
            })
          }
          if (!data) {
            resolve({
              ok:false,
              message:"No find User"
            })
          }
          if (data) {
            resolve({
              ok:true,
              message:"Succedde",
              data
            })        
          }
        });
      }  
    })

  }

  static correcionfinanzas(amount:any,id:any,clase:any) {
    return new Promise((resolve,reject)=>{
      let value = parseInt(amount);
      let p:number=0;
      let i:number=0;
      let b:number=0;
      
      if(clase==='input'){
        i=-value;
        p=value;
        b=-value;
        
        modelFinanzas
        .updateOne(
          { user: id },
          {
            $inc: { balance: b, pending: p, input: i }        
          }
        )
        .exec((err: any, data: any) => {
          if (err) {
            resolve( {
              ok:false,
              message:"error"
            })
          }
          if (!data) {
            resolve({
              ok:false,
              message:"No find User"
            })
          }
          if (data) {
            resolve({
              ok:true,
              message:"Succedde",
              data
            })        
          }
        });
      }else if(clase==='output'){
        p=-value;
        b=value;

        modelFinanzas
        .updateOne(
          { user: id },
          {
            $inc: { balance: b, pending: p }        
          }
        )
        .exec((err: any, data: any) => {
          if (err) {
            resolve( {
              ok:false,
              message:"error"
            })
          }
          if (!data) {
            resolve({
              ok:false,
              message:"No find User"
            })
          }
          if (data) {
            resolve({
              ok:true,
              message:"Succedde",
              data
            })        
          }
        });
      }  
    })

  }

  static getLastInputs(req: Request, res: Response) {
    modelFinanzas
      .aggregate([
        {
          $unwind: "$inputs",
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            amount: "$inputs.amount",
            date: "$inputs.date",
            admin: "$inputs.admin",
            user: "$user",
          },
        },
      ])
      .limit(10)
      .sort({ date: -1 })
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

  static getFinanzasProfile(req: Request, res: Response) {
    let id = req.params.id;
    modelFinanzas
      .find({ user: id })
      .populate("user")
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
  static getfinanzasProfiles(req: Request, res: Response) {   
    modelFinanzas
      .find({  },{imagenes:false,listados:false})
      .populate("user")
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
  static getProfiles(req: Request, res: Response) {   
    modelprofile
      .find({active: true},{imagenes:false,listados:false})
      .populate("user")
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
