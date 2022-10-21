import { Schema, model } from 'mongoose';
import { userschema } from './shared';

const SubmoduleSchema = new Schema({
    name: { type: String, required: true },
    createdBy: userschema,
    client: { type: Number, required: true },
    project: { 
        type:Schema.Types.ObjectId,
        ref:'Project',
        unique: true,
        index: { unique: true }
    },
    status: {
        type:String,
        enum:['draft','published','archived','deleted'],
        default: 'published',
    },
},{
    timestamps:true
})
SubmoduleSchema.path('project').index({ unique: true });

export default model('Submodule',SubmoduleSchema);