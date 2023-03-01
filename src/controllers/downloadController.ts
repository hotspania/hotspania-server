import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';


export default class DownloadController{    

    static getFile(req:Request,res:Response){

        let tipo = req.params.tipo;
        let img = req.params.id; 
        let pathFile= path.resolve(__dirname,`../../uploads/${tipo}/${img}`);
        if(fs.existsSync(pathFile)){
            res.sendFile(pathFile);
        }else{
            let noimage= path.resolve(__dirname,'../../assets/noimage.jpg');
            res.sendFile(noimage);
        }
    }

    static getPhotoFile(req:Request,res:Response){

        let tipo = req.params.tipo;
        let img = req.params.id; 
        let width = parseInt(req.params.width); 
        let height =parseInt(req.params.height); 
        let pathFile= path.resolve(__dirname,`../../uploads/${tipo}/${img}`);
        if(fs.existsSync(pathFile)){
            sharp(pathFile).resize(width,height).jpeg({mozjpeg:true}).toBuffer().then(data=>res.end(data)).catch(err=>{
                console.log("error")
            })
            // res.sendFile(pathFile);
        }else{
            let noimage= path.resolve(__dirname,'../../assets/noimage.jpg');
            res.sendFile(noimage);
        }
    }

    
    static downFile(req: Request, res: Response) {
        let tipo = req.params.tipo;
        let img = req.params.id;
        var pathFile = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);        
        res.download(pathFile); 
    }

    


}