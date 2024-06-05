import { MUUID } from "uuid-mongodb";
import { CollectionNames } from "../CollectionDefinitions";

export interface MongoDbUserEntity {
  _id: MUUID;
  email: string;
  sessionToken: string;
  authenticationData: MongoDbUserAuthenticationData;
}

export interface MongoDbUserAuthenticationData {
  [providerName: string]: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    scope: string[];
  }
}

export default interface MongoDbEntities {
  [CollectionNames.USERS]: MongoDbUserEntity,
}
