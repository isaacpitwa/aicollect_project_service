import express = require("express");
import * as Config from "./config";
const xss = require("xss-clean");
import Routes from "./routes";
import winstonobj from "./helpers/winstonLogger";
import { NextFunction, Request, Response } from "express";
import passport = require("passport");
const db = require("../models/")
require("./config/passport");

class Server {
  app: express.Application;
  port: any;

  constructor() {
    this.app = express();
    this.configureApp();
    this.configureRoutes();
  }

  async configureApp() {
      this.app.set('port', Config.PORT); 
      this.app.disable('x-powered-by');
      this.app.use(function(req, res, next) {  
          res.header("Access-Control-Allow-Origin", "*");
          res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
          res.header("Access-Control-Allow-Credentials", "true");
          next();
        });
      this.app.use(express.json({ limit: '500kb' })); // Body limit is 10
      this.app.use(
        (err: any, req: Request, res: Response, next: NextFunction) => {
          if (err.status === 400) {
            winstonobj.logWihWinston(
              { status: false, message: "Invalid request body", data: req.body },
              "ErrorLogs"
            );
            return res
              .status(err.status)
              .send({ status: false, message: "Invalid JSON body" });
          }
          return next(err); // if it's not a 400, let the default error handling do it.
        }
      );
      this.app.use(express.json());
      this.app.use(express.urlencoded({extended: false}));
      this.app.use(xss());
      this.app.use(passport.initialize());
      this.app.use(passport.session());
  }

  configureRoutes(): void {
    this.app.use("/projectManagementService", Routes.projectManagementService);
    this.app.use("/mainManagementService",Routes.mainQuestionaireManagementService);
  }

  startServer(): void {
    try {
      // db.sequelize.sync().then(()=>{
        this.app.listen(this.app.get("port"), () => {
          winstonobj.logWihWinston(
            { status: true, msg: `Server started on port ${Config.PORT}` },
            "SuccessLogs"
          );
        });
      // });
       
    } catch (error) {
      winstonobj.logWihWinston(
        { status: false, msg: `Server failed to start`, error: error },
        "ErrorLogs"
      );
    }
  }
}

export const serverObj = new Server();
export const app = new Server().app;