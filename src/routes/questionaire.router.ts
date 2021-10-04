import { request, Request, Response, Router } from "express";
import winstonobj from "../helpers/winstonLogger";
import validator from "../helpers/validators.helpers";
import minorObj from "../helpers/minor";
import auth from "../helpers/authhelper";
import sectorModel from "../models/sector.model";
import administratorModel from "../models/administrators.model";
import sectorModulesModel from "../models/sectormodules.model";
import questionaireModel from "../models/questionaires.model";

class questionaireManagement {
  router: Router;

  constructor() {
    this.router = Router();
  }

  saveSector = async (req: Request, res: Response) => {
    try {
      const sector = await sectorModel.create({
        title: req.body.title,
        description:req.body.description,
        type:req.body.type,
        addedBy:req.body.requester.userid});
 
      if (sector instanceof sectorModel) {
        res.status(200).json({status: true,message: "Sector Added"});
      }else{
        res.status(500).json({status: false,message: "Failed to save sector"});
      }
    } catch (error) {
      winstonobj.logWihWinston({status:false,message:"Failed to save sector",error:JSON.stringify(error)},"projectmanagementservice");
      res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
    }
  };

  editSector = async (req: Request, res: Response) => {
    sectorModel
    .findOne({ where: { id: parseInt(req.body.sectorid)} })
    .then((sector: any) => {
        if (sector) {
            sector.update({title:req.body.title,description:req.body.description}).then((updatedrecord: Object) => {
              res.status(200).json({status: true,msg: "Sector edited"});
            })
            .catch((error: Error) => {
              winstonobj.logWihWinston({status: false,message: "Failed to edit sector",error: JSON.stringify(error)},"projectmanagementservice");
              res.status(500).json({status: false,mesage: "Something went wrong, please try again later",});
            });
        }else{
          res.status(200).json({status:false,msg:'Sector does not exist'});
        }
    }).catch ((error:Error) => {
      winstonobj.logWihWinston({status:false,message:"Failed to edit sector",error:JSON.stringify(error)},"projectmanagementservice");
      res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
    });
};

  disableSector = async (req: Request, res: Response) => {
      sectorModel
      .findOne({ where: { id: parseInt(req.body.sectorid)} })
      .then((sector: any) => {
          if (sector) {
              sector.update({isActive:false}).then((updatedrecord: Object) => {
                res.status(200).json({status: true,msg: "Sector Deactivated"});
              })
              .catch((error: Error) => {
                winstonobj.logWihWinston({status: false,message: "Failed to deactivate sector",error: JSON.stringify(error)},"projectmanagementservice");
                res.status(500).json({status: false,mesage: "Something went wrong, please try again later",});
              });
          }else{
            res.status(200).json({status:false,msg:'Sector does not exist'});
          }
      }).catch ((error:Error) => {
        winstonobj.logWihWinston({status:false,message:"Failed to deactivate sector",error:JSON.stringify(error)},"projectmanagementservice");
        res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
      });
  };

  enableSector = async (req: Request, res: Response) => {
    sectorModel
    .findOne({ where: { id: parseInt(req.body.sectorid)} })
    .then((sector: any) => {
        if (sector) {
            sector.update({isActive:true}).then((updatedrecord: Object) => {
              res.status(200).json({status: true,msg: "Sector Enabled"});
            })
            .catch((error: Error) => {
              winstonobj.logWihWinston({status: false,message: "Failed to enable sector",error: JSON.stringify(error)},"projectmanagementservice");
              res.status(500).json({status: false,mesage: "Something went wrong, please try again later",});
            });
        }else{
          res.status(200).json({status:false,msg:'Sector does not exist'});
        }
    }).catch ((error:Error) => {
      winstonobj.logWihWinston({status:false,message:"Failed to enable sector",error:JSON.stringify(error)},"projectmanagementservice");
      res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
    });
  };

