import SocketIO  from 'socket.io';
import express from 'express';
import {SERVER_PORT} from '../global/enviroment';
import http from 'http';
import * as sk from '../sockets/socket';


export default class Server{
    private static _instance:Server;

    public app:express.Application;
    public port:Number;
    public io:SocketIO.Server;
    private httpServer:http.Server;


    private constructor(){
        this.app = express();
        this.port= SERVER_PORT;
        this.httpServer= http.createServer(this.app);
        this.io= new SocketIO.Server(this.httpServer);  
        this.listenSockets();
    }

    public static get Instance(){
        return this._instance || (this._instance = new this());
    }

    private listenSockets(){
        console.log('Listen Sockets');
        
        this.io.on ('connection',client=>{
          sk.connectclient(client);
        });
    }


    start (callback : Function) {
        
        this.app.listen (this.port,callback())

    }







}