import {Schema,model} from 'mongoose';

const paquete = new Schema({
    clase:String,
    titulo:String,
    price:Number,
    days:Number,
    status:{
        type:Boolean,
        default:true
    },
    fecha_creacion:{
        type:Date,
        default:Date.now
    }
},{
    versionKey: false // You should be aware of the outcome after set to false
});

export default model('paquete',paquete);
