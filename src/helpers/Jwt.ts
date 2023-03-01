import jwt from "jsonwebtoken";
import { SEED } from '../global/enviroment';


export const generarJWT = ( data:any ) => {

    return new Promise( ( resolve, reject ) => {

        const payload = {
            data,
        };
    
        jwt.sign( payload, SEED, {
            expiresIn: '1h'
        }, ( err, token ) => {
    
            if ( err ) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve( token );
            }
    
        });

    });

}
