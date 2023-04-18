import {Router} from 'express';
import AnunciosController from '../controllers/anunciosController';
import ClientControler from '../controllers/ClientController';
import FinanzasController from '../controllers/finanzasController';
import RecordsController from '../controllers/finanzasRecords';
import ImagesController from '../controllers/imagesController';
import LoginController from '../controllers/loginController';
import NotificationController from '../controllers/notificationController';
import NoticiasController from '../controllers/noticiasController';
import OnlineController from '../controllers/onlineController';
import PeticionesController from '../controllers/peticionesController';
import UploadController from '../controllers/uploadController';
import UserController from '../controllers/userController';
import ZonesController from '../controllers/zonesController';
import {validarJWT} from '../middlewares/validarToken';

const webrouter =Router();

//Cliente
webrouter.get('/listado/:category',ClientControler.getFichas);
webrouter.get('/profile/:user',ClientControler.getFicha);
webrouter.post('/checkface',LoginController.checkFace);
webrouter.post('/login',ClientControler.Clientlogin);
webrouter.post('/logintwo',ClientControler.loginNoFace);
webrouter.post('/applogin',validarJWT,ClientControler.ClientApplogin);
webrouter.get('/tokenstatus',validarJWT,ClientControler.StatusToken);
webrouter.get('/checkemailuser/:id',UserController.check);
webrouter.get('/checkusername/:id',UserController.checkUsername);


//UPLOAD
webrouter.post('/uploads/:tipo/:id',UploadController.uploadFiles);
webrouter.post('/upload/:tipo/:id',UploadController.uploadFile);
//SPECS
webrouter.post('/pushspecs',validarJWT,UserController.setSpecs);
webrouter.get('/getspecs/:id',validarJWT,UserController.getSpecs);
//IMAGES
webrouter.get('/getimagesuser/:id/:status/:tipo',validarJWT,UserController.getImagesUser);
webrouter.post('/deleteimage',validarJWT,ImagesController.deleteImagebyuser);
webrouter.post('/updateimagesprofile',validarJWT,AnunciosController.updateImagesDisponibles);
webrouter.get('/getprofileanuncio/:id',validarJWT,AnunciosController.getProfile);
webrouter.post('/setlistados',validarJWT,AnunciosController.setListados);
webrouter.post('/setvisible',validarJWT,ClientControler.setVisible);

webrouter.post('/makeonline',validarJWT,OnlineController.setOnline);
webrouter.get('/getonline/:id',validarJWT,OnlineController.getTimeOnline);
webrouter.post('/fakecreate',validarJWT,UserController.putFakeData);
webrouter.get('/getzones',ZonesController.getZones);
webrouter.post('/setstates',validarJWT,AnunciosController.setStates);
webrouter.delete('/deleteonline/:id',validarJWT,OnlineController.deleteOnline)

//Notificationes
webrouter.post('/savenotification', NotificationController.save);
webrouter.get('/getnotifications', NotificationController.getAll);
webrouter.delete('/deleteallnotifications', NotificationController.deleteAll);

//peticiones
webrouter.post('/addpeticion',validarJWT,PeticionesController.create);
webrouter.post('/editpeticion',validarJWT,PeticionesController.editPeticion);
webrouter.get('/getonepeticiones/:id',validarJWT,PeticionesController.getOne);
webrouter.get('/getpeticiones/:id',validarJWT,PeticionesController.getAll);

//
webrouter.get('/getcompras/:id',validarJWT,RecordsController.getComprasUser);
webrouter.get('/getingresos/:id',validarJWT,RecordsController.getIngresosUser);
webrouter.get('/getlastoutputs',validarJWT,RecordsController.getLastCompras);
webrouter.get('/getlastinputs',validarJWT,RecordsController.getLastIngresos);
webrouter.get('/getprofilefinanzas/:id',validarJWT,FinanzasController.getFinanzasProfile);

webrouter.get('/getprofile/:id',validarJWT,UserController.getFicha);

//NOTICIAS
webrouter.get('/getnoticias',validarJWT,NoticiasController.getActive);


export default webrouter;