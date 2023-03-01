import {Schema,model} from 'mongoose';

const admin = new Schema({  
    nombre:String,
    email:String,
    password:String,
    role:Number, 
    status:{
        type:Number,
        default:0
    },
    fecha_creacion:{
        type:Date,
        default:Date.now
    }    
},{
    versionKey:false
});

export default model('admin',admin);