import {Schema,model} from 'mongoose';

const login_log = new Schema({
    user: {
        type: Schema.Types.ObjectId, ref: 'user'
    },
    url:String,
    email:String,
    status:String,
    tipo:String,   
    deviceid:String,
    similarity:String,
    error:String,
    creado:{
        type:Date,
        default: Date.now
    }
},{
    versionKey: false // You should be aware of the outcome after set to false
});

export default model('login_log',login_log);