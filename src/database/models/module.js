import { Schema, model } from 'mongoose';

const ModuleSchema = new Schema({
    _id: Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String, required: true },
    sector: {
        type: Types.ObjectId,
        ref: 'Sector'
    },
    type: {
        type: Schema.Types.ObjectId,
        ref: 'FormType'
    },
    createdBy: { type: Number, required: true },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
    },
}, {
    timestamps: true
})

module.exports = model('Module', ModuleSchema);