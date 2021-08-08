const dotenv = require('dotenv');
const path = require('path');
dotenv.config({path:path.resolve(__dirname)+'/../secrets/.env'});
const Sequelize = require("sequelize");

module.exports = {
  "development": {
    "username": process.env.psqluser,
    "password": process.env.psqlpass,
    "database": process.env.psqldb,
    "host": process.env.psqlurl,
    "dialect": "postgres",
    "operatorsAliases": 1
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": 1

  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": 1
  }
}
