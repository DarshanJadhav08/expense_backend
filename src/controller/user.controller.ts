import { FastifyRequest, FastifyReply } from "fastify";
import UserService from "../service/User.service";
import PDFDocument from "pdfkit";

class UserController {

  async register(req: FastifyRequest, reply: FastifyReply) {
    const data = await UserService.register(req.body);
    reply.send({ success: true, data });
  }

  async login(req: FastifyRequest, reply: FastifyReply) {
    const data = await UserService.login(req.body);
    reply.send({ success: true, data });
  }

  async addMoney(req: FastifyRequest, reply: FastifyReply) {
    const { first_name, last_name, amount, description } = req.body as any;
    const data = await UserService.addMoney(
      first_name,
      last_name,
      amount,
      description
    );
    reply.send({ success: true, data });
  }

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

  async quickStats(_: FastifyRequest, reply: FastifyReply) {
    const data = await UserService.quickStats();
    reply.send({ success: true, data });
  }
   // ===============================
  // ✅ GENERATE REPORT (SCREEN)
  // ===============================
  async generateReport(req: any, reply: any) {
    try {
      const { first_name, last_name } = req.query;

      const data = await UserService.generateReport(first_name, last_name);

      return reply.send({
        success: true,
        data,
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }

  // ===============================
  // ✅ DOWNLOAD REPORT (PDF)
  // ===============================
  async downloadReport(req: any, reply: any) {
    try {
      const { first_name, last_name } = req.query;

      const data = await UserService.generateReport(first_name, last_name);

      const doc = new PDFDocument({ margin: 40 });

      reply.header("Content-Type", "application/pdf");
      reply.header(
        "Content-Disposition",
        `attachment; filename=${first_name}_expense_report.pdf`
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
