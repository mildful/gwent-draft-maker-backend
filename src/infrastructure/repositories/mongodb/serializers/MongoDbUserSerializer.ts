import { AuthenticationData, ProviderName } from '../../../../domain/models/AuthenticationData';
import User from '../../../../domain/models/User';
import { MongoDbUserEntity, MongoDbUserAuthenticationData } from '../entities/MongoDbUserEntity';

export abstract class MongoDbUserSerializer {
  public static toModel(entity: MongoDbUserEntity): User | null {
    return entity ? new User({
      id: entity._id.toString(),
      email: entity.email,
      sessionToken: entity.sessionToken,
      authenticationData: entity.authenticationData,
    }) : null;
  }

  // public static toEntity(model: User): MongoDbUserEntity {

  // }

  public static AuthenticationDataToEntity(model: AuthenticationData): MongoDbUserAuthenticationData {
    const entity: MongoDbUserAuthenticationData = {};
    Object.values(ProviderName).forEach((providerName) => {
      try {
        const tokens = model.getTokens(providerName);
        if (tokens) {
          entity[providerName] = tokens;
        }
      } catch(e) { }
    });
    return entity;
  }
}