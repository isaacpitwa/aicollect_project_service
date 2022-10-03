import { Schema, model } from 'mongoose';

const QuestionaireSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true },
    version: { type: Number, required: true },
    regions: { type: Array, required: true, default: [] },
    createdBy: { type: Number,required: true },
    client: { type: Number, required: true },
    project: { 
        type:Schema.Types.ObjectId,
        ref:'Project'
    },
    module: {  
        type:Schema.Types.ObjectId,
        ref:'Module' 
    },
    formFields: { type: Array, default: [] },
    status: {
        type:String,
        enum:['draft','published','archived','deleted'],
    },

},{
    timestamps:true
})

module.exports = model('Project',QuestionaireSchema);