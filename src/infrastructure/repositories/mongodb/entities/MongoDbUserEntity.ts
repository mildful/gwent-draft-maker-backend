import { MUUID } from "uuid-mongodb";
import { CollectionNames } from "../CollectionDefinitions";

export interface MongoDbUserEntity {
  _id: MUUID;
  email: string;
  password: string;
}

export default interface MongoDbEntities {
  [CollectionNames.USERS]: MongoDbUserEntity,
}
