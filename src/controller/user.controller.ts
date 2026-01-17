import { FastifyRequest, FastifyReply } from "fastify";
import UserService from "../service/User.service";
import PDFDocument from "pdfkit";

class UserController {

async register(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = await UserService.register(req.body);
    reply.send({ success: true, data });
  } catch (error: any) {
    reply.status(400).send({
      success: false,
      message: error.message,
    });
  }
}


  async login(req: FastifyRequest, reply: FastifyReply) {
    const data = await UserService.login(req.body);
    reply.send({ success: true, data });
  }

  // ===============================
  // ADD MONEY (USER ID BASED)
  // ===============================
  async addMoney(req: FastifyRequest, reply: FastifyReply) {
    const { user_id, amount, description } = req.body as any;

    const data = await UserService.addMoney(
      Number(user_id),
      amount,
      description
    );

    reply.send({ success: true, data });
  }

  // ===============================
  // ADD EXPENSE
  // ===============================
  async addExpense(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as any;
    const { amount, category, description } = req.body as any;

    const data = await UserService.addExpense(
      Number(id),
      amount,
      category,
      description
    );

    reply.send({ success: true, data });
  }

  // ===============================
  // QUICK STATS (LOGIN USER ONLY)
  // ===============================
  async quickStats(req: FastifyRequest, reply: FastifyReply) {
    const { user_id } = req.query as any;

    const data = await UserService.quickStats(Number(user_id));
    reply.send({ success: true, data });
  }

  // ===============================
  // GENERATE REPORT (SCREEN)
  // ===============================
  async generateReport(req: any, reply: any) {
    try {
      const { user_id } = req.query;

      const data = await UserService.generateReport(Number(user_id));

      return reply.send({ success: true, data });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }

  // ===============================
  // DOWNLOAD REPORT (PDF)
  // ===============================
  async downloadReport(req: any, reply: any) {
    try {
      const { user_id } = req.query;

      const data = await UserService.generateReport(Number(user_id));

      const doc = new PDFDocument({ margin: 40 });

      reply.header("Content-Type", "application/pdf");
      reply.header(
        "Content-Disposition",
        `attachment; filename=expense_report_${user_id}.pdf`
      );

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
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new UserController();
