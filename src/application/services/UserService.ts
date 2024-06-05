import { inject, injectable, named } from "inversify";
import { genSalt } from 'bcrypt';
import UserRepository from "../../infrastructure/repositories/UserRepository";
import User from "../../domain/models/User";
import { UserNotFoundError } from '../../domain/errors/UserNotFoundError';
import { UserAlreadyExistsError } from '../../domain/errors/UserAlreadyExistsError';
import { CreateAuthenticationDataParams } from "../../domain/models/AuthenticationData";
import Logger from "../../domain/models/utils/Logger";

@injectable()
export default class UserService {
  constructor(
    @inject('Repository') @named('User') private readonly userRepository: UserRepository,
    @inject('Logger') private readonly logger: Logger,
  ) { }

  public async createNewUser(params: {
    email: string,
    authData: CreateAuthenticationDataParams
  }): Promise<User> {
    this.logger.info('[UserService][createNewUser] Checking if the mail is already taken');
    const emailExists = await this.userRepository.getByEmail(params.email);
    if (emailExists) {
      throw new UserAlreadyExistsError({ email: params.email });
    }

    const newUser = new User({
      email: params.email,
      authenticationData: params.authData,
    });
    newUser.sessionToken = await this.generateSalt();

    await this.userRepository.save(newUser, false);
    
    return newUser;
  }

  // public async testGetUser(email: string): Promise<User> {
  //   const user = this.userRepository.getByEmail(email);

  //   if (!user) {
  //     throw new UserNotFoundError({ email });
  //   }

  //   return user;
  // }

  private async generateSalt(): Promise<string> {
    return genSalt(10);
  }
}