  deleteSector = async (req: Request, res: Response) => {
      sectorModel
      .findOne({ where: { id: parseInt(req.body.sectorid)},isDeleted:false})
      .then((sector: any) => {
          if (sector) {
              sector.update({isDeleted:true}).then((updatedrecord: Object) => {
                res.status(200).json({status: true,msg: "Sector Deleted"});
              })
              .catch((error: Error) => {
                winstonobj.logWihWinston({status: false,message: "Failed to delete sector",error: JSON.stringify(error)},"projectmanagementservice");
                res.status(500).json({status: false,mesage: "Something went wrong, please try again later",});
              });
          }else{
            res.status(200).json({status:false,msg:'Sector does not exist'});
          }
        }).catch ((error:Error) => {
          winstonobj.logWihWinston({status:false,message:"Failed to delete secotr",error:JSON.stringify(error)},"projectmanagementservice");
          res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
        });
  };

  adminGetAllSectors = async (req: Request, res: Response) => {
    const limit = req.body.where ? undefined : req.body.limit ? req.body.limit: 10;
    const offset = req.body.where ? undefined : 0 + ((req.body.page ? req.body.page : 1) - 1) * limit;
    const where = req.body.where ? {...req.body.where,isDeleted:false} : {isDeleted:false};
    try { 
       sectorModel.findAndCountAll({
        where:where,
        attributes:[
          "id",
          "title",
          "description",
          "isActive",
          "createdAt"
        ],
        order: [["createdAt", "DESC"]],
        include:[
          {
            model:administratorModel,
            foreignKey: "addedBy",
            as: "submittedby",
            attributes: [
              "id",
              "firstname",
              "lastname"
            ]
          }
        ],
        offset: offset,
        limit: limit,
        // raw:true
      }).then((roles:any) => {
        res.status(200).json({status:true,data:roles});
      }).catch((error:Error) => {
          winstonobj.logWihWinston({status:false,message:"Failed to get system sectors",error:JSON.stringify(error)},"projectmanagementservice");
          res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
      });
    } catch (error) {
      winstonobj.logWihWinston({status:false,message:"Failed to save sector",error:JSON.stringify(error)},"projectmanagementservice");
      res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
    }
  };

  clientGetAllSectors = async (req: Request, res: Response) => {
    try { 
       sectorModel.findAll({
        where:{isDeleted:false,isActive:true},
        attributes:[
          "id",
          "title",
          "description"
        ],
        raw:true
      }).then((roles:any) => {
        res.status(200).json({status:true,data:roles});
      }).catch((error:Error) => {
          winstonobj.logWihWinston({status:false,message:"Failed to get system sectors",error:JSON.stringify(error)},"projectmanagementservice");
          res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
      });
    } catch (error) {
      winstonobj.logWihWinston({status:false,message:"Failed to get system sectors",error:JSON.stringify(error)},"projectmanagementservice");
      res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
    }
  }; 

  addSectorModules =  async (req: Request, res: Response) => {
    try {
      const sectorModule = await sectorModulesModel.create(
        {
          modulename: req.body.modulename,
          moduledescription: req.body.moduledescription,
          sectorid:req.body.sectorid,
          type:req.body.type,
          ismandatory:req.body.ismandatory || false,
          addedBy:req.body.requester.userid
        });

      if (sectorModule instanceof sectorModulesModel) {
        res.status(200).json({status: true,message: "sector Module Added"});
      }else{
        res.status(500).json({status: false,message: "Failed to save sector Module"});
      }

      
    }catch(error){
      console.log(error)
      winstonobj.logWihWinston({status:false,message:"Failed to add sector Module",error:JSON.stringify(error)},"projectmanagementservice");
      res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
    }
  }

