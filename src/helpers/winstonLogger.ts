import path = require('path');
import {enviroment} from "../config";
import { createLogger, format, transports } from 'winston';

class winstonLogger{

    constructor(){
    }

    logWihWinston(tolog:any,dir:string){
      
       const basedir=path.join(`/logs/`,dir,`${new Date().toLocaleDateString()}.log`);
        const transport =
          enviroment=='development' ?
          [
            new transports.Console(),
            new transports.File({ filename: basedir })
          ] :
          [
            new transports.File({ filename: basedir })
          ];
        
        const logger=createLogger({
            level:'info',
            format: format.combine(
                format.timestamp({
                  format: 'YYYY-MM-DD HH:mm:ss'
                }),
                format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
                format.json()
            ),
            transports: transport});
         logger.info(tolog);
    }

}
const winstonobj = new winstonLogger();
export  default winstonobj;