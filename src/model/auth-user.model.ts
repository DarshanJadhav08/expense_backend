import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config";

class AuthUser extends Model {
  declare id: number;
  declare first_name: string;
  declare last_name: string;
  declare password: string;
}

AuthUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "auth_users",
    timestamps: true,
  }
);

export default AuthUser;
