import { Schema, model } from 'mongoose';

const userschema = new Schema({
  userId: { type: Number, required: true },
  name: { type: String, trim: true },
  roles: { type: String, required: true }
});

const sectorschema = new Schema({
  id: { type: Number, trim: true },
  title: { type: String, required: true }
});

const projectschema = new Schema({
  projectname: { type: String, required: true },
  description: { type: String },
  createdBy: userschema,
  isDeleted: { type: Boolean, default: false },
  projectTeam: { type: Array, default: [] }
}, { timestamps: true });

const formSchema = new Schema({
  name: { type: String, required: true },
  version: { type: Number, required: true },
  createdBy: userschema,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: Boolean, required: true },
  formFields: { type: Array, default: [] }
});

const responseSchema = new Schema({
  form: formSchema,
  submittedBy: userschema,
  submittedOn: { type: Date },
  timeSpentToSubmit: { type: Date },
  gps: { type: Object },
  answer: { type: Array }
});

const moduleschema = new Schema({
  id: { type: Number, trim: true },
  type: { type: String, required: true },
  moduleName: { type: String, required: true }
});

const userModel = model('User', userschema);
const sectorModel = model('Sector', sectorschema);
const projectModel = model('Project', projectschema);
const moduleModel = model('Module', moduleschema);
const formModel = model('Questionaire', formSchema);
const responseModel = model('Response', responseSchema);

const mongooseModels = {
  userModel,
  sectorModel,
  projectModel,
  moduleModel,
  formModel,
  responseModel
};

export default mongooseModels;
