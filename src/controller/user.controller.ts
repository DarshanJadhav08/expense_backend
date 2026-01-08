import {FastifyRequest,FastifyReply} from "fastify"
import UserService from "../service/User.service"

class UserController{
    async create(req:FastifyRequest,rep:FastifyReply){
        try{
            const data=req.body as any
            const result=await UserService.create(data)

            rep.status(201).send({
                success:true,
                message:"Money added successfully",
                result
            })

        }
        catch(error:any){
            rep.status(404).send({
                success:false,
                error:error.message
            })
        }
    }

    async add_money(req: FastifyRequest, rep: FastifyReply) {
  try {
    const { id } = req.params as any;
    const { add_amount } = req.body as any; 

    const result = await UserService.update(id, add_amount);

    return rep.status(200).send({
      success: true,
      message: "Money added successfully",
      result,
    });
  } catch (error: any) {
    return rep.status(400).send({
      success: false,
      error: error.message,
    });
  }
}


 // 3️⃣ ADD EXPENSE – खर्च add करणे
  async addExpense(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as any;
      const { expense, category, description } = req.body as any;

      const result = await UserService.addExpense(
        id,
        expense,
        category,
        description
      );

      return reply.send({
        success: true,
        message: "Expense added successfully",
        data: result,
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }

 async delete(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as any;

    const result = await UserService.delete(id);

    return reply.send({
      success: true,
      message: "Record deleted successfully",
      data: result,
    });
  } catch (error: any) {
    return reply.status(400).send({
      success: false,
      error: error.message,
    });
  }
}

}

export default  new UserController