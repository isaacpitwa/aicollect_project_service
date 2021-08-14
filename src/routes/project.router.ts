import { request, Request, Response, Router } from "express";
import winstonobj from "../helpers/winstonLogger";
import validator from "../helpers/validators.helpers";
import administratorModel from "../models/administrators.model";
import minorObj from "../helpers/minor";
import auth from "../helpers/authhelper";
import getDatabaseConnection from "../config/mongodb.connect";
import mongooseschemas from "../models/mongoose";
import questionaireModel from "../models/questionaires.model";
import sectorModel from "../models/sector.model";
import sectorModulesModel from "../models/sectormodules.model";
import aggregations from "../models/mongoose/aggregations";
const moment = require('moment');
const ObjectId  = require('mongodb').ObjectID

class projectManagement {
  router: Router;

  constructor() {
    this.router = Router();

  }


  saveNewProject = async (req: Request, res: Response) => {
    try {
      const connection = getDatabaseConnection(req.body.requester.store);
      const projectsModel = connection.models['projects'] || connection.model("projects", mongooseschemas.projectschema);
      const newproject = new projectsModel({
        projectname: req.body.projectname,
        description: req.body.description,
        sector:req.body.sector,
        addedBy: {userid:req.body.requester.userid,name:req.body.requester.names},
      });
      newproject.save((error: any, saved: any) => {
          if (error) {
            winstonobj.logWihWinston({status:false,message:"Failed to save project details",error:JSON.stringify(error)},"projectmanagementservice");
            res.status(200).json({status: true,message: "Project details saved"});  
          } else {
            minorObj.autoAssignModules(req.body.requester,req.body.sector.id,saved._id);
            minorObj.incrementClientProjects(req.body.requester.clientid)
            res.status(200).json({status: true,message: "Project details saved"});  
          }
      })
  } catch (error) {
    winstonobj.logWihWinston({status:false,message:"Failed to save projcet details",error:JSON.stringify(error)},"projectmanagementservice");
    res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
  }
  };

  fetchAllProjects = (req:Request,res:Response) => {
      const connection = getDatabaseConnection(req.body.requester.store);
      const projectsModel = connection.models['projects'] || connection.model("projects", mongooseschemas.projectschema);

       // create filters array
      const filters: any = { isDeleted:false};
      if(req.body.where){
        req.body.where.projectname ? filters.projectname = req.body.where.projectname : '';
        req.body.where.description ? filters.description = req.body.where.description : '';
        if (req.body.where.date) {
            const from = moment(req.body.where.date.from, 'DD-MM-YYYY');
            const to = moment(req.body.where.date.to, 'DD-MM-YYYY');
            (req.body.where.date.to == req.body.where.date.from) ? filters.createdAt = from : '';
            (req.body.where.date.to != req.body.where.date.from) ? filters.createdAt = {
                        $gte: new Date(from),
                        $lte: new Date(to)
                    }
              : '';
          }
       }

       //set pagination options
       const options = {page: req.body.page?req.body.page:1,limit: 10,collation: {locale: 'en'},sort:{createdAt:-1},
       select: {_id:1,projectname:1,desscription:1,addedBy:1,createdAt:1}};

       projectsModel.paginate(filters, options, (err:any, result:any) => {
           if(err){
                winstonobj.logWihWinston({status:false,msg:"Failed to get all projects",error:JSON.stringify(err)},"projectmanagementservice")
               res.status(500).json({status:false,msg:"Something went wrong,please try again later"});
           }else{
               res.status(200).json({status:true,msg:"project fetched",data:result});
           }
       });
  }

