import { inject, injectable } from "inversify";
import User from "../../../domain/models/User";
import Logger from "../../../domain/models/utils/Logger";
import UserRepository from "../UserRepository";
import { UserEntity } from "./InMemoryUserEntity";
import InMemoryUserSerializer from "./InMemoryUserSerializer";

@injectable()
export default class InMemoryUserRepository implements UserRepository {
  constructor(
    @inject('Logger') private readonly logger: Logger,
  ) { }

  private users: Map<string, UserEntity> = new Map();

  getById(id: string): Promise<User | null> {
    return new Promise((resolve) => {
      const maybeUser = this.users.get(id);
      if (!maybeUser) {
        resolve(null);
      }
      resolve(InMemoryUserSerializer.toModel(maybeUser));
    })
  }

  getByEmail(email: string): Promise<User | null> {
    console.log('*******')
    console.log(this.users)
    return new Promise((resolve) => {
      const maybeUser = [...this.users.values()].find(user => user.email === email);
      if (!maybeUser) {
        resolve(null);
      }
      resolve(InMemoryUserSerializer.toModel(maybeUser));
    });

  }

  save(user: User): Promise<void> {
    return new Promise((resolve) => {
      this.users.set(user.id, InMemoryUserSerializer.toEntity(user));
      resolve();
    });
  }
}