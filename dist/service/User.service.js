"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../db/config"));
const auth_user_repo_1 = __importDefault(require("../repository/auth-user.repo"));
const user_repo_1 = __importDefault(require("../repository/user.repo"));
class UserService {
    async register(data) {
        const { first_name, last_name, password, Total_Amount } = data;
        const t = await config_1.default.transaction();
        try {
            const hashed = await bcryptjs_1.default.hash(password, 10);
            const authUser = await auth_user_repo_1.default.create({ first_name, last_name, password: hashed }, { transaction: t });
            const today = new Date();
            const expense = await user_repo_1.default.create({
                First_Name: first_name,
                Last_Name: last_name,
                Total_Amount,
                Spent_Amount: 0,
                Remaining_Amount: Total_Amount,
                Category: "N/A",
                Description: "Account Created",
                Date: today.getDate().toString(),
                Month: (today.getMonth() + 1).toString(),
                Year: today.getFullYear().toString(),
            }, { transaction: t });
            await t.commit();
            return { user_id: authUser.id, expense_id: expense.id };
        }
        catch (err) {
            await t.rollback();
            throw err;
        }
    }
    async login(first, last, password) {
        const user = await auth_user_repo_1.default.findByName(first, last);
        if (!user)
            throw new Error("Invalid credentials");
        const ok = await bcryptjs_1.default.compare(password, user.password);
        if (!ok)
            throw new Error("Invalid credentials");
        return { user_id: user.id, first_name: user.first_name };
    }
    async create(data) {
        data.Spent_Amount = 0;
        data.Remaining_Amount = data.Total_Amount;
        return user_repo_1.default.create(data);
    }
    async addMoneyByName(first, last, amount) {
        const user = await user_repo_1.default.findByName(first, last);
        const newTotal = user.Total_Amount + amount;
        const newRemain = newTotal - user.Spent_Amount;
        await user_repo_1.default.update(user.id, {
            Total_Amount: newTotal,
            Remaining_Amount: newRemain,
        });
        return { total_amount: newTotal, remaining_amount: newRemain };
    }
    async addExpense(id, expense, category, desc) {
        const user = await user_repo_1.default.findbyid(id);
        const spent = user.Spent_Amount + expense;
        const remain = user.Total_Amount - spent;
        if (remain < 0)
            throw new Error("Insufficient balance");
        await user_repo_1.default.update(id, {
            Spent_Amount: spent,
            Remaining_Amount: remain,
            Category: category,
            Description: desc,
        });
        return { spent_amount: spent, remaining_amount: remain };
    }
    getAllUsers() {
        return user_repo_1.default.getAllUsers();
    }
    quickStats() {
        return user_repo_1.default.getQuickStats();
    }
    delete(id) {
        return user_repo_1.default.delete(id);
    }
}
exports.default = new UserService();