  deleteProject = (req:Request,res:Response) => {
    if(!ObjectId.isValid(req.body.projectid)){
      res.status(400).json({status:false,msg:"Invalid project ID"});
    }else{
      try{
        const connection = getDatabaseConnection(req.body.requester.store);
        const projectsModel = connection.models['projects'] || connection.model("projects", mongooseschemas.projectschema);

        projectsModel.findOneAndUpdate({_id:ObjectId(req.body.projectid)},{$set:{isdelete:true}},{ returnNewDocument: true })
        .then((document:any) => {
          if(document) {
            res.status(200).json({status:true,msg:`Project deleted`});
          } else {
            res.status(400).json({status:false,msg:"Unknown project ID"});
          }
        }).catch((err) => {
          winstonobj.logWihWinston({status:false,msg:`Failed find project ${req.body.projectid}`,error:JSON.stringify(err)},"projectmanagementservice")
          res.status(500).json({status:false,msg:"Something went wrong, please try again later"});
        })
      }catch(error){
        winstonobj.logWihWinston({status:false,msg:`Failed find project ${req.body.projectid}`,error:JSON.stringify(error)},"projectmanagementservice")
        res.status(500).json({status:false,msg:"Something went wrong, please try again later"});
      }
    }
  }

  editProject = (req:Request,res:Response) => {
    if(!ObjectId.isValid(req.body.projectid)){
      res.status(400).json({status:false,msg:"Invalid project ID"});
    }else{
      try{
        const connection = getDatabaseConnection(req.body.requester.store);
        const projectsModel = connection.models['projects'] || connection.model("projects", mongooseschemas.projectschema);
        const toupdate = {projectname:req.body.projectname,description:req.body.description}
        projectsModel.findOneAndUpdate({_id:ObjectId(req.body.projectid)},{$set:toupdate},{ returnNewDocument: true })
        .then((document:any) => {
          if(document) {
            res.status(200).json({status:true,msg:`Project Edited`});
          } else {
            res.status(400).json({status:false,msg:"Unknown project ID"});
          }
        }).catch((err) => {
          winstonobj.logWihWinston({status:false,msg:`Failed find project yo edit ${req.body.projectid}`,error:JSON.stringify(err)},"projectmanagementservice")
          res.status(500).json({status:false,msg:"Something went wrong, please try again later"});
        })
      }catch(error){
        winstonobj.logWihWinston({status:false,msg:`Failed find project to edit ${req.body.projectid}`,error:JSON.stringify(error)},"projectmanagementservice")
        res.status(500).json({status:false,msg:"Something went wrong, please try again later"});
      }
    }
  }

  addTeamMember = (req:Request,res:Response) => {
      administratorModel
      .findOne({ where: { id: parseInt(req.body.userid),clientid:parseInt(req.body.requester.clientid) } })
      .then((user: any) => {
          if (user) {
            try{
                const connection = getDatabaseConnection(req.body.requester.store);
                const projcetTeamsModel = connection.models['projectteams'] || connection.model("projectteams", mongooseschemas.projectteamsschema);
                projcetTeamsModel.updateOne(
                  {'userid': user.id,'projectid':ObjectId(req.body.projectid),isDeleted:false},
                  {
                      '$setOnInsert': {
                          'userid': user.id,
                          'names': `${user.firstname} ${user.lastname}`,
                          'projectid':req.body.projectid,
                      },
                      '$set': {
                          'role': req.body.role,
                      },
                  },
                  {upsert:true},
              ).then((user:any)=>{
                if (user) {
                  res.status(200).json({status:true,msg:'Added to team'});
                }else{
                  res.status(200).json({status:false,msg:'Failed to add user to team'});
                }
              }).catch((error: any)=>{
                winstonobj.logWihWinston({status:false,msg:`Failed add user ot project ${req.body.projectid}`,error:JSON.stringify(error)},"projectmanagementservice")
                res.status(500).json({status:false,msg:"Something went wrong, please try again later"});
              })
            }catch(error){
              winstonobj.logWihWinston({status:false,msg:`Failed find project to edit ${req.body.projectid}`,error:JSON.stringify(error)},"projectmanagementservice")
              res.status(500).json({status:false,msg:"Something went wrong, please try again later"});
            }
          }else{
            res.status(200).json({status:false,msg:'User does not exist'});
          }
      }).catch ((error:Error) => {
        winstonobj.logWihWinston({status:false,message:"Failed to add team member",error:JSON.stringify(error)},"projectmanagementservice");
        res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
      });
  }

