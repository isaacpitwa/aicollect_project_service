import { Schema, model } from 'mongoose';

const StatusSchema = new Schema({
    label: { type: String, required: true },
},{
    timestamps:true
})

module.exports = model('Status',StatusSchema);