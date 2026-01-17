import AuthUser from "../model/auth-user.model";

class AuthUserRepo {
  create(data: any) {
    return AuthUser.create(data);
  }

  findByName(first_name: string, last_name: string) {
    return AuthUser.findOne({
      where: { first_name, last_name },
    });
  }
}

export default new AuthUserRepo();
