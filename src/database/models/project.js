import { Schema, model } from 'mongoose';
import { userschema } from './shared';

const ProjectSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String,required: true },
    client:{ type:Number, required: true},
    team: { type: Array, default: [] },
    createdBy: userschema,
    status: {
        type:String,
        enum:['draft','published','archived','deleted'],
        default: 'published'
    },
},{
    timestamps:true
})

export default model('Project',ProjectSchema);