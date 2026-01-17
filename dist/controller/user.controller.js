"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_service_1 = __importDefault(require("../service/User.service"));
class UserController {
    async register(req, reply) {
        const data = await User_service_1.default.register(req.body);
        reply.send({ success: true, data });
    }
    async login(req, reply) {
        const data = await User_service_1.default.login(req.body);
        reply.send({ success: true, data });
    }
    async addMoney(req, reply) {
        const { first_name, last_name, amount, description } = req.body;
        const data = await User_service_1.default.addMoney(first_name, last_name, amount, description);
        reply.send({ success: true, data });
    }
    async addExpense(req, reply) {
        const { id } = req.params;
        const { amount, category, description } = req.body;
        const data = await User_service_1.default.addExpense(Number(id), amount, category, description);
        reply.send({ success: true, data });
    }
    async quickStats(_, reply) {
        const data = await User_service_1.default.quickStats();
        reply.send({ success: true, data });
    }
}
exports.default = new UserController();
