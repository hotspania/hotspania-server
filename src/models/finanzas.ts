import {Schema,model} from 'mongoose';

const finanza = new Schema({
    user: {
        type: Schema.Types.ObjectId, ref: 'user'
    },
    balance:{
        type:Number,
        default:0
    },
    input:{
        type:Number,
        default:0
    },
    pending:{
        type:Number,
        default:0
    },  
    creado:{
        type:Date,
        default: Date.now
    }

},{
    versionKey: false // You should be aware of the outcome after set to false
});

export default model('finanza',finanza);