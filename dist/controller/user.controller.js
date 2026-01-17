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
            return reply.status(400).send({ success: false, message: e.message });
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
            const doc = new pdfkit_1.default({ margin: 40 });
            // ✅ RAW RESPONSE ONLY
            const res = reply.raw;
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "attachment; filename=expense_report.pdf");
            // ✅ PIPE FIRST
            doc.pipe(res);
            // ✅ PDF CONTENT
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
            // ✅ END ONCE
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
