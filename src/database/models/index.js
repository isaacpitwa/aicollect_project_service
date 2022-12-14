import { Schema, model, Types } from 'mongoose';
import projectModel from './project';
import formModel from './questionaire';
import submoduleModel from './submodule';

/** Users, cloned from the Authentication Service */
const userschema = new Schema({
  userId: { type: Number, required: true },
  name: { type: String, trim: true },
  roles: { type: String, required: true },
  supervisor: { type: Number, default:null},
});

/** Sectors created by Super Admin User (Users register under a specific sector) */
const sectorschema = new Schema({
  id: { type: Number, trim: true },
  title: {
    type: String, required: true, unique: true, trim: true
  },
  description: { type: String, required: true },
  modules: [{ type: Types.ObjectId, ref: 'module' }],
  createdBy: userschema,
  status: { type: Boolean, required: true, default: false },
}, { timestamps: true });
/** Projects created by Clients (Users)
 * Project Owner is the First User created (Client)
 */
const projectschema = new Schema({
  _id: Types.ObjectId,
  projectname: { type: String, required: true },
  description: { type: String },
  createdBy: userschema,
  isDeleted: { type: Boolean, default: false },
  projectTeam: { type: Array, default: [] },
  projectOwner: { type: String, default: [] },
}, { timestamps: true });

/** Questionaires Created by the Clients */
const formSchema = new Schema({
  name: { type: String, required: true },
  version: { type: Number, required: true },
  regions: { type: Array, required: true, default: [] },
  createdBy: userschema,
  clientId: { type: Number, required: true },
  projectId: { type: String },
  formType: { type: String },
  module: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: Boolean, required: true, default: false },
  formFields: { type: Array, default: [] },
});

/** Questionaire Templates created by the SuperAdmin */
const templateSchema = new Schema({
  name: { type: String, required: true },
  version: { type: Number, required: true },
  regions: { type: Array, required: true, default: [] },
  createdBy: userschema,
  module: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: Boolean, required: true, default: false },
  formFields: { type: Array, default: [] },
});

/** Responses submitted against the questionaires */
const responseSchema = new Schema({
  form: { type: String, required: true },
  submittedBy: userschema,
  submittedOn: { type: Date, required: true },
  timeSpentToSubmit: { type: String, required: true },
  gps: { type: Object, required: true },
  answers: { type: Array, required: true },
  region: { type: Object, required: true },
  person: { type: String, required: true },
  prefix_id: { type: Number, required: true },
});

/** Modules created Under a sector (For example Registration Module) */
const moduleschema = new Schema({
  id: { type: Number, trim: true },
  type: { type: String, required: true },
  moduleName: { type: String, required: true },
  sector: { type: Types.ObjectId, ref: 'Sector' },
}, { timestamps: true });

/** Tasks created under a project */
const taskSchema = new Schema({
  _id: Types.ObjectId,
  title: { type: String, required: true },
  taskType: { type: String, required: true },
  project: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  schedule: { type: Array, default: [] },
  team: { type: Array, default: [] },
  questionaire: { type: Array, required: true, default: [] },
  fieldForm: { type: Array, required: true, default: [] },
  rescheduled: { type: Boolean, required: true, default: false },
  completed: { type: Boolean, required: true, default: false },
  priority: { type: String, required: true, default: 'Normal' },
  dateCompleted: { type: Date, default: null },
  status: { type: String, required: true, default: 'Draft' },
  createdBy: userschema,
});

/** field Registrations created under a  Questionaire */
const fieldSchema = new Schema({
  name: { type: String, required: true },
  version: { type: Number, required: true },
  createdBy: userschema,
  clientId: { type: Number, required: true },
  projectId: { type: String },
  formType: { type: String },
  module: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: Boolean, required: true, default: false },
  formFields: { type: Array, default: [] },
});

/** Responses submitted against the questionaires */
const fieldResponseSchema = new Schema({
  questionaire: { type: String, required: true },
  fieldForm: { type: String, required: true },
  submittedBy: userschema,
  submittedOn: { type: Date, required: true },
  timeSpentToSubmit: { type: String, required: true },
  gps: { type: Object, required: true },
  answers: { type: Array, required: true },
  region: { type: Object, required: true },
  person: { type: String, required: true },
  response: { type: String, required: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
});

const userModel = model('User', userschema);
const sectorModel = model('Sector', sectorschema);
// const projectModel = model('Project', projectschema);
const moduleModel = model('Module', moduleschema);
// const formModel = model('Questionaire', formSchema);
const responseModel = model('Response', responseSchema);
const taskModel = model('Task', taskSchema);
const templateModel = model('Template', templateSchema);
const fieldModel = model('Field', fieldSchema);
const fieldResponseModel = model('FieldResponse', fieldResponseSchema);



const mongooseModels = {
  userModel,
  sectorModel,
  projectModel,
  moduleModel,
  formModel,
  responseModel,
  taskModel,
  templateModel,
  fieldModel,
  fieldResponseModel,
  submoduleModel,
};

export default mongooseModels;
