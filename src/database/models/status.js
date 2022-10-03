import { Schema, model } from 'mongoose';

const StatusSchema = new Schema({
    _id: Types.ObjectId,
    label: { type: String, required: true },
},{
    timestamps:true
})

module.exports = model('Status',StatusSchema);