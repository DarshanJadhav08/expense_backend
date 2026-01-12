import AuthUser from "../model/auth-user.model";

class AuthUserRepo {
  async create(data: any) {
    return await AuthUser.create(data);
  }

  async findByName(first: string, last: string) {
    return await AuthUser.findOne({
      where: { first_name: first, last_name: last },
    });
  }
}

export default new AuthUserRepo();
