import { Schema, model } from 'mongoose';

const ProjectSchema = new Schema({
    projectname: { type: String, required: true },
    description: { type: String,required: true },
    createdBy: { type: Number,required: true },
    isDeleted: { type: Boolean, default: false },
    projectTeam: { type: Array, default: [] },
    client:{ type:Number, required: true},
    status: {
        type:String,
        enum:['draft','published','archived','deleted'],
        default: 'published'
    },
},{
    timestamps:true
})

module.exports = model('Project',ProjectSchema);