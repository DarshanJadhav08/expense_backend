import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config";

class AuthUser extends Model {}

AuthUser.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    tableName: "auth_users",
    timestamps: true,
  }
);

export default AuthUser;
