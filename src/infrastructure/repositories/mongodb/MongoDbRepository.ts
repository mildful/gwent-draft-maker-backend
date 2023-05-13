import { injectable, inject } from "inversify";
import { Collection, CollectionOptions, Document } from "mongodb";
import Logger from '../../../domain/models/utils/Logger';
import MongoDbLayer from './MongoDbLayer';

@injectable()
export default abstract class MongoDbRepository {
  constructor(
    @inject('Logger') protected readonly logger: Logger,
    @inject('MongoDbLayer') protected readonly layer: MongoDbLayer,
  ) { }

  protected collections<T extends Document>(name: string, options?: CollectionOptions): Collection<T> {
    return this.layer.database.collection<T>(name, options);
  }
}
