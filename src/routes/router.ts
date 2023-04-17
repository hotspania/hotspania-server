import { Router } from 'express';
import UserController from '../controllers/userController';
import UploadController from '../controllers/uploadController';
import DownloadController from '../controllers/downloadController';
import ZonesController from '../controllers/zonesController';
import PaquetesController from '../controllers/paquetesController';
import ImagesController from '../controllers/imagesController';
import AnunciosController from '../controllers/anunciosController';
import AdminController from '../controllers/adminsController';
import FinanzasController from '../controllers/finanzasController';
import ClientControler from '../controllers/ClientController';
import TagsController from '../controllers/tagsController';
import RecordsController from '../controllers/finanzasRecords';
import CronController from '../controllers/cronController';
import PeticionesController from '../controllers/peticionesController';
import NoticiasController from '../controllers/noticiasController';
import LoginController from '../controllers/loginController';
import LetraController from '../controllers/letraController';

const router= Router();


//admins

router.post('/admincreate',AdminController.crearUsuario);
router.post('/adminlogin',AdminController.login);
router.get('/admincheck/:id',AdminController.check);
router.get('/getadmin/:id',AdminController.getAdmin);
router.get('/getAlladmin',AdminController.getAllAdmin);
router.post('/editadmin',AdminController.editAdmin);
router.post('/changepasswordadmin',AdminController.changePassword);

//USERS
router.post('/usercreate',UserController.createRealData);
router.post('/fakecreate',UserController.putFakeData);
router.put('/realuser',UserController.editRealData);
router.get('/getprofiles',UserController.getFichas);
router.get('/getpendingprofiles',UserController.getFichasPendientes);
router.get('/getprofile/:id',UserController.getFicha);
router.get('/getalldata/:id',UserController.getAllFicha);
router.get('/getdnidata/:id',UserController.getDniUser);
router.get('/checkemailuser/:id',UserController.check);
router.get('/checkusername/:id',UserController.checkUsername);

router.get('/getimagesuser/:id/:status/:tipo',UserController.getImagesUser);

router.get('/getpendingimagesuser/:id',UserController.getPendingImagesUser);
router.post('/changepassworduser',UserController.changePassword);
router.post('/activarficha',UserController.activarProfile);

router.post('/updateficha',UserController.updateFicha);

router.delete('/deleteprofile/:id',UserController.deleteProfile);
router.delete('/deleteuser/:id',UserController.deleteUser);

//Specs
router.post('/pushspecs',UserController.setSpecs);
router.get('/getspecs/:id',UserController.getSpecs);

//Zones
router.post('/savezone',ZonesController.SaveZone);
router.put('/editzone',ZonesController.editZone);
router.get('/getzones',ZonesController.getZones);
router.delete('/getzones/:id',ZonesController.deleteZone);

//paquetes
router.post('/createpaquete',PaquetesController.createpaquete);
router.put('/editpaquete',PaquetesController.editpaquete);
router.get('/getpaquetes',PaquetesController.getPaquetes);

//anuncios


router.get('/getprofileanuncio/:id',AnunciosController.getProfile);
router.post('/dayaddprofile',AnunciosController.addTimeProfile);
router.post('/ajustardias',AnunciosController.ajustDays);

router.post('/setlistados',AnunciosController.setListados);
router.post('/updateimagesprofile',AnunciosController.updateImagesDisponibles);

//LETRAS
router.post('/crearletra',LetraController.crear);
router.post('/asignarletra',LetraController.asignar);
router.get('/getletras',LetraController.getAll);


//ImagesController
router.post('/changeimage',ImagesController.changeImage);   
router.post('/rejectimage',ImagesController.rejectImage); 
router.post('/deleteimage',ImagesController.deleteImage);
router.post('/rejectimages',ImagesController.rejectImages); 
router.post('/changeimages',ImagesController.aprovedAllImages);
router.post('/changestatusimages',ImagesController.changestatusImage);      
router.post('/downloadallimages',ImagesController.downloadAllImages);   

//Upload
router.post('/uploads/:tipo/:id',UploadController.uploadFiles);
router.post('/upload/:tipo/:id',UploadController.uploadFile);
 
//download
router.get('/img/:tipo/:id',DownloadController.getFile);
router.get('/imgs/:tipo/:width/:height/:id',DownloadController.getPhotoFile);
router.get('/download/:tipo/:id',DownloadController.downFile);

//FINANZAS
router.get('/getstatusfinanzas',FinanzasController.getSumPropertys);
router.get('/getpendingsuser',FinanzasController.getPendingUsers);


router.post('/setstates',AnunciosController.setStates);

router.get('/getcompras/:id',RecordsController.getComprasUser);
router.get('/getingresos/:id',RecordsController.getIngresosUser);

router.get('/getlastoutputs',RecordsController.getLastCompras);
router.get('/getlastinputs',RecordsController.getLastIngresos);

router.post('/addingreso',RecordsController.addIngreso);
router.post('/addcompra',RecordsController.addCompra);
router.post('/correcionfinanzas',RecordsController.deleteRecord);

router.get('/getprofilefinanzas/:id',FinanzasController.getFinanzasProfile);
router.get('/getallprofiles',FinanzasController.getProfiles);
router.post('/deleterecord',AnunciosController.addmultipaquetes);
router.get('/getallvencimientos',ClientControler.getvencimientos);


//CRONJOBS
router.post('/cronprofiles',CronController.createProfiles);


//TAGS
router.post('/addtag',TagsController.create);
router.get('/getags/:id',TagsController.getOne);
router.post('/deletetag',TagsController.deleteOne);
//TAGSCOLLETION
router.post('/savetag',TagsController.Savetagcolletion);
router.put('/edittag',TagsController.editagcolletion);
router.get('/gettags',TagsController.gettagcolletion);
router.delete('/gettag/:id',TagsController.deletetagcolletion);

//PETICIONES
router.post('/editpeticion',PeticionesController.editPeticion);
router.get('/getonepeticiones/:id',PeticionesController.getOne);
router.get('/getpeticiones/:id',PeticionesController.getAll);

//NOTICIAS

router.post('/createnoticia',NoticiasController.create);
router.post('/editnoticia',NoticiasController.editnoticias);
router.get('/getallnoticias',NoticiasController.getAll);
router.post('/deletenoticia',NoticiasController.deleteOne);

//LOGINRECORDS
router.get('/getlogin/:id/:skip',LoginController.getRecords);
router.get('/getloginuser/:id/',LoginController.getLoginImage);










export default router;

