import {  NextFunction } from 'express';
import userSessionsModel from '../models/usersessions.model';
const  jwt =  require("jsonwebtoken");
import {SECRETE} from '../config';
import "../config/passport";
// import adminUsers from '../models/admin.model';
import winstonobj from './winstonLogger';
import administratorModel from '../models/administrators.model';
import clientModel from '../models/clients.model';

class AuthClass{
  apiKeys:any;
    constructor(){
    }

  checkAuth(req:any,res:any,next:NextFunction){
    if(req.headers.authorization){
      const token = req.headers.authorization.split(' ')[1];
      const secrete = Buffer.from(SECRETE||'secrete', 'base64');
      jwt.verify(token,secrete,function(err:any,verifiedJwt: any){
          if(err){
            return res.status(401).json({msg:"Unauthorized",error:err});
          }else{
            userSessionsModel.findOne({
              where:{usertoken:verifiedJwt.sessid,isActive:true},
              attributes:['userid'],
              include:[
                {
                  model:administratorModel,
                  foreignKey: "userid",
                  as: "userdata",
                  attributes: [
                    "id",
                    "firstname",
                    "lastname",
                    "userrole",
                    "isActive",
                    "isDeleted",
                    "isVerified"
                  ],
                  include: {
                    model: clientModel,
                    as:"client",
                    required: false,
                    attributes:[
                      "id",
                      "organizationname",
                      "isSubscriptionActive",
                      "store",
                      "isActive",
                      "isDeleted"
                    ]
                  }
                }
              ],
              raw:true
            }).
            then((sessiondata:any) => {
              if(sessiondata){
                if(!sessiondata['userdata.isActive'] || sessiondata['userdata.isDeleted']){
                  res.status(401).json({status:false,msg:"Unauthorized, seek administrative support"});
                }
                else{
                  if(sessiondata['userdata.isVerified']){
                    if(sessiondata['userdata.client.id'] != null){
                      if(sessiondata['userdata.client.isDeleted']||!sessiondata['userdata.client.isActive']||!sessiondata['userdata.client.isSubscriptionActive']){
                        res.status(401).json({status:false,msg:"Unauthorized, seek administrative support"});
                      }else{
                        req.body.requester = {}
                        req.body.requester.userid = sessiondata["userdata.id"]
                        req.body.requester.names = `${sessiondata["userdata.firstname"]} ${sessiondata['userdata.lastname']}`
                        req.body.requester.userrole = sessiondata["userdata.userrole"]
                        req.body.requester.clientid = sessiondata["userdata.client.id"]
                        req.body.requester.store = sessiondata["userdata.client.store"]
                        next();
                      }
                    }
                    else{
                      req.body.requester = {}
                      req.body.requester.userid = sessiondata["userdata.id"]
                      req.body.requester.names = `${sessiondata["userdata.firstname"]} ${sessiondata['userdata.lastname']}`
                      req.body.requester.userrole = sessiondata["userdata.userrole"]
                      next();
                    }
                  }else{
                    res.status(200).json({status:false,msg:"Account not verified"});
                  }
                }
              }else{
                return res.status(401).json({status:false,msg:"Unauthorized"});
              }
            }).catch((error:Error) => {
              winstonobj.logWihWinston({status:false,message:"failed to check auth",error:JSON.stringify(error)},"UserManagementService")
              return res.status(401).json({status:false,msg:"Unauthorized"});
            })
          }
        });
    }else{
      return res.status(401).json({status:false,msg:"Unauthorized"});
    }
  }

  clientCheck (req:any,res:any,next:NextFunction){
    if(req.body.requester.clientid){
      next();
    }else{
      return res.status(400).json({status:false,msg:"Permission denied"});
    }
  }

  nocClientCheck (req:any,res:any,next:NextFunction){
    if(!req.body.requester.clientid){
      next();
    }else{
      return res.status(400).json({status:false,msg:"Permission denied"});
    }
  }


  isExpired(token:string):Boolean{
    const expiry = jwt.decode(token).exp;
    const now = new Date();
    return now.getTime() > expiry * 1000;
  }

}

const auth = new AuthClass();
export default auth;
