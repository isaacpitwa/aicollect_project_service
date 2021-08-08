

import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.connect";

interface administratorRoleInstance extends Model {
  id: number;
  role: string;
  description:string;
}

const  administratorRoleModel = sequelize.define("administratorroles", 
{
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement : true
  },
  title: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
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
    tableName: 'administratorroles',
    timestamps: false
});

export default administratorRoleModel;