  editSectorModules =  async (req: Request, res: Response) => {
      sectorModulesModel
      .findOne({ where: { id: parseInt(req.body.moduleid) } })
      .then((module: any) => {
        if (module) {
            module.update({
              modulename: req.body.modulename,
              moduledescription: req.body.moduledescription,
              sectorid:req.body.sectorid,
              ismandatory:req.body.ismandatory,
              parent:req.body.parent ? req.body.parent : null,
            }).then((updatedrecord: Object) => {
              res.status(200).json({status: true,msg: "Module Edited"});
            })
            .catch((error: any) => {
              winstonobj.logWihWinston({status: false,message: "Failed to edit module",error: JSON.stringify(error)},"projectmanagementservice");
              res.status(500).json({status: false,msg:minorObj.formulateDBValidationErrors(error.errors)||"Something went wrong, please try again later"});
            });
          }else{
            res.status(200).json({status:false,msg:'User does not exist'});
          }
        }).catch ((error:any) => {
          winstonobj.logWihWinston({status:false,message:"Failed to edit user profile",error:JSON.stringify(error)},"projectmanagementservice");
          res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
        });
  };

  disableSectorModules =  async (req: Request, res: Response) => {
    sectorModulesModel
    .findOne({ where: { id: parseInt(req.body.moduleid) } })
    .then((module: any) => {
      if (module) {
          module.update({
            isActive: false,
          }).then((updatedrecord: Object) => {
            res.status(200).json({status: true,msg: "Module diasabled"});
          })
          .catch((error: any) => {
            winstonobj.logWihWinston({status: false,message: "Failed to disable module",error: JSON.stringify(error)},"projectmanagementservice");
            res.status(500).json({status: false,msg:minorObj.formulateDBValidationErrors(error.errors)||"Something went wrong, please try again later"});
          });
        }else{
          res.status(200).json({status:false,msg:'Module does not exist'});
        }
      }).catch ((error:any) => {
        winstonobj.logWihWinston({status:false,message:"Failed to disable module",error:JSON.stringify(error)},"projectmanagementservice");
        res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
      });
  };

  enableSectorModules =  async (req: Request, res: Response) => {
    sectorModulesModel
    .findOne({ where: { id: parseInt(req.body.moduleid) } })
    .then((module: any) => {
      if (module) {
          module.update({
            isActive: true,
          }).then((updatedrecord: Object) => {
            res.status(200).json({status: true,msg: "Module enabled"});
          })
          .catch((error: any) => {
            winstonobj.logWihWinston({status: false,message: "Failed to enable module",error: JSON.stringify(error)},"projectmanagementservice");
            res.status(500).json({status: false,msg:minorObj.formulateDBValidationErrors(error.errors)||"Something went wrong, please try again later"});
          });
        }else{
          res.status(200).json({status:false,msg:'Module does not exist'});
        }
      }).catch ((error:any) => {
        winstonobj.logWihWinston({status:false,message:"Failed to enable module",error:JSON.stringify(error)},"projectmanagementservice");
        res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
      });
  };

  deleteSectorModules =  async (req: Request, res: Response) => {
    sectorModulesModel
    .findOne({ where: { id: parseInt(req.body.moduleid) ,isDeleted:false} })
    .then((module: any) => {
      if (module) {
          module.update({
            isDeleted: true,
          }).then((updatedrecord: Object) => {
            res.status(200).json({status: true,msg: "Module Deleted"});
          })
          .catch((error: any) => {
            winstonobj.logWihWinston({status: false,message: "Failed to delete module",error: JSON.stringify(error)},"projectmanagementservice");
            res.status(500).json({status: false,msg:minorObj.formulateDBValidationErrors(error.errors)||"Something went wrong, please try again later"});
          });
        }else{
          res.status(200).json({status:false,msg:'Module does not exist'});
        }
      }).catch ((error:any) => {
        winstonobj.logWihWinston({status:false,message:"Failed to delete module",error:JSON.stringify(error)},"projectmanagementservice");
        res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
      });
  };