  getProjectTeam = (req:Request,res:Response) => {
    if(!ObjectId.isValid(req.body.projectid)){
      res.status(400).json({status:false,msg:"Invalid project ID"});
    }else{
      const connection = getDatabaseConnection(req.body.requester.store);
      const projcetTeamsModel = connection.models['projectteams'] || connection.model("projectteams", mongooseschemas.projectteamsschema);

      // create filters array
      const filters: any = { isDeleted:false,projectid:ObjectId(req.body.projectid)};
      if(req.body.where){
        req.body.where.names ? filters.names = req.body.where.names : '';
        req.body.where.role ? filters.role = req.body.where.role : '';
        if (req.body.where.date) {
            const from = moment(req.body.where.date.from, 'DD-MM-YYYY');
            const to = moment(req.body.where.date.to, 'DD-MM-YYYY');
            (req.body.where.date.to == req.body.where.date.from) ? filters.createdAt = from : '';
            (req.body.where.date.to != req.body.where.date.from) ? filters.createdAt = {
                        $gte: new Date(from),
                        $lte: new Date(to)
                    }
              : '';
          }
      }

      //set pagination options
      const options = {page: req.body.page?req.body.page:1,limit: 10,collation: {locale: 'en'},sort:{createdAt:-1},
      select: {_id:1,names:1,role:1,createdAt:1}};

      projcetTeamsModel.paginate(filters, options, (err:any, result:any) => {
          if(err){
                winstonobj.logWihWinston({status:false,msg:"Failed to get all projects",error:JSON.stringify(err)},"projectmanagementservice")
              res.status(500).json({status:false,msg:"Something went wrong,please try again later"});
          }else{
              res.status(200).json({status:true,msg:"project fetched",data:result});
          }
      });
      }
  }

  removeUserFromProjectTeam = (req:Request,res:Response) => {
    const connection = getDatabaseConnection(req.body.requester.store);
    const projcetTeamsModel = connection.models['projectteams'] || connection.model("projectteams", mongooseschemas.projectteamsschema);

    projcetTeamsModel.updateOne({_id:ObjectId(req.body.userid),projectid:ObjectId(req.body.projectid),isDeleted:false},{$set:{isDeleted:true}}, (err:any, result:any) => {
        if(err){
            winstonobj.logWihWinston({status:false,msg:"Failed to delete user from team",error:JSON.stringify(err)},"projectmanagementservice")
            res.status(500).json({status:false,msg:"Something went wrong,please try again later"});
        }else{
            res.status(200).json({status:true,msg:"User removed"});
        }
    });
  }

  getQuestionareTemplates = async (req:Request,res:Response) => {
    const limit = req.body.where ? undefined : req.body.limit ? req.body.limit: 10;
    const offset = req.body.where ? undefined : 0 + ((req.body.page ? req.body.page : 1) - 1) * limit;
    const where = req.body.where ? {...req.body.where,isDeleted:false} : {isDeleted:false};
    await questionaireModel.findAndCountAll({
        where: where,
        order: [["createdAt", "DESC"]],
        attributes: [
          "id",
          "title",
          "description",
          "ismandatory",
          "formschema",
          "isDeleted",
          "isActive",
          "createdAt",
        ],
        include:[
          {
            model:questionaireModel,
            foreignKey: "parentid",
            as: "clonnedFrom",
            attributes: [
              "id",
              "title",
              "description"
            ]
          },
          {
            model:sectorModel,
            foreignKey: "sectorid",
            as: "sector",
            attributes: [
              "id",
              "title",
            ]
          },
          {
            model:sectorModulesModel,
            foreignKey: "moduleid",
            as: "module",
            attributes: [
              "id",
              "modulename",
            ]
          },
        ],
        offset: offset,
        limit: limit,
      })
      .then((data: any) => {
        res.status(200).json({status: true,data});
      })
      .catch((error: Error) => {
        console.log(error)
        winstonobj.logWihWinston({status: false,message: "Failed to get aggregated questionaire templates",error: JSON.stringify(error)},"projectmanagementservice");
        res.status(500).json({status: false,msg: "Something went wrong, please try again later",});
      });
  }

