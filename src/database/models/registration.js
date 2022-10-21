import { Schema, model } from 'mongoose';
import { userschema } from './shared';
const response ={
    _id: Schema.Types.ObjectId,
    questionaire: { 
        info: { 
            type: Types.ObjectId,
            ref: 'Questionaire'
        },
        version: { type: Number, required: true },
    },
    submittedBy: userschema,
    submittedOn: { type: Date, required: true },
    timeSpentToSubmit: { type: String, required: true },
    gps: { type: Object, required: true },
    answers: { type: Array, required: true },
    region: { type: Object, required: true },
    person: { type: String, required: true },
    prefix_id: { type: Number, required: true },
    status: { 
        type: String,
        enum: ['draft', 'published', 'archived','deleted'],
        default: 'published',
     },
}

/** Registration Records by the registration module */
const Registration = new Schema({
    latest: {...response},
    original: {...response},
}, {
    timestamps: true
});

module.exports = model('Registration', Registration);