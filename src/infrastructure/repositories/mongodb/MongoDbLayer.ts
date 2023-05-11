import { MongoClient, Db } from 'mongodb';

import Logger from '../../../domain/models/Logger';
import { ServerError } from '../../../domain/shared/Errors';
import MongoDbCollectionManager from './MongoDbCollectionManager';
import { collectionDefinitions } from './CollectionDefinitions';
// import { DynamoDbTableManager } from './DynamoDbTableManager';
// import { DynamoDbOptions } from './Entities';

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
// const { tablesDefinition } = require('./CollectionDefinitions');

export interface MongoDbLayerOptions {
  uri: string;
  databaseName: string;
}

export default class MongoDbLayer {
  public database: Db;
  
  private client: MongoClient;
  private logger: Logger;
  private databaseName: string;
  private collectionManager: MongoDbCollectionManager;

  constructor(options: MongoDbLayerOptions, logger: Logger) {
    this.logger = logger;
    this.logger.info(`[MongoDbLayer][constructor] options: ${JSON.stringify(options)}...`);

    this.client = new MongoClient(options.uri);
    this.databaseName = options.databaseName;

    // switch (options.environment) {
    //   case 'ci':
    // }

  }

  async initialize(): Promise<void> {
    try {
      this.logger.info(`[MongoDbLayer][initialize] Connecting to mongodb server...`);
      await this.client.connect();
      this.database = this.client.db(this.databaseName);
      await this.database.command({ ping: 1 });
      this.logger.info(`[MongoDbLayer][initialize] Successfully connected to mongodb server!`);
    } catch (e: unknown) {
      throw new ServerError("Couldn't connect to mongodb.");
    }

    this.collectionManager = new MongoDbCollectionManager(this.database, collectionDefinitions, this.logger);
    await this.collectionManager.initialize();
  }

  // async healthcheck(): Promise<void> {
  //   await this.tableManager.healthcheck();
  // }

  // async isTableDefined(tableName: string): Promise<boolean> {
  //   this.logger.debug(`Describing table: ${tableName}`);
  //   try {
  //     await this.tableManager.describeTable(tableName);
  //     return true;
  //   } catch (err) {
  //     if (err.code === 'ResourceNotFoundException') {
  //       return false;
  //     }
  //     throw err;
  //   }
  // }

  // public get client(): AWS.DynamoDB.DocumentClient {
  //   return this.docClient;
  // }
}