  fetchAllModules = async (req: Request, res: Response) => {
    const limit = req.body.where ? undefined : req.body.limit ? req.body.limit: 10;
    const offset = req.body.where ? undefined : 0 + ((req.body.page ? req.body.page : 1) - 1) * limit;
    const where = req.body.where ? {...req.body.where,isDeleted:false} : {isDeleted:false};

    await sectorModulesModel.findAndCountAll({
        where: where,
        order: [["createdAt", "DESC"]],
        attributes: [
          "id",
          "modulename",
          "moduledescription",
          "type",
          "ismandatory",
          "createdAt",
        ],
        include:[
          {
            model:administratorModel,
            foreignKey: "addedBy",
            as: "submittedby",
            attributes: [
              "id",
              "firstname",
              "lastname"
            ]
          },
          {
            model:sectorModel,
            foreignKey: "sectorid",
            as:"sectormodule",
            attributes:[
              "id",
              "title"
            ]
          }
        ],
        offset: offset,
        limit: limit,
      })
      .then((data: any) => {
        res.status(200).json({status: true,data});
      })
      .catch((error: Error) => {
        console.log(error)
        winstonobj.logWihWinston({status: false,message: "Failed to get aggregated modules",error: JSON.stringify(error)},"projectmanagementservice");
        res.status(500).json({status: false,msg: "Something went wrong, please try again later",});
      });
  };

  getAllModules = async (req: Request, res: Response) => {
    const limit = req.body.where ? undefined : req.body.limit ? req.body.limit: 10;
    const offset = req.body.where ? undefined : 0 + ((req.body.page ? req.body.page : 1) - 1) * limit;
    const where = req.body.where ? {...req.body.where,isDeleted:false} : {isDeleted:false};

    await sectorModulesModel.findAll({
        where: where,
        order: [["createdAt", "DESC"]],
        attributes: [
          "id",
          "modulename",
          "moduledescription",
        ],
      })
      .then((data: any) => {
        res.status(200).json({status: true,data});
      })
      .catch((error: Error) => {
        console.log(error)
        winstonobj.logWihWinston({status: false,message: "Failed to get aggregated modules",error: JSON.stringify(error)},"projectmanagementservice");
        res.status(500).json({status: false,msg: "Something went wrong, please try again later",});
      });
  };

  fetchAllTemplates = async (req: Request, res: Response) => {
    const where = req.body.where ? {...req.body.where,isDeleted:false} : {isDeleted:false};
    await questionaireModel.findAll({
        where: where,
        order: [["createdAt", "DESC"]],
        attributes: [
          "id",
          "title",
          "description",
          "tag",
          "formschema",
        ]
      })
      .then((data: any) => {
        res.status(200).json({status: true,data});
      })
      .catch((error: Error) => {
        winstonobj.logWihWinston({status: false,message: "Failed to get aggregated modules",error: JSON.stringify(error)},"projectmanagementservice");
        res.status(500).json({status: false,msg: "Something went wrong, please try again later",});
      });
  };

  saveNewTemplate = async (req: Request, res: Response) => {
    try {
        const questionaire = await questionaireModel.create({
          title: req.body.title,
          description:req.body.description,
          ismandatory:req.body.ismandatory || false,
          sectorid:req.body.sectorid,
          moduleid:req.body.moduleid,
          parentid:req.body.parentid,
          tag:req.body.tag,
          formschema:req.body.formschema,
          addedBy:req.body.requester.userid
        });
   
        if (questionaire instanceof questionaireModel) {
          res.status(200).json({status: true,message: "Section Added"});
        }else{
          res.status(500).json({status: false,message: "Failed to save questionaire"});
        }
    } catch (error) {
      console.log(error)
      winstonobj.logWihWinston({status:false,message:"Failed to save questionaire",error:JSON.stringify(error)},"projectmanagementservice");
      res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
    }
  };

