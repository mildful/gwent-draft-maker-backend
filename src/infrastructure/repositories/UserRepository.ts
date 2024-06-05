import User from "../../domain/models/User";

export default interface UserRepository {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  save(user: User, allowUpdate: boolean): Promise<void>;
};
