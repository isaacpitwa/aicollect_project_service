import { Schema, model } from 'mongoose';

const ModuleSchema = new Schema({
    _id: Types.ObjectId,
    type: {
        type: Schema.Types.ObjectId,
        ref: 'FormType'
    },
    name: { type: String, required: true },
    sector: {
        type: Types.ObjectId,
        ref: 'Sector'
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
    },
}, {
    timestamps: true
})

module.exports = model('Module', ModuleSchema);