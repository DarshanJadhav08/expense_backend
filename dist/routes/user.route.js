"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserRoute;
const user_controller_1 = __importDefault(require("../controller/user.controller"));
async function UserRoute(app) {
    app.post("/create", user_controller_1.default.create);
    app.put("/add-money/:id", user_controller_1.default.add_money);
    app.put("/add-expense/:id", user_controller_1.default.addExpense);
    app.delete("/delete/:id", user_controller_1.default.delete);
}
