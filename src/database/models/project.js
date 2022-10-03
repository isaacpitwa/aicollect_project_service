import { Schema, model } from 'mongoose';

const ProjectSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String,required: true },
    client:{ type:Number, required: true},
    team: { type: Array, default: [] },
    createdBy: { type: Number,required: true },
    status: {
        type:String,
        enum:['draft','published','archived','deleted'],
        default: 'published'
    },
},{
    timestamps:true
})

module.exports = model('Project',ProjectSchema);