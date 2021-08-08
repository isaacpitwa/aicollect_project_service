

import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.connect";
import administratorModel from "./administrators.model";

interface userSessionsInstance extends Model {
  id: number;
  userid: string;
  usertoken:string;
}

const  userSessionsModel = sequelize.define("usersessions", 
{
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement : true
  },
  userid: {
    type: DataTypes.INTEGER,
  },
  usertoken: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue:true
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue:sequelize.fn('NOW')
  },
  updatedAt: {
    allowNull: true,
    type: DataTypes.DATE,
    defaultValue:sequelize.fn('NOW')
  }
},{  
    tableName: 'usersessions',
    timestamps: false
});

userSessionsModel.belongsTo(administratorModel, { as: "userdata", foreignKey: "userid" });

export default userSessionsModel;
