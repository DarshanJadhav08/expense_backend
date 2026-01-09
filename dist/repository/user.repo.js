"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
}
exports.default = new UserRepo;