  saveModuleQuesitoinaire = async (req:Request,res:Response) => {
    const connection = getDatabaseConnection(req.body.requester.store);
    const QuestionaireModel = connection.models['questionaires'] || connection.model("questionaires", mongooseschemas.questionairesschema);
    const newQuestionaire = new QuestionaireModel({
      title: req.body.title,
      description: req.body.description,
      formjson:req.body.formjson,
      addedBy:  {userid:req.body.requester.userid,name:req.body.requester.names},
      postgresparentid:req.body.postgresparentid ? req.body.postgresparentid : null,
      mongodbparentid:req.body.mongodbparentid ? req.body.mongodbparentid : "",
    });
    newQuestionaire.save((error:any,saved:any)=>{
      if(error){
        winstonobj.logWihWinston({status:false,msg:"Failed to save questionaire",error:JSON.stringify(error)},"projectmanagementservice")
        res.status(200).json({status:false,msg:"Something went wrong,please try again later"});
      }else{
        if(saved){
            const projectQuestionaireModel = connection.models['projectquestionaires'] || connection.model("projectquestionaires", mongooseschemas.projectquestionairesschema);
            const newProjectQuestionaire = new projectQuestionaireModel({
              projectid: ObjectId(req.body.projectid),
              moduleid: ObjectId(req.body.moduleid),
              questionaireid: ObjectId(saved._id),
              addedBy: {userid:req.body.requester.userid,name:req.body.requester.names}
            })  
            newProjectQuestionaire.save((error:any,savedQuestionaire:any)=>{
              if(error){
                winstonobj.logWihWinston({status:false,msg:"Failed to save project questionaire",error:JSON.stringify(error)},"projectmanagementservice")
                res.status(500).json({status:false,msg:"Something went wrong,please try again later"});
              }else{
                res.status(200).json({status:true,msg:"Saved"});
              }
            });
        }else{
          winstonobj.logWihWinston({status:false,msg:"Failed to save user project questionaire",error:JSON.stringify(error)},"projectmanagementservice")
          res.status(500).json({status:false,msg:"Something went wrong,please try again later"});
        }
      }
    });
  }

  editQuesitoinaire = async (req:Request,res:Response) => {
    if(!ObjectId.isValid(req.body.questionaireid)){
      res.status(400).json({status:false,msg:"Invalid questionaire ID"});
    }else{
      const connection = getDatabaseConnection(req.body.requester.store);
      const QuestionaireModel = connection.models['questionaires'] || connection.model("questionaires", mongooseschemas.questionairesschema);
      QuestionaireModel.findOneAndUpdate({_id:ObjectId(req.body.questionaireid)},{formjson:req.body.formjson},(error:any,questionaire:any) => {
        if(error){
          winstonobj.logWihWinston({status:false,msg:"Failed to edit questionaire",error:JSON.stringify(error)},"projectmanagementservice")
          res.status(500).json({status:false,msg:"Something went wrong,please try again later"});
        }else{
          res.status(200).json({status:true,msg:"New version saved"});
        }
      });
    } 
  }

