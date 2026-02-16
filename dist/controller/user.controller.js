"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_service_1 = __importDefault(require("../service/User.service"));
const pdfkit_1 = __importDefault(require("pdfkit"));
class UserController {
    async register(req, reply) {
        try {
            const data = await User_service_1.default.register(req.body);
            return reply.send({ success: true, data });
        }
        catch (e) {
            return reply.status(400).send({
                success: false,
                message: e.message,
            });
        }
    }
    async login(req, reply) {
        try {
            const data = await User_service_1.default.login(req.body);
            return reply.send({ success: true, data });
        }
        catch (e) {
            return reply.status(400).send({ success: false, message: e.message });
        }
    }
    async addMoney(req, reply) {
        try {
            const { first_name, last_name, amount, description } = req.body;
            const data = await User_service_1.default.addMoney(first_name, last_name, amount, description);
            reply.send({
                success: true,
                message: "Money added successfully",
                data: {
                    amount_added: amount,
                    new_total: data.total,
                    new_remaining: data.remaining,
                    description
                }
            });
        }
        catch (e) {
            reply.status(400).send({ success: false, message: e.message });
        }
    }
    async addExpense(req, reply) {
        try {
            const { id } = req.params;
            const { amount, category, description } = req.body;
            const data = await User_service_1.default.addExpense(Number(id), amount, category, description);
            reply.send({
                success: true,
                message: "Expense added successfully",
                data: {
                    expense_amount: amount,
                    category,
                    description,
                    new_spent: data.spent,
                    new_remaining: data.remaining
                }
            });
        }
        catch (e) {
            reply.status(400).send({ success: false, message: e.message });
        }
    }
    // ===============================
    // QUICK STATS
    // ===============================
    async quickStats(req, reply) {
        const { user_id } = req.query;
        const data = await User_service_1.default.quickStats(Number(user_id));
        reply.send({ success: true, data });
    }
    // ===============================
    // GENERATE REPORT (JSON)
    // ===============================
    async generateReport(req, reply) {
        const { user_id } = req.query;
        const data = await User_service_1.default.generateReport(Number(user_id));
        reply.send({ success: true, data });
    }
    downloadReport(req, reply) {
        const { user_id } = req.query;
        User_service_1.default.generateReport(Number(user_id))
            .then((data) => {
            const doc = new pdfkit_1.default({ margin: 50, size: 'A4' });
            const res = reply.raw;
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "attachment; filename=expense_report.pdf");
            doc.pipe(res);
            // Header
            doc.fontSize(24).fillColor('#2c3e50').text("💰 Expense Report", { align: "center" });
            doc.moveDown(0.5);
            doc.fontSize(10).fillColor('#7f8c8d').text(new Date(data.generated_at).toLocaleString(), { align: "center" });
            doc.moveDown(2);
            // User Info Section
            doc.fontSize(14).fillColor('#34495e').text("User Information", { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(11).fillColor('#2c3e50');
            doc.text(`Name: ${data.first_name} ${data.last_name}`, { indent: 20 });
            doc.moveDown(1.5);
            // Financial Summary Section
            doc.fontSize(14).fillColor('#34495e').text("Financial Summary", { underline: true });
            doc.moveDown(0.5);
            const startY = doc.y;
            doc.fontSize(11).fillColor('#27ae60');
            doc.text(`Total Amount:`, 70, startY);
            doc.text(`₹${data.total_amount}`, 250, startY, { align: 'left' });
            doc.fillColor('#e74c3c');
            doc.text(`Spent Amount:`, 70, doc.y + 5);
            doc.text(`₹${data.spent_amount}`, 250, doc.y, { align: 'left' });
            doc.fillColor('#3498db');
            doc.text(`Remaining Amount:`, 70, doc.y + 5);
            doc.text(`₹${data.remaining_amount}`, 250, doc.y, { align: 'left' });
            doc.moveDown(1.5);
            // Last Transaction Section
            doc.fontSize(14).fillColor('#34495e').text("Last Transaction", { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(11).fillColor('#2c3e50');
            doc.text(`Category: ${data.last_category}`, { indent: 20 });
            doc.text(`Description: ${data.last_description}`, { indent: 20 });
            // Footer
            doc.fontSize(8).fillColor('#95a5a6').text("Generated by Expense Tracker System", 50, doc.page.height - 50, { align: "center" });
            doc.end();
        })
            .catch((err) => {
            if (!reply.raw.headersSent) {
                reply.status(500).send({
                    success: false,
                    message: err.message,
                });
            }
        });
    }
}
exports.default = new UserController();
