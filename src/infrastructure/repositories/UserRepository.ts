import User from "../../domain/models/User";

export default interface UserRepository {
  getById(id: string): Promise<User>;
  save(user: User): Promise<void>;
};
