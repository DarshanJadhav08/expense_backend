"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_service_1 = __importDefault(require("../service/User.service"));
class UserController {
    constructor() {
        this.register = async (req, reply) => reply.send(await User_service_1.default.register(req.body));
        this.login = async (req, reply) => reply.send(await User_service_1.default.login(req.body.first_name, req.body.last_name, req.body.password));
        this.create = async (req, reply) => reply.send(await User_service_1.default.create(req.body));
        this.addMoneyByName = async (req, reply) => reply.send(await User_service_1.default.addMoneyByName(req.body.first_name, req.body.last_name, req.body.add_amount));
        this.addExpense = async (req, reply) => reply.send(await User_service_1.default.addExpense(Number(req.params.id), req.body.expense, req.body.category, req.body.description));
        this.getUsers = async (_, reply) => reply.send(await User_service_1.default.getAllUsers());
        this.quickStats = async (_, reply) => reply.send(await User_service_1.default.quickStats());
        this.delete = async (req, reply) => reply.send(await User_service_1.default.delete(Number(req.params.id)));
    }
}
exports.default = new UserController();
