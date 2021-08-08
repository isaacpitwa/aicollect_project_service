import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.connect";


interface modulesInstance extends Model {
  clientId: number;
  organizationName: string;
  billingPlan: string;
  isSubscriptionExpired: Boolean;
  isactive: Boolean;
  isdeleted: Boolean;
  isverified: Boolean;
  addedby: string;
}

const modulesModel = sequelize.define(
  "module",
  {
    moduleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    moduleName: {
      type: DataTypes.STRING,
    },
     isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue:0
    },
    isActivate: {
      type: DataTypes.BOOLEAN,
      defaultValue:1
    },
     addedBy: {
      type: DataTypes.INTEGER,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "modules",
    timestamps: true,
  }
);

modulesModel.removeAttribute('id');
export default modulesModel;
