"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_service_1 = __importDefault(require("../service/User.service"));
class UserController {
    async create(req, rep) {
        try {
            const data = req.body;
            const result = await User_service_1.default.create(data);
            rep.status(201).send({
                success: true,
                message: "Money added successfully",
                result
            });
        }
        catch (error) {
            rep.status(404).send({
                success: false,
                error: error.message
            });
        }
    }
    async add_money(req, rep) {
        try {
            const { id } = req.params;
            const { add_amount } = req.body;
            const result = await User_service_1.default.update(id, add_amount);
            return rep.status(200).send({
                success: true,
                message: "Money added successfully",
                result,
            });
        }
        catch (error) {
            return rep.status(400).send({
                success: false,
                error: error.message,
            });
        }
    }
    // 3️⃣ ADD EXPENSE – खर्च add करणे
    async addExpense(req, reply) {
        try {
            const { id } = req.params;
            const { expense, category, description } = req.body;
            const result = await User_service_1.default.addExpense(id, expense, category, description);
            return reply.send({
                success: true,
                message: "Expense added successfully",
                data: result,
            });
        }
        catch (error) {
            return reply.status(400).send({
                success: false,
                message: error.message,
            });
        }
    }
    async delete(req, reply) {
        try {
            const { id } = req.params;
            const result = await User_service_1.default.delete(id);
            return reply.send({
                success: true,
                message: "Record deleted successfully",
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
}
exports.default = new UserController;
