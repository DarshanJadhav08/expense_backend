"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("../model/user.model"));
class UserRepo {
    async create(data) {
        return await user_model_1.default.create(data);
    }
    async findbyid(id) {
        return await user_model_1.default.findByPk(id);
    }
    async update(id, data) {
        return await user_model_1.default.update(data, { where: { id } });
    }
    async delete(id) {
        return await user_model_1.default.destroy({ where: { id } });
    }
    // ✅ NEW: all users for dropdown
    async getAllUsers() {
        return await user_model_1.default.findAll({
            attributes: ["id", "First_Name", "Last_Name"],
        });
    }
    // ✅ NEW: find user by name
    async findByName(firstName, lastName) {
        return await user_model_1.default.findOne({
            where: {
                First_Name: firstName,
                Last_Name: lastName,
            },
        });
    }
    // ✅ NEW: quick stats
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
