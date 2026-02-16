"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../model/user.model"));
const sequelize_1 = require("sequelize");
class UserRepo {
    create(data, options) {
        return user_model_1.default.create(data, options);
    }
    findById(id) {
        return user_model_1.default.findByPk(id);
    }
    findByName(first, last) {
        return user_model_1.default.findOne({
            where: {
                first_name: first,
                last_name: last
            },
        });
    }
    update(id, data) {
        return user_model_1.default.update(data, { where: { id } });
    }
    getAll() {
        return user_model_1.default.findAll();
    }
    async quickStats() {
        const totals = await user_model_1.default.findOne({
            attributes: [
                [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("total_amount")), "total"],
                [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("expense_amount")), "spent"],
                [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("remaining_amount")), "remaining"],
            ],
            raw: true,
        });
        return {
            total: Number(totals?.total || 0),
            spent: Number(totals?.spent || 0),
            remaining: Number(totals?.remaining || 0),
        };
    }
}
exports.default = new UserRepo();
