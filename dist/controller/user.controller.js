"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_service_1 = __importDefault(require("../service/User.service"));
class UserController {
    // ✅ CREATE USER
    async create(req, reply) {
        const result = await User_service_1.default.create(req.body);
        return reply.status(201).send({
            success: true,
            message: "Account created successfully",
            data: result,
        });
    }
    // ❌ OLD add_money(id) REMOVED COMPLETELY
    // ✅ ADD MONEY BY NAME (ONLY THIS)
    async addMoneyByName(req, reply) {
        try {
            const { first_name, last_name, add_amount } = req.body;
            const result = await User_service_1.default.addMoneyByName(first_name, last_name, add_amount);
            return reply.send({
                success: true,
                message: "Money added successfully",
                data: result,
            });
        }
        catch (error) {
            return reply.status(400).send({
                success: false,
                error: error.message,
            });
        }
    }
    // ✅ ADD EXPENSE (ID still required internally)
    async addExpense(req, reply) {
        const { id } = req.params;
        const { expense, category, description } = req.body;
        const result = await User_service_1.default.addExpense(id, expense, category, description);
        return reply.send({
            success: true,
            message: "Expense added successfully",
            data: result,
        });
    }
    // ✅ GET ALL USERS
    async getUsers(req, reply) {
        const users = await User_service_1.default.getAllUsers();
        return reply.send({ success: true, data: users });
    }
    // ✅ QUICK STATS
    async quickStats(req, reply) {
        const stats = await User_service_1.default.quickStats();
        return reply.send({ success: true, data: stats });
    }
    // ✅ DELETE USER
    async delete(req, reply) {
        const { id } = req.params;
        const result = await User_service_1.default.delete(id);
        return reply.send({ success: true, data: result });
    }
}
exports.default = new UserController();
