import { injectable, inject } from "inversify";
import { Collection, CollectionOptions } from "mongodb";
import Logger from '../../../domain/models/Logger';
import MongoDbLayer from './MongoDbLayer';

@injectable()
export default abstract class MongoDbRepository {
  constructor(
    @inject('Logger') protected readonly logger: Logger,
    @inject('MongoDbLayer') protected readonly layer: MongoDbLayer,
  ) { }

  protected collections(name: string, options?: CollectionOptions): Collection<Document> {
    return this.layer.database.collection(name, options);
  }
}
