import User from "../../../domain/models/User";
import { UserEntity } from "./InMemoryUserEntity";

export default abstract class InMemoryUserSerializer {
  public static toModel(entity?: UserEntity): User | null {
    return entity ? new User(entity) : null;
  }

  public static toEntity(model: User): UserEntity {
    return {
      email: model.email,
      password: model.password,
      id: model.id,
    };
  }
}