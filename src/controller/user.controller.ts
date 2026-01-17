import { FastifyRequest, FastifyReply } from "fastify";
import UserService from "../service/User.service";
import PDFDocument from "pdfkit";

class UserController {

  async register(req: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await UserService.register(req.body);
      return reply.send({ success: true, data });
    } catch (e: any) {
      return reply.status(400).send({ success: false, message: e.message });
    }
  }

  async login(req: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await UserService.login(req.body);
      return reply.send({ success: true, data });
    } catch (e: any) {
      return reply.status(400).send({ success: false, message: e.message });
    }
  }

  async addMoney(req: any, reply: any) {
    const { first_name, last_name, amount, description } = req.body;
    const data = await UserService.addMoney(first_name, last_name, amount, description);
    reply.send({ success: true, data });
  }

  async addExpense(req: any, reply: any) {
    const { id } = req.params;
    const { amount, category, description } = req.body;
    const data = await UserService.addExpense(Number(id), amount, category, description);
    reply.send({ success: true, data });
  }

  // ===============================
  // QUICK STATS
  // ===============================
  async quickStats(req: any, reply: any) {
    const { user_id } = req.query;
    const data = await UserService.quickStats(Number(user_id));
    reply.send({ success: true, data });
  }

  // ===============================
  // GENERATE REPORT (JSON)
  // ===============================
  async generateReport(req: any, reply: any) {
    const { user_id } = req.query;
    const data = await UserService.generateReport(Number(user_id));
    reply.send({ success: true, data });
  }

downloadReport(req: any, reply: any) {
  const { user_id } = req.query;

  UserService.generateReport(Number(user_id))
    .then((data: any) => {

      const doc = new PDFDocument({ margin: 40 });

      // ✅ RAW RESPONSE ONLY
      const res = reply.raw;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=expense_report.pdf"
      );

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
    .catch((err: any) => {
      if (!reply.raw.headersSent) {
        reply.status(500).send({
          success: false,
          message: err.message,
        });
      }
    });
}
}

export default new UserController();
