import { Schema } from 'mongoose';

const userschema = new Schema({
  userId: { type: Number, required: true },
  name: { type: String, trim: true }
});

const sectorschema = new Schema({
  id: { type: Number, trim: true },
  title: { type: String, required: true }
});

const projectschema = new Schema({
  projectname: { type: String, required: true },
  description: { type: String },
  createdBy: userschema,
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

const moduleschema = new Schema({
  id: { type: Number, trim: true },
  type: { type: String, required: true },
  moduleName: { type: String, required: true }
});

const mongooseSchemas = {
  userschema,
  sectorschema,
  projectschema,
  moduleschema
};

export default mongooseSchemas;
