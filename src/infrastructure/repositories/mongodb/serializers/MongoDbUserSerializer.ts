import User from '../../../../domain/models/Card';
import { MongoDbUserEntity } from '../entities/MongoDbUserEntity';

export abstract class MongoDbUserSerializer {
  public static toModel(entity: MongoDbUserEntity | null): User | null {
    return entity ? new User({
      id: entity._id.toString(),
      email: entity.email,
      password: entity.password,
    }) : null;
  }
}