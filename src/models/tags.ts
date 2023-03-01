import {Schema,model} from 'mongoose';

const tag = new Schema({
    user: {
        type: Schema.Types.ObjectId, ref: 'user'
    },
    titulo:{
        type:String,
        lowercase:true
    },
    creado:{
        type:Date,
        default: Date.now
    }
},{
    versionKey:false
});


export default model('tag',tag);

