"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_user_repo_1 = __importDefault(require("../repository/auth-user.repo"));
const user_repo_1 = __importDefault(require("../repository/user.repo"));
const config_1 = __importDefault(require("../db/config"));
class UserService {
    // ===============================
    // REGISTER
    // ===============================
    async register(data) {
        const { first_name, last_name, password, total_amount } = data;
        if (!first_name || !last_name || !password) {
            throw new Error("first_name, last_name and password are required");
        }
        const exists = await auth_user_repo_1.default.findByName(first_name, last_name);
        if (exists) {
            throw new Error("User already registered");
        }
        const t = await config_1.default.transaction();
        try {
            const hash = await bcryptjs_1.default.hash(password, 10);
            const authUser = await auth_user_repo_1.default.create({
                first_name,
                last_name,
                password: hash,
            }, { transaction: t });
            await user_repo_1.default.create({
                id: authUser.id,
                first_name,
                last_name,
                total_amount: total_amount || 0,
                expense_amount: 0,
                remaining_amount: total_amount || 0,
                category: "Initial",
                description: "Account created",
                created_at: new Date(),
            }, { transaction: t });
            await t.commit();
            return {
                id: authUser.id,
                first_name,
                last_name,
            };
        }
        catch (err) {
            await t.rollback();
            throw err;
        }
    }
    // ===============================
    // LOGIN
    // ===============================
    async login(data) {
        const { first_name, last_name, password } = data;
        const authUser = await auth_user_repo_1.default.findByName(first_name, last_name);
        if (!authUser)
            throw new Error("User not found");
        const ok = await bcryptjs_1.default.compare(password, authUser.password);
        if (!ok)
            throw new Error("Invalid password");
        const expense = await user_repo_1.default.findById(authUser.id);
        if (!expense)
            throw new Error("Expense record not found");
        return {
            id: authUser.id,
            first_name,
            last_name,
            total_amount: expense.total_amount,
            expense_amount: expense.expense_amount,
            remaining_amount: expense.remaining_amount,
        };
    }
    // ===============================
    // ADD MONEY
    // ===============================
    async addMoney(first, last, amount, description) {
        const record = await user_repo_1.default.findByName(first, last);
        if (!record)
            throw new Error("Expense record not found");
        await user_repo_1.default.incrementAmounts(record.id, {
            total_amount: amount,
            remaining_amount: amount,
            description: description,
        });
        const updated = await user_repo_1.default.findById(record.id);
        return { total: updated.total_amount, remaining: updated.remaining_amount };
    }
    // ===============================
    // ADD EXPENSE
    // ===============================
    async addExpense(id, amount, category, description) {
        const record = await user_repo_1.default.findById(id);
        if (!record)
            throw new Error("Expense record not found");
        if (record.remaining_amount < amount)
            throw new Error("Insufficient balance");
        await user_repo_1.default.incrementAmounts(id, {
            expense_amount: amount,
            remaining_amount: -amount,
            category: category,
            description: description,
        });
        const updated = await user_repo_1.default.findById(id);
        return { spent: updated.expense_amount, remaining: updated.remaining_amount };
    }
    // ===============================
    // QUICK STATS
    // ===============================
    async quickStats(user_id) {
        const record = await user_repo_1.default.findById(user_id);
        if (!record)
            throw new Error("User not found");
        return {
            total_amount: record.total_amount,
            spent_amount: record.expense_amount,
            remaining_amount: record.remaining_amount,
        };
    }
    // ===============================
    // GENERATE REPORT
    // ===============================
    async generateReport(user_id) {
        const record = await user_repo_1.default.findById(user_id);
        if (!record)
            throw new Error("User not found");
        return {
            first_name: record.first_name,
            last_name: record.last_name,
            total_amount: record.total_amount,
            spent_amount: record.expense_amount,
            remaining_amount: record.remaining_amount,
            last_category: record.category,
            last_description: record.description,
            generated_at: new Date().toISOString(),
        };
    }
}
exports.default = new UserService();
