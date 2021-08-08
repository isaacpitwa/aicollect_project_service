import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.connect";
import administratorModel from "./administrators.model";
import clientModel from "./clients.model";


interface projectsInstance extends Model {
  projectId: number;
  clientId: number;
  projectTitle: string;
  description: string;
  isdeleted: Boolean;
  addedby: string;
}

const clientProjectsModel = sequelize.define(
  "clientproject",
  {
    projectId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    clientId:{
      type: DataTypes.INTEGER
    },
    projectTitle: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
     isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue:0
    },
    addedBy: {
      type: DataTypes.INTEGER,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "clientprojects",
    timestamps: true,
  }
);

clientProjectsModel.belongsTo(clientModel, { as: "owner", foreignKey: "clientId" });
clientProjectsModel.belongsTo(administratorModel, { as: "submittedby", foreignKey: "addedby" });

clientProjectsModel.removeAttribute('id');
export default clientProjectsModel;