  getAllQuestionaires = async (req:Request,res:Response) => {
    const connection = getDatabaseConnection(req.body.requester.store);
    const QuestionaireModel = connection.models['questionaires'] || connection.model("questionaires", mongooseschemas.questionairesschema);

      // create filters array
      const filters: any = { isDeleted:false};
      if(req.body.where){
        req.body.where.title ? filters.title = req.body.where.title : '';
        req.body.where.description ? filters.description = req.body.where.description : '';
        if (req.body.where.date) {
            const from = moment(req.body.where.date.from, 'DD-MM-YYYY');
            const to = moment(req.body.where.date.to, 'DD-MM-YYYY');
            (req.body.where.date.to == req.body.where.date.from) ? filters.createdAt = from : '';
            (req.body.where.date.to != req.body.where.date.from) ? filters.createdAt = {
                        $gte: new Date(from),
                        $lte: new Date(to)
                    }
              : '';
          }
      }

      //set pagination options
      const options = {page: req.body.page?req.body.page:1,limit: 10,collation: {locale: 'en'},sort:{createdAt:-1},
      select: {_id:1,title:1,description:1,postgresparentid:1,mongodbparentid:1,formjson:1,addedBy:1,createdAt:1,isActive:1}};

      QuestionaireModel.paginate(filters, options, (err:any, result:any) => {
          if(err){
                winstonobj.logWihWinston({status:false,msg:"Failed to get all projects",error:JSON.stringify(err)},"projectmanagementservice")
              res.status(500).json({status:false,msg:"Something went wrong,please try again later"});
          }else{
              res.status(200).json({status:true,msg:"project fetched",data:result});
          }
      });
  }

  deleteQuestionaire = (req:Request,res:Response) => {
    if(!ObjectId.isValid(req.body.questionaireid)){
      res.status(400).json({status:false,msg:"Invalid questionaire ID"});
    }else{
      const connection = getDatabaseConnection(req.body.requester.store);
      const QuestionaireModel = connection.models['questionaires'] || connection.model("questionaires", mongooseschemas.questionairesschema);

      QuestionaireModel.updateOne({_id:ObjectId(req.body.questionaireid)},{$set:{isDeleted:true}}, (err:any, result:any) => {
          if(err){
              winstonobj.logWihWinston({status:false,msg:"Failed to delete questionaire",error:JSON.stringify(err)},"projectmanagementservice")
              res.status(500).json({status:false,msg:"Something went wrong,please try again later"});
          }else{
              res.status(200).json({status:true,msg:"Questionaire deleted"});
          }
      });
    }
  }

  getQuesitoinaireLatestVersion = (req:Request,res:Response) => {
    if(!ObjectId.isValid(req.body.questionaireid)){
      res.status(400).json({status:false,msg:"Invalid questionaire ID"});
    }else{
      const connection = getDatabaseConnection(req.body.requester.store);
      const QuestionaireModel = connection.models['questionaires'] || connection.model("questionaires", mongooseschemas.questionairesschema);

      QuestionaireModel.findOne({_id:ObjectId(req.body.questionaireid)}, (err:any, result:any) => {
        if(err){
            winstonobj.logWihWinston({status:false,msg:"Failed to delete questionaire",error:JSON.stringify(err)},"projectmanagementservice")
            res.status(500).json({status:false,msg:"Something went wrong,please try again later"});
        }else{
            res.status(200).json({status:true,msg:"Questionaire deleted"});
        }
      });
    }
  }

  getProjectProfile =  (req:Request,res:Response) => {
    if(!ObjectId.isValid(req.body.projectid)){
      res.status(400).json({status:false,msg:"Invalid project ID"});
    }else{
      const connection = getDatabaseConnection(req.body.requester.store);
      const projectsModel = connection.models['projects'] || connection.model("projects", mongooseschemas.projectschema);

      projectsModel.aggregate([
        { $match: { _id: ObjectId(req.body.projectid) } },
        {
            $lookup: {
              from: "projectmodules",
              localField: "_id",
              foreignField: "projectid",
              as: "modules"
            }
        },
        {
          $lookup: {
            from: "projectteams",
            localField: "_id",
            foreignField: "projectid",
            as: "team"
          }
        }
      ]).then((projectdetails:any) => {
        res.status(200).json({status:true,msg:"success",data:projectdetails});

      }).catch((error:any)=>{
        winstonobj.logWihWinston({status:false,msg:"Failed to get project profile",error:JSON.stringify(error)},"projectmanagementservice")
        res.status(500).json({status:false,msg:"Something went wrong,please try again later"});
      })
    }
  }

