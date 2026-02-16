"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../db/config"));
class UserExpense extends sequelize_1.Model {
}
UserExpense.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
    },
    First_Name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Last_Name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Total_Amount: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    Spent_Amount: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    Remaining_Amount: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    Category: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "N/A",
    },
    Description: {
        type: sequelize_1.DataTypes.STRING,
    },
    Date: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Month: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Year: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: config_1.default,
    tableName: "expense",
    timestamps: false,
});
exports.default = UserExpense;
