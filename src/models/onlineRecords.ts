import { Schema, model } from 'mongoose';

const online = new Schema({ 
    user:{
        type: Schema.Types.ObjectId, ref: 'user'
    }, 
    online:{
        type:Boolean,
        default:false
    },
    time:String,
    creado: {
        type: Date,
        default: Date.now
    },
}, {
    versionKey: false // You should be aware of the outcome after set to false
});


export default model('online', online);