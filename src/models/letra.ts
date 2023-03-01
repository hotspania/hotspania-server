import { Schema, model } from 'mongoose';

const letra = new Schema({ 
    user:{
        type: Schema.Types.ObjectId, ref: 'user'
    },
    profile:{
        type: Schema.Types.ObjectId, ref: 'profile'
    },
    active:{
        type:Boolean,
        default:false
    },
    freeze:{
        type:Boolean,
        default:false
    },
    taked:{
        type:Boolean,
        default:false
    },    
    number:{
        type:Number,
        unique:true
    },
    dias:Number,
    comienzo:String,
    fin:String,
    creado: {
        type: Date,
        default: Date.now
    },
}, {
    versionKey: false // You should be aware of the outcome after set to false
});


export default model('letra', letra);