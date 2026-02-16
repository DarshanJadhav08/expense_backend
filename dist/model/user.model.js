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
    first_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    total_amount: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    expense_amount: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    remaining_amount: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "N/A",
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: config_1.default,
    tableName: "expense",
    timestamps: false,
});
exports.default = UserExpense;
