"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const user_controller_1 = __importDefault(require("../controller/user.controller"));
async function userRoutes(app) {
    app.post("/register", user_controller_1.default.register);
    app.post("/login", user_controller_1.default.login);
    app.post("/add-money", user_controller_1.default.addMoney);
    app.post("/user/:id/expense", user_controller_1.default.addExpense);
    app.get("/quick-stats", user_controller_1.default.quickStats);
}
