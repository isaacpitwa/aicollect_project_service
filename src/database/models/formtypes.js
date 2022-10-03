import { Schema, model } from 'mongoose';

const FormTypeSchema = new Schema({
    _id: Schema.Types.ObjectId,
    label: { type: String, required: true },
},{
    timestamps:true
})

module.exports = model('FormType',FormTypeSchema);