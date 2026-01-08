import User from "../model/user.model"

class UserRepo{
    async create(data:any){
        return await User.create(data)
    }

    async findbyid(id:string){
        return await User.findByPk(id)
    }

    async update(id:string,data:any){
        return await User.update(data,{where:{id}})
    }

    async delete(id:string){
        return await User.destroy({where:{id}})
    }
}
export default new UserRepo