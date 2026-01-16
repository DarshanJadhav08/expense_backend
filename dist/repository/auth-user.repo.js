"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_user_model_1 = __importDefault(require("../model/auth-user.model"));
class AuthUserRepo {
    create(data, options) {
        return auth_user_model_1.default.create(data, options);
    }
    findByName(first, last) {
        return auth_user_model_1.default.findOne({
            where: { first_name: first, last_name: last },
        });
    }
}
exports.default = new AuthUserRepo();
