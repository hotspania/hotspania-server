import { Request, Response, NextFunction } from "express";
import {SEED } from "../global/enviroment";
import jwt from "jsonwebtoken";


export const validarJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('x-token');
    if(!token){
      return res.status(401).json({
        ok:false,
        message:"Invalid Parameters"
      })
    }
    try {
        const data  = jwt.verify(token,SEED)

        next();       
    } catch (error) {
    
      return res.status(401).json({
        ok:false,
        message:"Ingrese de nuevo Session Expirada"
      })
    } 
};

