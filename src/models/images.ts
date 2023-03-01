import {Schema,model} from 'mongoose';

const image = new Schema({
    user: {
        type: Schema.Types.ObjectId, ref: 'user'
    },
    autorizo: {
        type: Schema.Types.ObjectId, ref: 'admin'
    },
    url:String,
    status:String,
    tipo:String,
    height:String,
    width:String,
    description:String,
    creado:{
        type:Date,
        default: Date.now
    }
},{
    versionKey: false // You should be aware of the outcome after set to false
});

export default model('image',image);