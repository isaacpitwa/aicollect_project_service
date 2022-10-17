import { Schema, model } from 'mongoose';
import { userschema } from './shared';

const SubmoduleSchema = new Schema({
    name: { type: String, required: true },
    createdBy: userschema,
    client: { type: Number, required: true },
    project: { 
        type:Schema.Types.ObjectId,
        ref:'Project'
    },
    status: {
        type:String,
        enum:['draft','published','archived','deleted'],
        default: 'published',
    },
},{
    timestamps:true
})

export default model('Submodule',SubmoduleSchema);