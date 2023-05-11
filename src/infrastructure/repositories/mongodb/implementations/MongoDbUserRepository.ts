import User from "../../../../domain/models/User";
import UserRepository from "../../UserRepository";
import MongoDbRepository from "../MongoDbRepository";
import { CollectionNames } from "../CollectionDefinitions";

export default class MongoDbUserRepository extends MongoDbRepository implements UserRepository {
  async getById(id: string): Promise<User> {
    const result = await this.collections(CollectionNames.USERS).findOne({
      id,
    });
    this.logger.debug('coucou', result);
    throw new Error("Method not implemented.");
  }

  async save(user: User): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
