import { Request, Response } from "express";
import zonesModel from '../models/zones';


export default class ZonesController{

    static SaveZone(req:Request,res:Response){

        let { titulo } = req.body;

        let a = new zonesModel({
            titulo
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
                ok: true
              });
            }
          });

    }
    static getZones(req:Request,res:Response){
        zonesModel.find({}).exec((err:any,data:any)=>{
          if(err){
            return res.status(500).json({
              ok:false,
              err
            });
          }
          if(!data){
            return res.status(201).json({
              ok:false,
              message:'Error no se encuentra ningun record'
            });
          }
          if(data){
            return res.status(201).json({
              ok:true,
              data
            });
          }
        });
    }
    static editZone(req:Request,res:Response){

        let { _id,titulo}= req.body;

        zonesModel.updateOne({'_id':_id},{
            $set:{
                titulo:titulo
            }
        }).exec((err:any,data:any)=>{
            if(err){
              return res.status(500).json({
                ok:false,
                err
              });
            }
            if(!data){
              return res.status(201).json({
                ok:false,
                message:'Error no se encuentra ningun record'
              });
            }
            if(data){
              return res.status(201).json({
                ok:true,
                data
              });
            }
          });
    }
    static deleteZone(req:Request,res:Response){

        let id = req.params.id;
        zonesModel.deleteOne({'_id':id}).exec((err:any,data:any)=>{
            if(err){
              return res.status(500).json({
                ok:false,
                err
              });
            }
            if(!data){
              return res.status(201).json({
                ok:false,
                message:'Error no se encuentra ningun record'
              });
            }
            if(data){
              return res.status(201).json({
                ok:true,
                data
              });
            }
          });
    }
}
