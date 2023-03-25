"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const anunciosController_1 = __importDefault(require("../controllers/anunciosController"));
const ClientController_1 = __importDefault(require("../controllers/ClientController"));
const finanzasController_1 = __importDefault(require("../controllers/finanzasController"));
const finanzasRecords_1 = __importDefault(require("../controllers/finanzasRecords"));
const imagesController_1 = __importDefault(require("../controllers/imagesController"));
const loginController_1 = __importDefault(require("../controllers/loginController"));
const noticiasController_1 = __importDefault(require("../controllers/noticiasController"));
const onlineController_1 = __importDefault(require("../controllers/onlineController"));
const peticionesController_1 = __importDefault(require("../controllers/peticionesController"));
const uploadController_1 = __importDefault(require("../controllers/uploadController"));
const userController_1 = __importDefault(require("../controllers/userController"));
const zonesController_1 = __importDefault(require("../controllers/zonesController"));
const validarToken_1 = require("../middlewares/validarToken");
const webrouter = (0, express_1.Router)();
//Cliente
webrouter.get('/listado/:category', ClientController_1.default.getFichas);
webrouter.get('/profile/:user', ClientController_1.default.getFicha);
webrouter.post('/checkface', loginController_1.default.checkFace);
webrouter.post('/login', ClientController_1.default.Clientlogin);
webrouter.post('/logintwo', ClientController_1.default.loginNoFace);
webrouter.post('/applogin', validarToken_1.validarJWT, ClientController_1.default.ClientApplogin);
webrouter.get('/tokenstatus', validarToken_1.validarJWT, ClientController_1.default.StatusToken);
webrouter.get('/checkemailuser/:id', userController_1.default.check);
webrouter.get('/checkusername/:id', userController_1.default.checkUsername);
//UPLOAD
webrouter.post('/uploads/:tipo/:id', uploadController_1.default.uploadFiles);
webrouter.post('/upload/:tipo/:id', uploadController_1.default.uploadFile);
//SPECS
webrouter.post('/pushspecs', validarToken_1.validarJWT, userController_1.default.setSpecs);
webrouter.get('/getspecs/:id', validarToken_1.validarJWT, userController_1.default.getSpecs);
//IMAGES
webrouter.get('/getimagesuser/:id/:status/:tipo', validarToken_1.validarJWT, userController_1.default.getImagesUser);
webrouter.post('/deleteimage', validarToken_1.validarJWT, imagesController_1.default.deleteImagebyuser);
webrouter.post('/updateimagesprofile', validarToken_1.validarJWT, anunciosController_1.default.updateImagesDisponibles);
webrouter.get('/getprofileanuncio/:id', validarToken_1.validarJWT, anunciosController_1.default.getProfile);
webrouter.post('/setlistados', validarToken_1.validarJWT, anunciosController_1.default.setListados);
webrouter.post('/setvisible', validarToken_1.validarJWT, ClientController_1.default.setVisible);
webrouter.post('/makeonline', validarToken_1.validarJWT, onlineController_1.default.setOnline);
webrouter.get('/getonline/:id', validarToken_1.validarJWT, onlineController_1.default.getTimeOnline);
webrouter.post('/fakecreate', validarToken_1.validarJWT, userController_1.default.putFakeData);
webrouter.get('/getzones', zonesController_1.default.getZones);
webrouter.post('/setstates', validarToken_1.validarJWT, anunciosController_1.default.setStates);
webrouter.delete('/deleteonline/:id', validarToken_1.validarJWT, onlineController_1.default.deleteOnline);
//peticiones
webrouter.post('/addpeticion', validarToken_1.validarJWT, peticionesController_1.default.create);
webrouter.post('/editpeticion', validarToken_1.validarJWT, peticionesController_1.default.editPeticion);
webrouter.get('/getonepeticiones/:id', validarToken_1.validarJWT, peticionesController_1.default.getOne);
webrouter.get('/getpeticiones/:id', validarToken_1.validarJWT, peticionesController_1.default.getAll);
//
webrouter.get('/getcompras/:id', validarToken_1.validarJWT, finanzasRecords_1.default.getComprasUser);
webrouter.get('/getingresos/:id', validarToken_1.validarJWT, finanzasRecords_1.default.getIngresosUser);
webrouter.get('/getlastoutputs', validarToken_1.validarJWT, finanzasRecords_1.default.getLastCompras);
webrouter.get('/getlastinputs', validarToken_1.validarJWT, finanzasRecords_1.default.getLastIngresos);
webrouter.get('/getprofilefinanzas/:id', validarToken_1.validarJWT, finanzasController_1.default.getFinanzasProfile);
webrouter.get('/getprofile/:id', validarToken_1.validarJWT, userController_1.default.getFicha);
//NOTICIAS
webrouter.get('/getnoticias', validarToken_1.validarJWT, noticiasController_1.default.getActive);
exports.default = webrouter;