  getAllProjectQuestionaires = async (req:Request,res:Response) => {
    const connection = getDatabaseConnection(req.body.requester.store);
    const projectQuestionaireModel = connection.models['projectquestionaires'] || connection.model("projectquestionaires", mongooseschemas.projectquestionairesschema);
    const options = {page: req.body.page?req.body.page:1,limit:10,collation: {locale: 'en'},sort:{_id:-1}};
    
    const myAggregate = projectQuestionaireModel.aggregate(aggregations.filterQuestionaires([req.body.where]));
    projectQuestionaireModel.aggregatePaginate(myAggregate, options, (error: any, results: any)=> {
        if(error){
          winstonobj.logWihWinston({status:false,msg:"Failed to get project questionaires",error:JSON.stringify(error)},"projectmanagementservice")
          res.status(500).json({status:false,msg:"Something went wrong, Please try again later"});
        }else{
            res.status(200).json({status:true,msg:"List populated",data:results});
        }
    })
  }

  routes(): void {
    this.router.post("/saveNewProject",auth.checkAuth,auth.clientCheck,validator.saveNewProject,this.saveNewProject);
    this.router.post("/fetchAllProjects",auth.checkAuth,auth.clientCheck,this.fetchAllProjects);
    this.router.post("/deleteProject",auth.checkAuth,auth.clientCheck,validator.deleteProject,this.deleteProject);
    this.router.post("/editProject",auth.checkAuth,auth.clientCheck,validator.editProject,this.editProject);
    this.router.post("/addTeamMember",auth.checkAuth,auth.clientCheck,validator.addTeamMember,this.addTeamMember);
    this.router.post("/getProjectTeam",auth.checkAuth,auth.clientCheck,validator.getProjectTeam,this.getProjectTeam);
    this.router.post("/removeUserFromProjectTeam",auth.checkAuth,auth.clientCheck,validator.removeUserFromProjectTeam,this.removeUserFromProjectTeam);
    this.router.post("/getQuestionareTemplates",auth.checkAuth,auth.clientCheck,validator.getQuestionareTemplates,this.getQuestionareTemplates);
    this.router.post("/saveModuleQuestionaire",auth.checkAuth,auth.clientCheck,validator.clientSaveNewTemplate,this.saveModuleQuesitoinaire);
    this.router.post("/deleteQuestionaire",auth.checkAuth,auth.clientCheck,validator.deleteQuestionaire,this.deleteQuestionaire);
    this.router.post("/editQuesitoinaire",auth.checkAuth,auth.clientCheck,validator.editQuesitoinaire,this.editQuesitoinaire);
    this.router.post("/getQuesitoinaireLatestVersion",auth.checkAuth,auth.clientCheck,validator.deleteQuestionaire,this.getQuesitoinaireLatestVersion);
    this.router.post("/getAllQuestionaires",auth.checkAuth,auth.clientCheck,this.getAllQuestionaires);
    this.router.post("/getAllProjectQuestionaires",auth.checkAuth,auth.clientCheck,validator.getAllProjectQuestionaires,this.getAllProjectQuestionaires);
    this.router.post("/getProjectProfile",auth.checkAuth,auth.clientCheck,validator.getProjectProfile,this.getProjectProfile);
  }
}

const projectManagementObj = new projectManagement();
projectManagementObj.routes();
export default projectManagementObj.router;


