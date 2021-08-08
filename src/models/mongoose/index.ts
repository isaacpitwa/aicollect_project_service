import {model, Schema} from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');

//user schema
const userschema = new Schema({
    userid:{type:Number,required:true},
    name:{type:String,trim:true},
});

//
const sectorschema = new Schema({
  title:{type:String,required:true},
  id:{type:Number,trim:true},
});

//
const moduleschema = new Schema({
  modulename:{type:String,required:true},
  id:{type:Number,trim:true},
});

//project schema
const projectschema = new Schema({
  projectname: { type: String,required:true},
  description: { type: String},
  addedBy: userschema,
  sector:sectorschema,
  isDeleted: {type:Boolean,default:false}
},
{timestamps:true});
projectschema.plugin(mongoosePaginate);


// project teams schema
const projectteamsschema = new Schema({
  userid: { type: Number,required:true},
  names: { type: String,required:true},
  role:{
    enum: [ "inspector", "manager" ],
  },
  projectid:  {type:Schema.Types.ObjectId},
  isDeleted: {type:Boolean,default:false}
},
{timestamps:true});
projectteamsschema.plugin(mongoosePaginate);

//project modules
const projectmodulesschema = new Schema({
  module: moduleschema,
  addedBy:userschema,
  projectid:  {type:Schema.Types.ObjectId},
  isDeleted: {type:Boolean,default:false}
},
{timestamps:true});
projectmodulesschema.plugin(mongoosePaginate);

//project questionaires
const projectquestionairesschema = new Schema({
  projectid: {type:Schema.Types.String,require:true},
  moduleid: {type:Schema.Types.ObjectId,require:true},
  questionaireid: {type:Schema.Types.ObjectId,require:true},
  addedBy:  userschema,
  isDeleted: {type:Boolean,default:false}
},
{timestamps:true});
projectquestionairesschema.plugin(mongoosePaginate);

//questionaire
const questionairesschema = new Schema({
  title: {type:Schema.Types.String,require:true},
  description: {type:Schema.Types.String,require:false},
  formjson:{type:Schema.Types.Array,required:true},
  addedBy:  userschema,
  postgresparentid:{type:Schema.Types.Number,default:null},
  mongodbparentid:{type:Schema.Types.String,default:null},
  isDeleted: {type:Boolean,default:false},
  isActive: {type:Boolean,default:true},
},
{timestamps:true});
questionairesschema.plugin(mongoosePaginate);

const mongooseschemas  = {
    userschema,
    sectorschema,
    projectschema,
    moduleschema,
    projectteamsschema,
    projectmodulesschema,
    questionairesschema,
    projectquestionairesschema
}
export default mongooseschemas;