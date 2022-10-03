import { Schema, model } from 'mongoose';

const SectorSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: Number, required: true },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived','deleted'],
    },
}, {
    timestamps: true
})

module.exports = model('Sector', SectorSchema);