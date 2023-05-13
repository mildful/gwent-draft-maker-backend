import { inject, injectable, named } from "inversify";
import UserRepository from "../../infrastructure/repositories/UserRepository";
import User from "../../domain/models/User";
import { UserNotFoundError } from '../../domain/errors/UserNotFoundError';
import { UserAlreadyExistsError } from '../../domain/errors/UserAlreadyExistsError';

@injectable()
export default class UserService {
  constructor(
    @inject('Repository') @named('User') private readonly userRepository: UserRepository,
  ) { }

  public async createUser(params: {
    email: string,
  }): Promise<User> {
    const emailExists = await this.userRepository.getByEmail(params.email);
    if (emailExists) {
      throw new UserAlreadyExistsError({ email: params.email });
    }

    const newUser = new User(params);
    await this.userRepository.save(newUser);
    return newUser;
  }

  public async testGetUser(email: string): Promise<User> {
    const user = this.userRepository.getByEmail(email);

    if (!user) {
      throw new UserNotFoundError({ email });
    }

    return user;
  }

  public toto(): void {
    // getPlayerByProvider
    
    // if (!playerInfo?.player) {
    //   throw new PlayerNotFoundError({ email: playerInfo.email, token: playerInfo.jwtAccountCreation });
    // }
  }
}
