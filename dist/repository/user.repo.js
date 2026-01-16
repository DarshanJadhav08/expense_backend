"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("../model/user.model"));
class UserRepo {
    create(data, options) {
        return user_model_1.default.create(data, options);
    }
    findbyid(id) {
        return user_model_1.default.findByPk(id);
    }
    update(id, data) {
        return user_model_1.default.update(data, { where: { id } });
    }
    delete(id) {
        return user_model_1.default.destroy({ where: { id } });
    }
    getAllUsers() {
        return user_model_1.default.findAll({
            attributes: ["id", "First_Name", "Last_Name"],
        });
    }
    findByName(first, last) {
        return user_model_1.default.findOne({
            where: { First_Name: first, Last_Name: last },
        });
    }
    async getQuickStats() {
        const totalUsers = await user_model_1.default.count();
        const totals = await user_model_1.default.findOne({
            attributes: [
                [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("Total_Amount")), "total_balance"],
                [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("Spent_Amount")), "total_spent"],
            ],
            raw: true,
        });
        return {
            totalUsers,
            totalBalance: Number(totals?.total_balance || 0),
            totalSpent: Number(totals?.total_spent || 0),
        };
    }
}
exports.default = new UserRepo();
