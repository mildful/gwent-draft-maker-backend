import User from '../../../../domain/models/User';
import { MongoDbUserEntity } from '../entities/MongoDbUserEntity';

export abstract class MongoDbUserSerializer {
  public static toModel(entity: MongoDbUserEntity): User | null {
    return entity ? new User({
      id: entity._id.toString(),
      email: entity.email,
      sessionToken: entity.sessionToken,
    }) : null;
  }

  // public static toEntity(model: User): MongoDbUserEntity {

  // }
}