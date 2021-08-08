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
      ],
      raw:true
    }).then((modules:any) => {
      requester.name = requester.names;
       const toinsert = modules.map(item => ({projectid:ObjectId(project),module:item,addedby:requester}));
       this.saveAutoAssingedModules(requester.store,toinsert);
    }).catch((error:Error) => {
        winstonobj.logWihWinston({status:false,message:"Failed to find auto assign modules",error:JSON.stringify(error)},"PorjectManagementLogs");
    });
  } 

  saveAutoAssingedModules = (store:string,data:Array<object>) => {
    try {
          const connection = getDatabaseConnection(store);
          const projectsmodulesModel = connection.models['projectmodules'] || connection.model("projectmodules", mongooseschemas.projectmodulesschema);
          projectsmodulesModel.insertMany(data);
      } catch (error) {
        winstonobj.logWihWinston({status:false,message:"Failed to save project modules",error:JSON.stringify(error)},"projectmanagementservice");
    }
  }

}

const minorObj = new minor();
export default minorObj;