  editQuesitoinaire = async (req: Request, res: Response) => {
    try {
         
      questionaireModel
      .findOne({ where: { id: parseInt(req.body.questionaireid)} })
      .then((template: any) => {
          if (template) {
            template.update({title:req.body.title,description:req.body.description,ismandatory:req.body.ismandatory,formschema:req.body.formschema,tag:req.body.tag}).then((updatedrecord: Object) => {
                res.status(200).json({status: true,msg: "template edited"});
              })
              .catch((error: Error) => {
                winstonobj.logWihWinston({status: false,message: "Failed to edit template",error: JSON.stringify(error)},"projectmanagementservice");
                res.status(500).json({status: false,mesage: "Something went wrong, please try again later",});
              });
          }else{
            res.status(200).json({status:false,msg:'Template does not exist'});
          }
      }).catch ((error:Error) => {
        winstonobj.logWihWinston({status:false,message:"Failed to edit sector",error:JSON.stringify(error)},"projectmanagementservice");
        res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
      });

    } catch (error) {
      console.log(error)
      winstonobj.logWihWinston({status:false,message:"Failed to save questionaire",error:JSON.stringify(error)},"projectmanagementservice");
      res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
    }
  };
  
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
          "tag",
          "formschema",
          "isDeleted",
          "isActive",
          "createdAt",
        ],
        include:[
          {
            model:administratorModel,
            foreignKey: "addedBy",
            as: "submittedby",
            attributes: [
              "id",
              "firstname",
              "lastname"
            ]
          }, 
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
            as: "sectormodule",
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

  getAQuestionareTemplate = async (req:Request,res:Response) => {
    const where = req.body.where ? {...req.body.where,isDeleted:false} : {isDeleted:false};
    await questionaireModel.findOne({
        where: where,
        order: [["createdAt", "DESC"]],
        attributes: [
          "id",
          "title",
          "description",
          "tag",
          "ismandatory",
          "formschema",
          "isDeleted",
          "isActive",
          "createdAt",
        ],
      })
      .then((data: any) => {
        res.status(200).json({status: true,data});
      })
      .catch((error: Error) => {
        winstonobj.logWihWinston({status: false,message: "Failed to get questionaire template",error: JSON.stringify(error)},"projectmanagementservice");
        res.status(500).json({status: false,msg: "Something went wrong, please try again later",});
      });
  }

  deleteQuestionaireTemplate = async (req:Request,res:Response) => {
    questionaireModel
    .findOne({ where: { id: parseInt(req.body.questionaireid) ,isDeleted:false} })
    .then((questionaire: any) => {
      if (questionaire) {
        questionaire.update({
            isDeleted: true,
          }).then((updatedrecord: Object) => {
            res.status(200).json({status: true,msg: "Questionaire Deleted"});
          })
          .catch((error: any) => {
            winstonobj.logWihWinston({status: false,message: "Failed to delete questionaire",error: JSON.stringify(error)},"projectmanagementservice");
            res.status(500).json({status: false,msg:minorObj.formulateDBValidationErrors(error.errors)||"Something went wrong, please try again later"});
          });
        }else{
          res.status(200).json({status:false,msg:'Questionaire does not exist'});
        }
      }).catch ((error:any) => {
        winstonobj.logWihWinston({status:false,message:"Failed to delete Questionaire",error:JSON.stringify(error)},"projectmanagementservice");
        res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
      });
  };

  disablQuestionaireTemplate = async (req:Request,res:Response) => {
    questionaireModel
    .findOne({ where: { id: parseInt(req.body.questionaireid) ,isDeleted:false} })
    .then((questionaire: any) => {
      if (questionaire) {
        questionaire.update({
            isActive: false,
          }).then((updatedrecord: Object) => {
            res.status(200).json({status: true,msg: "Questionaire Disabled"});
          })
          .catch((error: any) => {
            winstonobj.logWihWinston({status: false,message: "Failed to disable questionaire",error: JSON.stringify(error)},"projectmanagementservice");
            res.status(500).json({status: false,msg:minorObj.formulateDBValidationErrors(error.errors)||"Something went wrong, please try again later"});
          });
        }else{
          res.status(200).json({status:false,msg:'Questionaire does not exist'});
        }
      }).catch ((error:any) => {
        winstonobj.logWihWinston({status:false,message:"Failed to disable Questionaire",error:JSON.stringify(error)},"projectmanagementservice");
        res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
      });
  };

  activeQuestionaireTemplate = async (req:Request,res:Response) => {
    questionaireModel
    .findOne({ where: { id: parseInt(req.body.questionaireid) ,isDeleted:false} })
    .then((questionaire: any) => {
      if (questionaire) {
        questionaire.update({
            isActive: true,
          }).then((updatedrecord: Object) => {
            res.status(200).json({status: true,msg: "Questionaire re enabled"});
          })
          .catch((error: any) => {
            winstonobj.logWihWinston({status: false,message: "Failed to renable questionaire",error: JSON.stringify(error)},"projectmanagementservice");
            res.status(500).json({status: false,msg:minorObj.formulateDBValidationErrors(error.errors)||"Something went wrong, please try again later"});
          });
        }else{
          res.status(200).json({status:false,msg:'Questionaire does not exist'});
        }
      }).catch ((error:any) => {
        winstonobj.logWihWinston({status:false,message:"Failed to reanbale Questionaire",error:JSON.stringify(error)},"projectmanagementservice");
        res.status(500).json({status:false,msg:'Something went wrong,please try again later'});
      });
  };

  routes(): void {
    this.router.post("/saveSector",auth.checkAuth,auth.nocClientCheck,validator.saveSector,this.saveSector);
    this.router.post("/editSector",auth.checkAuth,auth.nocClientCheck,validator.editSector,this.editSector);
    this.router.post("/disableSector",auth.checkAuth,auth.nocClientCheck,validator.disableSector,this.disableSector);
    this.router.post("/deleteSector",auth.checkAuth,auth.nocClientCheck,validator.disableSector,this.deleteSector);
    this.router.post("/enableSector",auth.checkAuth,auth.nocClientCheck,validator.disableSector,this.enableSector);
    this.router.post("/getAllSectors",auth.checkAuth,auth.nocClientCheck,this.adminGetAllSectors);
    this.router.post("/clientGetAllSectors",auth.checkAuth,this.clientGetAllSectors);//removed resitrictions
    this.router.post("/addSectorModules",auth.checkAuth,auth.nocClientCheck,validator.addSectorModules,this.addSectorModules);
    this.router.post("/editSectorModules",auth.checkAuth,auth.nocClientCheck,validator.editSectorModules,this.editSectorModules);
    this.router.post("/disableSectorModules",auth.checkAuth,auth.nocClientCheck,validator.disableSectorModules,this.disableSectorModules);
    this.router.post("/enableSectorModules",auth.checkAuth,auth.nocClientCheck,validator.disableSectorModules,this.enableSectorModules);
    this.router.post("/deleteSectorModules",auth.checkAuth,auth.nocClientCheck,validator.disableSectorModules,this.deleteSectorModules);
    this.router.post("/fetchAllModules",auth.checkAuth,auth.nocClientCheck,this.fetchAllModules);
    this.router.post("/getAllModules",auth.checkAuth,auth.nocClientCheck,this.getAllModules);
    this.router.post("/fetchAllTemplates",auth.checkAuth,this.fetchAllTemplates);
    this.router.post("/saveNewTemplate",auth.checkAuth,auth.nocClientCheck,validator.saveNewTemplate,this.saveNewTemplate);
    this.router.post("/editQuesitoinaire",auth.checkAuth,auth.nocClientCheck,validator.editQuesitoinaire,this.editQuesitoinaire);
    this.router.post("/getQuestionareTemplates",auth.checkAuth,auth.nocClientCheck,validator.getQuestionareTemplates,this.getQuestionareTemplates);
    this.router.post("/getAQuestionareTemplate",auth.checkAuth,auth.nocClientCheck,validator.getAQuestionareTemplate,this.getAQuestionareTemplate);
    this.router.post("/deleteQuestionaireTemplate",auth.checkAuth,auth.nocClientCheck,validator.deleteQuestionaireTemplate,this.deleteQuestionaireTemplate);
    this.router.post("/disablQuestionaireTemplate",auth.checkAuth,auth.nocClientCheck,validator.deleteQuestionaireTemplate,this.disablQuestionaireTemplate);
    this.router.post("/activeQuestionaireTemplate",auth.checkAuth,auth.nocClientCheck,validator.deleteQuestionaireTemplate,this.activeQuestionaireTemplate);
  }
}

const questionaireManagementObj = new questionaireManagement();
questionaireManagementObj.routes();
export default questionaireManagementObj.router;
// code