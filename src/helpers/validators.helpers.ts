import { Request, Response, NextFunction } from "express";
let Joi = require("joi");
const dateextension = require("joi-date-extensions");
Joi = Joi.extend(dateextension);
Joi.objectId = require('joi-objectid')(Joi)

class validatorClass {
  constructor() {}


  saveNewProject = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys({
      projectname: Joi.string().trim().required().label("Project Name is required"),
      description:Joi.string().trim().required().label("Project Description is required"),
      title:Joi.string().trim().required().label("Sector title is required"),
      id:Joi.number().required().label("Sector id is required"),
    });

    const result = Joi.validate(
      {
        projectname: req.body.projectname,
        description: req.body.description,
        title :req.body.sector.title,
        id :req.body.sector.id,
      },
      schema
    );
    result
      .then((result: any) => {
        next();
      })
      .catch((err: any) => {
        this.populateErrors.bind(this)(err, res);
      });
  };

  editProject = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys({
      projectname: Joi.string().trim().optional().label("Project Name should be a string"),
      description:Joi.string().trim().optional().label("Project Description should be a string"),
      projectid:Joi.string().trim().required().label("Project ID is requried"),
      sector:Joi.string().trim().required().label("Sector is required")
    });

    const result = Joi.validate(
      {
        projectname: req.body.projectname ? req.body.projectname : undefined,
        description: req.body.description ? req.body.description: undefined,
        projectid: req.body.projectid,
        sector: req.body.sector
      },
      schema
    );
    result
      .then((result: any) => {
        next();
      })
      .catch((err: any) => {
        this.populateErrors.bind(this)(err, res);
      });
  };

  deleteProject = (req:Request,res:Response,next:NextFunction) => {
    const schema = Joi.object().keys({
      projectid: Joi.string().trim().required().label("Project ID is required"),
    });

    const result = Joi.validate(
      {
        projectid: req.body.projectid
      },
      schema
    );
    result
    .then((result: any) => {
      next();
    })
    .catch((err: any) => {
      this.populateErrors.bind(this)(err, res);
    });
  }

  addTeamMember = (req:Request,res:Response,next:NextFunction) => {
    const schema = Joi.object().keys({
      userid: Joi.number().required().label("User id is required"),
      role: Joi.string().required().valid("inspector","manager").label("User role should be inspector or manager"),
      projectid : Joi.string().required().label("Project ID is required")
    });

    const result = Joi.validate(
      {
        userid: req.body.userid,
        role:req.body.role,
        projectid:req.body.projectid
      },
      schema
    );
    result
    .then((result: any) => {
      next();
    })
    .catch((err: any) => {
      this.populateErrors.bind(this)(err, res);
    });
  }

  removeUserFromProjectTeam = (req:Request,res:Response,next:NextFunction) => {
    const schema = Joi.object().keys({
      userid: Joi.string().required().label("User id is required"),
      projectid : Joi.string().required().label("Project ID is required")
    });

    const result = Joi.validate(
      {
        userid: req.body.userid,
        projectid:req.body.projectid
      },
      schema
    );
    result
    .then((result: any) => {
      next();
    })
    .catch((err: any) => {
      this.populateErrors.bind(this)(err, res);
    });
  }

  getProjectTeam  = (req:Request,res:Response,next:NextFunction) => {
    const schema = Joi.object().keys({
      projectid : Joi.string().required().label("Project ID is required")
    });

    const result = Joi.validate(
      {
        projectid:req.body.projectid
      },
      schema
    );
    result
    .then((result: any) => {
      next();
    })
    .catch((err: any) => {
      this.populateErrors.bind(this)(err, res);
    });
  }

  saveSector = (req:Request,res:Response,next:NextFunction) => {
    const schema = Joi.object().keys({
      title : Joi.string().required().label("title  is required"),
      description:Joi.string().required().label("Description is required"),
    });

    const result = Joi.validate(
      {
        title:req.body.title,
        description:req.body.description
      },
      schema
    );
    result
    .then((result: any) => {
      next();
    })
    .catch((err: any) => {
      this.populateErrors.bind(this)(err, res);
    });
  }

  editSector = (req:Request,res:Response,next:NextFunction) => {
    const schema = Joi.object().keys({
      sectorid: Joi.number().required().label("sector id is required"),
      title : Joi.string().required().label("title  is required"),
      description:Joi.string().required().label("Description is required"),
    });

    const result = Joi.validate(
      {
        sectorid:req.body.sectorid,
        title:req.body.title,
        description:req.body.description
      },
      schema
    );
    result
    .then((result: any) => {
      next();
    })
    .catch((err: any) => {
      this.populateErrors.bind(this)(err, res);
    });
  }

  disableSector = (req:Request,res:Response,next:NextFunction) => {
    const schema = Joi.object().keys({
      sectorid : Joi.number().required().label("sectorid is required")
    });

    const result = Joi.validate(
      {
        sectorid:req.body.sectorid
      },
      schema
    );
    result
    .then((result: any) => {
      next();
    })
    .catch((err: any) => {
      this.populateErrors.bind(this)(err, res);
    });
  }

  addSectorModules = (req:Request,res:Response,next:NextFunction) => {
    const schema = Joi.object().keys({
      modulename : Joi.string().required().label("Module description is required"),
      moduledescription : Joi.string().required().label("Module description is required"),
      ismandatory : Joi.boolean().label("ismadantory should be true or false"),
      sectorid : Joi.number().required().label("Sector ID is required"),
      type:Joi.string().required().valid("REG","INS","TRN").label("A valid tpe is required [REG,INS,TRN]"),

    });

    const result = Joi.validate(
      {
        modulename:req.body.modulename,
        moduledescription:req.body.moduledescription,
        ismandatory:req.body.ismandatory,
        sectorid:req.body.sectorid,
        type:req.body.type,
      },
      schema
    );
    result
    .then((result: any) => {
      next();
    })
    .catch((err: any) => {
      this.populateErrors.bind(this)(err, res);
    });
  }

  editSectorModules = (req:Request,res:Response,next:NextFunction) => {
    const schema = Joi.object().keys({
      modulename : Joi.string().required().label("Module description is required"),
      moduledescription : Joi.string().required().label("Module description is required"),
      ismandatory : Joi.boolean().label("ismadantory should be true or false"),
      sectorid : Joi.number().required().label("Sector ID is required"),
      moduleid: Joi.number().required().label("Module ID is required"),
    });

    const result = Joi.validate(
      {
        modulename:req.body.modulename,
        moduledescription:req.body.moduledescription,
        ismandatory:req.body.ismandatory,
        sectorid:req.body.sectorid,
        moduleid:req.body.moduleid,
      },
      schema
    );
    result
    .then((result: any) => {
      next();
    })
    .catch((err: any) => {
      this.populateErrors.bind(this)(err, res);
    });
  }

  disableSectorModules = (req:Request,res:Response,next:NextFunction) => {
    const schema = Joi.object().keys({
      moduleid: Joi.number().required().label("Module ID is required")
    });

    const result = Joi.validate(
      {
        moduleid:req.body.moduleid
      },
      schema
    );
    result
    .then((result: any) => {
      next();
    })
    .catch((err: any) => {
      this.populateErrors.bind(this)(err, res);
    });
  }

  saveNewTemplate = (req:Request,res:Response,next:NextFunction) => {
    const schema = Joi.object().keys({
      title: Joi.string().required().label("Questionaire title is required"),
      description: Joi.string().required().label("Questionaire description is required"),
      ismandatory: Joi.boolean().required().label("Is mandatory should be true or false"),
      sectorid: Joi.number().required().label("Sectorid is required"),
      moduleid: Joi.number().optional().label("Module ID should be a number"),
      parentid: Joi.number().optional().label("Parent questionaire ID should be a number"),
      formschema: Joi.array().required().label("Form schema is required")
    });

    const result = Joi.validate(
      {
        title:req.body.title,
        description:req.body.description,
        ismandatory:req.body.ismandatory,
        sectorid:req.body.sectorid,
        moduleid:req.body.moduleid ? req.body.moduleid :undefined, 
        parentid:req.body.parentid ? req.body.parentid :undefined, 
        formschema:req.body.formschema
      },
      schema
    );
    result
    .then((result: any) => {
      next();
    })
    .catch((err: any) => {
      this.populateErrors.bind(this)(err, res);
    });
  }

  clientSaveNewTemplate = (req:Request,res:Response,next:NextFunction) => {
    const schema = Joi.object().keys({
      title: Joi.string().required().label("Questionaire title is required"),
      description: Joi.string().required().label("Questionaire description is required"),
      moduleid: Joi.string().required().label("Module ID should be a number"),
      projectid: Joi.string().required().label("A valid project ID is required"),
      mongodbparentid: Joi.string().optional().label("Parent questionaire mongo ID should be a number"),
      postgresparentid: Joi.number().optional().label("Parent questionaire postgres ID should be a number"),
      formjson: Joi.array().required().label("Form schema is required")
    });

    const result = Joi.validate(
      {
        title:req.body.title,
        description:req.body.description,
        moduleid:req.body.moduleid, 
        projectid:req.body.projectid, 
        postgresparentid:req.body.postgresparentid, 
        mongodbparentid:req.body.mongodbparentid, 
        formjson:req.body.formjson
      },
      schema
    );
    result
    .then((result: any) => {
      next();
    })
    .catch((err: any) => {
      this.populateErrors.bind(this)(err, res);
    });
  }

  getQuestionareTemplates = (req:Request,res:Response,next:NextFunction) => {
    const schema = Joi.object().keys({
      title: Joi.string().optional().label("Questionaire shoould be a string"),
      description: Joi.string().optional().label("Questionaire description is required"),
      ismandatory: Joi.boolean().optional().label("Is mandatory should be true or false"),
      sectorid: Joi.number().optional().label("Sectorid should bea number"),
      moduleid: Joi.number().optional().label("Module ID should be a number"),
      parentid: Joi.number().optional().label("Parent questionaire ID should be a number"),
    });

    const result = Joi.validate(
      {
        title:req.body.where ? req.body.where.title ? req.body.where.title : undefined:undefined ,
        description:req.body.where ?  req.body.where.description ? req.body.where.description:undefined:undefined,
        ismandatory:req.body.where  ? req.body.where.ismandatory ? req.body.where.ismandatory : undefined : undefined,
        sectorid:req.body.where  ? req.body.where.sectorid ? req.body.where.sectorid : undefined : undefined,
        moduleid:req.body.where ? req.body.where.moduleid ? req.body.where.moduleid :undefined : undefined, 
        parentid:req.body.where ? req.body.where.parentid ? req.body.where.parentid:undefined : undefined, 
      },
      schema
    );
    result
    .then((result: any) => {
      next();
    })
    .catch((err: any) => {
      this.populateErrors.bind(this)(err, res);
    });
  }

  getAQuestionareTemplate = (req:Request,res:Response,next:NextFunction) => {
    const schema = Joi.object().keys({
      id: Joi.number().required().label("A valild Questionaire id is required"),
    });

    const result = Joi.validate(
      {
        id:req.body.where ? req.body.where.id ? req.body.where.id : undefined:undefined ,
      },
      schema
    );
    result
    .then((result: any) => {
      next();
    })
    .catch((err: any) => {
      this.populateErrors.bind(this)(err, res);
    });
  }

  deleteQuestionaireTemplate = (req:Request,res:Response,next:NextFunction) => {
    const schema = Joi.object().keys({
      questionaireid: Joi.number().required().label("Questionaire Id is required"),
    });

    const result = Joi.validate(
      {
        questionaireid:req.body.questionaireid,
      },
      schema
    );
    result
    .then((result: any) => {
      next();
    })
    .catch((err: any) => {
      this.populateErrors.bind(this)(err, res);
    });
  }

  deleteQuestionaire = (req:Request,res:Response,next:NextFunction) => {
    const schema = Joi.object().keys({
      questionaireid: Joi.string().required().label("Questionaire Id is required"),
    });

    const result = Joi.validate(
      {
        questionaireid:req.body.questionaireid,
      },
      schema
    );
    result
    .then((result: any) => {
      next();
    })
    .catch((err: any) => {
      this.populateErrors.bind(this)(err, res);
    });
  }

  editQuesitoinaire = (req:Request,res:Response,next:NextFunction) => {
    const schema = Joi.object().keys({
      title: Joi.string().required().label("Questionaire title is required"),
      questionaireid: Joi.number().required().label("Questionaire Id is required"),
      description: Joi.string().required().label("Description is required"),
      ismandatory: Joi.boolean().optional().label("Is mandatory should be true or false"),
      formschema: Joi.array().required().label("Form JSON is required"),
    });
    // corrected
    const result = Joi.validate(
      {
        questionaireid:req.body.questionaireid,
        title:req.body.title,
        description:req.body.description,
        ismandatory:req.body.ismandatory,
        formschema:req.body.formschema,
      },
      schema
    );
    result
    .then((result: any) => {
      next();
    })
    .catch((err: any) => {
      this.populateErrors.bind(this)(err, res);
    });
  }
  
  getProjectProfile = (req:Request,res:Response,next:NextFunction) => {
    const schema = Joi.object().keys({
      projectid: Joi.string().required().label("Project Id is required"),
    });

    const result = Joi.validate(
      {
        projectid:req.body.projectid,
      },
      schema
    );
    result
    .then((result: any) => {
      next();
    })
    .catch((err: any) => {
      this.populateErrors.bind(this)(err, res);
    });
  }

  getAllProjectQuestionaires = (req:Request,res:Response,next:NextFunction) => {
    const schema = Joi.object().keys({
      projectid: Joi.string().required().label("Project Id is required"),
      moduleid: Joi.optional().label("Module Id is required"),
    });

    const result = Joi.validate(
      {
        projectid:req.body.where ? req.body.where.projectid : undefined,
        moduleid:req.body.where ? req.body.where.moduleid ? req.body.where.moduleid : undefined : undefined,
      },
      schema
    );
    result
    .then((result: any) => {
      next();
    })
    .catch((err: any) => {
      this.populateErrors.bind(this)(err, res);
    });
  }


  populateErrors = (err: any, res: Response) => {
    const errors = err.details.map((err: any, index: Number) => {
      return {
        field: err.context.key,
        value: err.context.label,
        requiredDataType: err.type.split(".")[0],
        // requestBodyIndex:index,
      };
    });
    res.status(400).json({
      status: false,
      message: "Service request failed",
      errorLevel: "validation",
      error: errors,
    });
  };
}

const validator = new validatorClass();
export default validator;
