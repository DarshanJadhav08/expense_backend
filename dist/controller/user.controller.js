"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_service_1 = __importDefault(require("../service/User.service"));
class UserController {
    // 1️⃣ CREATE USER / ACCOUNT
    async create(req, reply) {
        try {
            const data = req.body;
            console.log("📥 CREATE BODY:", data); // 🔥 DEBUG
            const result = await User_service_1.default.create(data);
            return reply.status(201).send({
                success: true,
                message: "Account created successfully",
                data: result
            });
        }
        catch (error) {
            console.error("❌ CREATE ERROR:", error);
            return reply.status(400).send({
                success: false,
                error: error.message
            });
        }
    }
    // 2️⃣ ADD MONEY
    async add_money(req, reply) {
        try {
            const { id } = req.params;
            const { add_amount } = req.body;
            console.log("💰 ADD MONEY:", { id, add_amount });
            const result = await User_service_1.default.update(id, add_amount);
            return reply.status(200).send({
                success: true,
                message: "Money added successfully",
                data: result
            });
        }
        catch (error) {
            console.error("❌ ADD MONEY ERROR:", error);
            return reply.status(400).send({
                success: false,
                error: error.message
            });
        }
    }
    // 3️⃣ ADD EXPENSE
    async addExpense(req, reply) {
        try {
            const { id } = req.params;
            const { expense, category, description } = req.body;
            console.log("🧾 ADD EXPENSE:", { id, expense });
            const result = await User_service_1.default.addExpense(id, expense, category, description);
            return reply.status(200).send({
                success: true,
                message: "Expense added successfully",
                data: result
            });
        }
        catch (error) {
            console.error("❌ ADD EXPENSE ERROR:", error);
            return reply.status(400).send({
                success: false,
                error: error.message
            });
        }
    }
    // 4️⃣ DELETE USER
    async delete(req, reply) {
        try {
            const { id } = req.params;
            const result = await User_service_1.default.delete(id);
            return reply.status(200).send({
                success: true,
                message: "Record deleted successfully",
                data: result
            });
        }
        catch (error) {
            console.error("❌ DELETE ERROR:", error);
            return reply.status(400).send({
                success: false,
                error: error.message
            });
        }
    }
}
exports.default = new UserController();
