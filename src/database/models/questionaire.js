import { Schema, model } from 'mongoose';
import { userschema } from './shared';

const QuestionaireSchema = new Schema({
    name: { type: String, required: true },
    version: { type: Number, required: true },
    regions: { type: Array, required: true, default: [] },
    createdBy: userschema,
    client: { type: Number, required: true },
    module:{ type: Number, required: true},
    project: { 
        type:Schema.Types.ObjectId,
        ref:'Project'
    },
    formFields: { type: Array, default: [] },
    status: {
        type:String,
        enum:['draft','published','archived','deleted'],
        default: 'draft',
    },
    version: { type: Number, required: true },
},{
    timestamps:true
})

export default model('Questionaire',QuestionaireSchema);