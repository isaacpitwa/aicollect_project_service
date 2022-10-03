import { Schema, model } from 'mongoose';

const SectorSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: Number, required: true },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived','deleted'],
        default:'draft',
    },
}, {
    timestamps: true
})

module.exports = model('Sector', SectorSchema);