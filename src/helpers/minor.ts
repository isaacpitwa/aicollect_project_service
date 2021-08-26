import * as bcrypt from "bcryptjs";
import sectorModulesModel from "../models/sectormodules.model";
import clientModel from "../models/clients.model";
import companyLogsModel from "../models/companylogs.model";
const uuidv4 = require("uuidv4");
const sha256 = require("sha256");
const moment = require("moment");
import redisHelperObj from "./redishelper";
import winstonobj from "./winstonLogger";
import getDatabaseConnection from "../config/mongodb.connect";
import mongooseschemas from "../models/mongoose";
const CsvParser = require("json2csv").Parser;
const ObjectId  = require('mongodb').ObjectID
import questionaireModel from "../models/questionaires.model";

class minor {
  constructor() {}

  hashPassword(password: string): string {
    let hash = "";
    if (password.length < 10) {
      hash = bcrypt.hashSync(password);
    } else {
      hash = sha256(password);
    }
    return hash;
  }

  comparePassword(password: string, hash: string): Boolean {
    if (password.length < 10) {
      return bcrypt.compareSync(password, hash);
    } else {
      if (sha256(password) === hash) {
        return true;
      } else {
        return false;
      }
    }
  }

  generateUUIDstring(): string {
    return uuidv4();
  }

  formulateDBValidationErrors = (errors: any) => {
    const formatederrors = errors.map((ele: any, index: number) => {
      return {
        field: Object.values(ele)[2],
        value: Object.values(ele)[0],
      };
    });
    return formatederrors;
  };


  incrementClientProjects = async (clientid: any) => {    
    clientModel.increment(
      { no_of_users: +1 },
      { where: { id: parseInt(clientid) } }
    ).then((update:any)=>{
      winstonobj.logWihWinston({status:true,message:'updated projects count'},"PorjectManagementLogs")
    }).catch((error:Error) =>{
      winstonobj.logWihWinston({status:false,message:'Failed to increment projects count',error:JSON.stringify(error)},"PorjectManagementLogs")
    });
  }  

  decrementClientProjects = async (clientid: any) => {    
    clientModel.increment(
      { no_of_users: -1 },
      { where: { id: parseInt(clientid) } }
    ).then((update:any)=>{
      winstonobj.logWihWinston({status:true,message:'updated projects count'},"PorjectManagementLogs")
    }).catch((error:Error) =>{
      winstonobj.logWihWinston({status:false,message:'Failed to decrement projects count',error:JSON.stringify(error)},"PorjectManagementLogs")
    });
  } 

  autoAssignModules = async (requester:any,sectorid:string,project: string) => {    
    await sectorModulesModel.findAll({
      where:{sectorid:sectorid,ismandatory:true,isDeleted:false,isActive:true},
      attributes:[
        "id",
        "modulename",
        "type"  
      ],
      include: [{
        model: questionaireModel,
        where: { ismandatory:true,isActive:true,isDeleted:false },
        as:"questionaires",
        required: false,
        raw:true
      }],
      nested:true
    }).then((modules:any) => {
      
      modules.forEach(element => {
          element = element.dataValues; 
          const connection = getDatabaseConnection(requester.store);
          const projectsmodulesModel = connection.models['projectmodules'] || connection.model("projectmodules", mongooseschemas.projectmodulesschema);

          requester.name = requester.names;

          const newmodule = new projectsmodulesModel({
            projectid:ObjectId(project),
            addedBy: {userid:1,name:"AiCollect BOT"},
            module:{id:element.id,modulename:element.modulename,type:element.type||'UNI'}
          });

          newmodule.save((error:any,assigned:any) => {
            if(error){
              winstonobj.logWihWinston({status:false,message:"Failed to save auto assign single module",error:JSON.stringify(error)},"ProjectManagementLogs");
            }else{
              element.questionaires.forEach((questionaire)=> {
                questionaire.dataValues['formjson'] = JSON.parse(questionaire.dataValues['formschema'])
                this.saveAutoAssingedQuestionaire(requester.store,questionaire.dataValues);
              });
            }
          });
      });

    }).catch((error:Error) => {
        console.log(error)
        winstonobj.logWihWinston({status:false,message:"Failed to find auto assign modules",error:JSON.stringify(error)},"PorjectManagementLogs");
    });
  } 

  saveAutoAssingedQuestionaire = (store:string,data:any) => {
    try {
          console.log(data)
          const connection = getDatabaseConnection(store);
          const QuestionaireModel = connection.models['questionaires'] || connection.model("questionaires", mongooseschemas.questionairesschema);

          const newQuestionaire = new QuestionaireModel({
            title: data.title,
            description: data.description,
            formjson:data.formjson,
            addedBy: {userid:1,name:"AiCollect BOT"},
            ismandatory:true,
            postgresparentid:null,
            mongodbparentid:null,
          });

          newQuestionaire.save((error:any,saved:any)=>{
            if(error){
              winstonobj.logWihWinston({status:false,msg:"Failed to save auto questionaire",error:JSON.stringify(error)},"projectmanagementservice")
            }else{
              winstonobj.logWihWinston({status:true,msg:"saved auto questionaire",error:JSON.stringify(error)},"projectmanagementservice")
            }
          });
      } catch (error) {
        winstonobj.logWihWinston({status:false,message:"Failed to save project modules",error:JSON.stringify(error)},"projectmanagementservice");
    }
  }

}

const minorObj = new minor();
export default minorObj;
