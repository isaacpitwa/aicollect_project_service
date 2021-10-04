import { psqldb, psqluser, psqlpass, psqlurl, psqlport } from "./index";
import winstonobj from "../helpers/winstonLogger";
const Sequelize = require("sequelize");
const op = Sequelize.Op;
const operatorsAliases = {
  $between: op.between, //create an alias for Op.between
};

export const sequelize = new Sequelize(psqldb, psqluser, psqlpass, {
  host: psqlurl,
  port: psqlport,
  dialect: "postgres", //describes what library to use
  // logging: (sql: any, queryObject: any) => {
  //   winstonobj.logWihWinston({level:"psql failure",sql, queryObject},'ErrorLogs')
  // },
  operatorsAliases,
});

export const connect = async () => {
  try {
    await sequelize.authenticate();
    winstonobj.logWihWinston(
      {
        status: true,
        message: "Connected to psql database",
      },
      "SuccessLogs"
    )
  } catch (error) {
    winstonobj.logWihWinston(
      {
        status: false,
        message: "Failed to connect to psql database",
        error: error,
      },
      "ErrorLogs"
    );
  }
};
