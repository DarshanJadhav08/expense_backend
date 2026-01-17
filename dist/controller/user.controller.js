"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_service_1 = __importDefault(require("../service/User.service"));
const pdfkit_1 = __importDefault(require("pdfkit"));
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
    // ===============================
    // ✅ GENERATE REPORT (SCREEN)
    // ===============================
    async generateReport(req, reply) {
        try {
            const { first_name, last_name } = req.query;
            const data = await User_service_1.default.generateReport(first_name, last_name);
            return reply.send({
                success: true,
                data,
            });
        }
        catch (error) {
            return reply.status(400).send({
                success: false,
                message: error.message,
            });
        }
    }
    // ===============================
    // ✅ DOWNLOAD REPORT (PDF)
    // ===============================
    async downloadReport(req, reply) {
        try {
            const { first_name, last_name } = req.query;
            const data = await User_service_1.default.generateReport(first_name, last_name);
            const doc = new pdfkit_1.default({ margin: 40 });
            reply.header("Content-Type", "application/pdf");
            reply.header("Content-Disposition", `attachment; filename=${first_name}_expense_report.pdf`);
            doc.pipe(reply.raw);
            doc.fontSize(20).text("Expense Report", { align: "center" });
            doc.moveDown();
            doc.fontSize(12).text(`Name: ${data.first_name} ${data.last_name}`);
            doc.text(`Generated At: ${data.generated_at}`);
            doc.moveDown();
            doc.text(`Total Amount     : ₹${data.total_amount}`);
            doc.text(`Spent Amount     : ₹${data.spent_amount}`);
            doc.text(`Remaining Amount : ₹${data.remaining_amount}`);
            doc.moveDown();
            doc.text(`Last Category    : ${data.last_category}`);
            doc.text(`Description      : ${data.last_description}`);
            doc.end();
        }
        catch (error) {
            reply.status(500).send({
                success: false,
                message: error.message,
            });
        }
    }
}
exports.default = new UserController();
