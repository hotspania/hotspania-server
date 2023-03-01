import { Request, Response } from "express";
import compra from '../models/compras';
import ingreso from '../models/ingresos';
import FinanzasController from "./finanzasController";

export default class RecordsController{

    static async addCompra(req: Request,res: Response){
        let {user,paquete,description,amount,profile,admin} = req.body;     

        let x =await FinanzasController.updatefinanzas(amount,user,"output");

        let a = new compra({
            user,
            profile,
            amount,
            description:description,
            admin,
            paquete
        });


        a.save((err:any, data:any) => {
            if (err) {
                return res.status(401).json({
                    ok:false,
                    message:"Error "
                })
            }

            if (!data){
                return res.status(401).json({
                    ok:false,
                    message:"Error "
                })
            }              
            return res.status(200).json({
                ok: true
            });
        });
    }
    static async addIngreso(req: Request,res: Response){
        let {user,paquete,description,amount,profile,admin} = req.body;
        
        let x =await FinanzasController.updatefinanzas(amount,user,"input");


        let a = new ingreso({
            user,
            profile,
            amount,
            description:description,
            admin:admin,
            paquete,
        });
      
        a.save((err:any, data:any) => {
            if (err) {
                return res.status(401).json({
                    ok:false,
                    message:"Error "
                })
            }

            if (!data){
                return res.status(401).json({
                    ok:false,
                    message:"Error "
                })
            }              
            return res.status(200).json({
                ok: true
            });
        });
    }
    static getComprasUser(req:Request,res:Response){
        let id = req.params.id;
        compra.find({user:id}).sort({date:-1}).exec((err: any, data: any) => {
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
    static getIngresosUser(req:Request,res:Response){
        let id = req.params.id;
        ingreso.find({user:id}).sort({date:-1}).exec((err: any, data: any) => {
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
    static getLastCompras(req:Request,res:Response){
        compra.find({}).limit(100).sort({date:-1}).exec((err: any, data: any) => {
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
    static getLastIngresos(req:Request,res:Response){
        ingreso.find({}).limit(100).sort({date:-1}).exec((err: any, data: any) => {
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

    static async deleteRecord(req:Request,res:Response){
      let { item,id,admin,tipo } =req.body;
      if(tipo==='output'){
        let x =await FinanzasController.correcionfinanzas(item.amount,id,"output");
        compra.deleteOne({_id:item._id}).exec((err: any, data: any) => {
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
      }else if(tipo==='input'){
        let x =await FinanzasController.correcionfinanzas(item.amount,id,"input");
        ingreso.deleteOne({_id:item._id}).exec((err: any, data: any) => {
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
    





}