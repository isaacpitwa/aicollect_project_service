import { Schema, model } from 'mongoose';

const QuestionaireSchema = new Schema({
    name: { type: String, required: true },
    version: { type: Number, required: true },
    regions: { type: Array, required: true, default: [] },
    createdBy: { type: Number,required: true },
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

},{
    timestamps:true
})

module.exports = model('Project',QuestionaireSchema);