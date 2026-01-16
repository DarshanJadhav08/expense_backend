import AuthUser from "../model/auth-user.model";

class AuthUserRepo {
  create(data: any, options?: any) {
    return AuthUser.create(data, options);
  }

  findByName(first: string, last: string) {
    return AuthUser.findOne({
      where: { first_name: first, last_name: last },
    });
  }
}

export default new AuthUserRepo();
