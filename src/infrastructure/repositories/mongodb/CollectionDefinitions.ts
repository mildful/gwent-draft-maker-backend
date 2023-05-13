import { MongoDbCollectionDefinition } from "./MongoDbCollectionManager";

export enum CollectionNames {
  USERS = 'users',
};

export const collectionDefinitions: MongoDbCollectionDefinition[] = [
  {
    name: CollectionNames.USERS,
    indexes: {
      email: 1,
    },
  },
];
