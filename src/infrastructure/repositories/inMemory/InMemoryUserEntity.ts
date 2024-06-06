import User from "../../../domain/models/User";

export type UserEntity = Pick<User, 'email' | 'id' | 'password'>;