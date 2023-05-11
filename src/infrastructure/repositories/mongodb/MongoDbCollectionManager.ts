import { Collection, Document, Db } from "mongodb";
import Logger from "../../../domain/models/Logger";

export interface MongoDbCollectionDefinition {
  name: string;
};

export default class MongoDbCollectionManager {
  private database: Db;
  private collectionDefinitions: MongoDbCollectionDefinition[];
  private logger: Logger;

  constructor(
    database: Db,
    collectionDefinitions: MongoDbCollectionDefinition[],
    logger: Logger,
  ) {
    this.database = database;
    this.collectionDefinitions = collectionDefinitions;
    this.logger = logger;
  }

  public async initialize(): Promise<Collection<Document>[]> {
    this.logger.info(`[MongoDbCollectionManager][initialize] creating collections`);
    return Promise.all(this.collectionDefinitions.map((definition) => {
      return this.database.createCollection(definition.name);
    }));
  }
}
