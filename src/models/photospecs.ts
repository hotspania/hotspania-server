import {Schema,model} from 'mongoose';

const spec = new Schema({
    user: {
        type: Schema.Types.ObjectId, ref: 'user'
    },
    retoques:[],
    creado:{
        type:Date,
        default: Date.now
    }

},{
    versionKey: false // You should be aware of the outcome after set to false
});

export default model('spec',spec);