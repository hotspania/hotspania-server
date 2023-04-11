"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const uploadController_1 = __importDefault(require("../controllers/uploadController"));
const downloadController_1 = __importDefault(require("../controllers/downloadController"));
const zonesController_1 = __importDefault(require("../controllers/zonesController"));
const paquetesController_1 = __importDefault(require("../controllers/paquetesController"));
const imagesController_1 = __importDefault(require("../controllers/imagesController"));
const anunciosController_1 = __importDefault(require("../controllers/anunciosController"));
const adminsController_1 = __importDefault(require("../controllers/adminsController"));
const finanzasController_1 = __importDefault(require("../controllers/finanzasController"));
const ClientController_1 = __importDefault(require("../controllers/ClientController"));
const tagsController_1 = __importDefault(require("../controllers/tagsController"));
const finanzasRecords_1 = __importDefault(require("../controllers/finanzasRecords"));
const cronController_1 = __importDefault(require("../controllers/cronController"));
const peticionesController_1 = __importDefault(require("../controllers/peticionesController"));
const noticiasController_1 = __importDefault(require("../controllers/noticiasController"));
const loginController_1 = __importDefault(require("../controllers/loginController"));
const letraController_1 = __importDefault(require("../controllers/letraController"));
const router = (0, express_1.Router)();
//admins
router.post('/admincreate', adminsController_1.default.crearUsuario);
router.post('/adminlogin', adminsController_1.default.login);
router.get('/admincheck/:id', adminsController_1.default.check);
router.get('/getadmin/:id', adminsController_1.default.getAdmin);
router.get('/getAlladmin', adminsController_1.default.getAllAdmin);
router.post('/editadmin', adminsController_1.default.editAdmin);
router.post('/changepasswordadmin', adminsController_1.default.changePassword);
//USERS
router.post('/usercreate', userController_1.default.createRealData);
router.post('/fakecreate', userController_1.default.putFakeData);
router.put('/realuser', userController_1.default.editRealData);
router.get('/getprofiles', userController_1.default.getFichas);
router.get('/getpendingprofiles', userController_1.default.getFichasPendientes);
router.get('/getprofile/:id', userController_1.default.getFicha);
router.get('/getalldata/:id', userController_1.default.getAllFicha);
router.get('/getdnidata/:id', userController_1.default.getDniUser);
router.get('/checkemailuser/:id', userController_1.default.check);
router.get('/checkusername/:id', userController_1.default.checkUsername);
router.get('/getimagesuser/:id/:status/:tipo', userController_1.default.getImagesUser);
router.get('/getpendingimagesuser/:id', userController_1.default.getPendingImagesUser);
router.post('/changepassworduser', userController_1.default.changePassword);
router.post('/activarficha', userController_1.default.activarProfile);
//Specs
router.post('/pushspecs', userController_1.default.setSpecs);
router.get('/getspecs/:id', userController_1.default.getSpecs);
//Zones
router.post('/savezone', zonesController_1.default.SaveZone);
router.put('/editzone', zonesController_1.default.editZone);
router.get('/getzones', zonesController_1.default.getZones);
router.delete('/getzones/:id', zonesController_1.default.deleteZone);
//paquetes
router.post('/createpaquete', paquetesController_1.default.createpaquete);
router.put('/editpaquete', paquetesController_1.default.editpaquete);
router.get('/getpaquetes', paquetesController_1.default.getPaquetes);
//anuncios
router.get('/getprofileanuncio/:id', anunciosController_1.default.getProfile);
router.post('/dayaddprofile', anunciosController_1.default.addTimeProfile);
router.post('/ajustardias', anunciosController_1.default.ajustDays);
router.post('/setlistados', anunciosController_1.default.setListados);
router.post('/updateimagesprofile', anunciosController_1.default.updateImagesDisponibles);
//LETRAS
router.post('/crearletra', letraController_1.default.crear);
router.post('/asignarletra', letraController_1.default.asignar);
router.get('/getletras', letraController_1.default.getAll);
//ImagesController
router.post('/changeimage', imagesController_1.default.changeImage);
router.post('/rejectimage', imagesController_1.default.rejectImage);
router.post('/deleteimage', imagesController_1.default.deleteImage);
router.post('/rejectimages', imagesController_1.default.rejectImages);
router.post('/changeimages', imagesController_1.default.aprovedAllImages);
router.post('/changestatusimages', imagesController_1.default.changestatusImage);
router.post('/downloadallimages', imagesController_1.default.downloadAllImages);
//Upload
router.post('/uploads/:tipo/:id', uploadController_1.default.uploadFiles);
router.post('/upload/:tipo/:id', uploadController_1.default.uploadFile);
//download
router.get('/img/:tipo/:id', downloadController_1.default.getFile);
router.get('/imgs/:tipo/:width/:height/:id', downloadController_1.default.getPhotoFile);
router.get('/download/:tipo/:id', downloadController_1.default.downFile);
//FINANZAS
router.get('/getstatusfinanzas', finanzasController_1.default.getSumPropertys);
router.get('/getpendingsuser', finanzasController_1.default.getPendingUsers);
router.post('/setstates', anunciosController_1.default.setStates);
router.get('/getcompras/:id', finanzasRecords_1.default.getComprasUser);
router.get('/getingresos/:id', finanzasRecords_1.default.getIngresosUser);
router.get('/getlastoutputs', finanzasRecords_1.default.getLastCompras);
router.get('/getlastinputs', finanzasRecords_1.default.getLastIngresos);
router.post('/addingreso', finanzasRecords_1.default.addIngreso);
router.post('/addcompra', finanzasRecords_1.default.addCompra);
router.post('/correcionfinanzas', finanzasRecords_1.default.deleteRecord);
router.get('/getprofilefinanzas/:id', finanzasController_1.default.getFinanzasProfile);
router.get('/getallprofiles', finanzasController_1.default.getProfiles);
router.post('/deleterecord', anunciosController_1.default.addmultipaquetes);
router.get('/getallvencimientos', ClientController_1.default.getvencimientos);
//CRONJOBS
router.post('/cronprofiles', cronController_1.default.createProfiles);
//TAGS
router.post('/addtag', tagsController_1.default.create);
router.get('/getags/:id', tagsController_1.default.getOne);
router.post('/deletetag', tagsController_1.default.deleteOne);
//TAGSCOLLETION
router.post('/savetag', tagsController_1.default.Savetagcolletion);
router.put('/edittag', tagsController_1.default.editagcolletion);
router.get('/gettags', tagsController_1.default.gettagcolletion);
router.delete('/gettag/:id', tagsController_1.default.deletetagcolletion);
//PETICIONES
router.post('/editpeticion', peticionesController_1.default.editPeticion);
router.get('/getonepeticiones/:id', peticionesController_1.default.getOne);
router.get('/getpeticiones/:id', peticionesController_1.default.getAll);
//NOTICIAS
router.post('/createnoticia', noticiasController_1.default.create);
router.post('/editnoticia', noticiasController_1.default.editnoticias);
router.get('/getallnoticias', noticiasController_1.default.getAll);
router.post('/deletenoticia', noticiasController_1.default.deleteOne);
//LOGINRECORDS
router.get('/getlogin/:id/:skip', loginController_1.default.getRecords);
router.get('/getloginuser/:id/', loginController_1.default.getLoginImage);
exports.default = router;
