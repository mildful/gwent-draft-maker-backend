import User from "../../domain/models/Card";

export default interface UserRepository {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
};
