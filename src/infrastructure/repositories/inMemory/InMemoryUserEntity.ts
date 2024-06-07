import User from "../../../domain/models/Card";

export type UserEntity = Pick<User, 'email' | 'id' | 'password'>;