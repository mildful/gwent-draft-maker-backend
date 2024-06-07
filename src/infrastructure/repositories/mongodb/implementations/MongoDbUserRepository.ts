import { from as MUUID } from "uuid-mongodb";
import User from "../../../../domain/models/Card";
import UserRepository from "../../UserRepository";
import MongoDbRepository from "../MongoDbRepository";
import { CollectionNames } from "../CollectionDefinitions";
import MongoDbEntities from "../entities/MongoDbUserEntity";
import { MongoDbUserSerializer } from '../serializers/MongoDbUserSerializer';
import { UpdateFilter } from "mongodb";

export default class MongoDbUserRepository extends MongoDbRepository implements UserRepository {
  public async getById(id: string): Promise<User | null> {
    this.logger.info('[MongoDbUserRepository][getById] Finding user by id', id);

    const result = await this
      .collections<MongoDbEntities[CollectionNames.USERS]>(CollectionNames.USERS)
      .findOne({
        id,
      });

    return MongoDbUserSerializer.toModel(result);
  }

  public async getByEmail(email: string): Promise<User | null> {
    this.logger.info('[MongoDbUserRepository][getByEmail] Finding user by mail', email);

    const result = await this
      .collections<MongoDbEntities[CollectionNames.USERS]>(CollectionNames.USERS)
      .findOne({
        email,
      });

    return MongoDbUserSerializer.toModel(result);
  }

  public async save(user: User, allowUpdate = true): Promise<void> {
    this.logger.info('[MongoDbUserRepository][save] saving user', user);

    if (allowUpdate) {
      // todo, gerer les updates
      const existingUser = await this.getByEmail(user.email);
      if (existingUser) {
        await this.updateExistingUser(existingUser, user);
      }
    }

    await this.insertNewUser(user);

    return;
  }

  public async insertNewUser(user: User): Promise<void> {
    await this
      .collections<MongoDbEntities[CollectionNames.USERS]>(CollectionNames.USERS)
      .insertOne({
        _id: MUUID(user.id),
        email: user.email,
        password: user.password,
      }, { forceServerObjectId: false });
  }

  public async updateExistingUser(previousUser: User, newUser: User): Promise<void> {
    throw new Error('Not implemeted yet!');

  }
}
