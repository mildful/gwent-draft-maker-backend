import { Collection, Document, Db, IndexDescription } from "mongodb";
import Logger from "../../../domain/models/utils/Logger";

export interface MongoDbCollectionDefinition {
  name: string;
  indexes?: { [key: string]: number },
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

    const existingCollectionNames: string[] = (await this.database.listCollections().toArray())
      .map((collection) => collection.name);

    return Promise.all(
      this.collectionDefinitions
        .map((definition) => {
          if (existingCollectionNames.includes(definition.name)) {
            this.logger.info(`[MongoDbCollectionManager][initialize] Collection "${definition.name}" already exists. Skipping.`);
            return null;
          }
          
          return this.createCollection(definition);
        }).filter((promise) => promise !== null)
    );
  }

  private async createCollection(definition: MongoDbCollectionDefinition): Promise<Collection<Document>> {
    const indexDescritpions: IndexDescription[] = [];

    for (let indexKey in definition.indexes) {
      indexDescritpions.push({ key: {
        [indexKey]: definition.indexes[indexKey],
      }});
    }

    const collection = await this.database.createCollection(definition.name);
    if (definition.indexes) {
      await collection.createIndexes(indexDescritpions);
    }
    return collection;
  }
}
