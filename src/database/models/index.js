import { Schema, model, Types } from 'mongoose';

/** Users, cloned from the Authentication Service */
const userschema = new Schema({
  userId: { type: Number, required: true },
  name: { type: String, trim: true },
  roles: { type: String, required: true }
});

/** Sectors created by Super Admin User (Users register under a specific sector) */
const sectorschema = new Schema({
  id: { type: Number, trim: true },
  title: { type: String, required: true }
});

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

/** Questionaires Created by the CLients */
const formSchema = new Schema({
  name: { type: String, required: true },
  version: { type: Number, required: true },
  regions: { type: Array, required: true, default: [] },
  createdBy: userschema,
  clientId: { type: Number, required: true },
  projectId: { type: String },
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
  projectId: { type: String, required: false },
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
  answers: { type: Array, required: true }
});

/** Modules created Under a sector (For example Registration Module) */
const moduleschema = new Schema({
  id: { type: Number, trim: true },
  type: { type: String, required: true },
  moduleName: { type: String, required: true }
});

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
  rescheduled: { type: Boolean, required: true, default: false },
  completed: { type: Boolean, required: true, default: false },
  priority: { type: String, required: true, default: 'Normal' },
  dateCompleted: { type: Date, default: null },
  status: { type: String, required: true, default: 'Draft' },
  createdBy: userschema,
});

const userModel = model('User', userschema);
const sectorModel = model('Sector', sectorschema);
const projectModel = model('Project', projectschema);
const moduleModel = model('Module', moduleschema);
const formModel = model('Questionaire', formSchema);
const responseModel = model('Response', responseSchema);
const taskModel = model('Task', taskSchema);
const templateModel = model('Template', templateSchema);

const mongooseModels = {
  userModel,
  sectorModel,
  projectModel,
  moduleModel,
  formModel,
  responseModel,
  taskModel,
  templateModel
};

export default mongooseModels;
