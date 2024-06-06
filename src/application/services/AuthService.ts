import { inject, injectable, named } from "inversify";
import Logger from "../../domain/models/utils/Logger";
import User from "../../domain/models/User";
import UserRepository from "../../infrastructure/repositories/UserRepository";
import AuthProvider from "../../infrastructure/providers/auth/AuthProvider";
import { NotFoundError, ServerError } from "../../domain/shared/Errors";
import Hash from "../../domain/models/utils/Hash";
import { PasswordTooWeakError } from "../../domain/errors/PasswordTooWeakError";
import { NextFunction } from "express";

@injectable()
export class AuthService {
  constructor(
    @inject('Logger') private readonly logger: Logger,
    @inject('Hash') private readonly hash: Hash,
    @inject('AuthProvider') private readonly authProvider: AuthProvider,
    @inject('Repository') @named('User') private readonly userRepository: UserRepository,
  ) { }

  public async signup({ email, password }: { email: string, password: string }): Promise<User> {
    this.logger.info(`[AuthService][signup] Validating password...`);
    if (!User.validatePassword(password)) {
      throw new PasswordTooWeakError();
    }

    try {
      this.logger.info(`[AuthService][signup] Hashing password...`);
      const hashedPassword = await this.hash.hash(password);

      this.logger.info(`[AuthService][signup] Creating new user...`);
      const newUser = new User({ email, password: hashedPassword });

      this.logger.info(`[AuthService][signup] Saving new user...`);
      this.userRepository.save(newUser);

      return newUser;
    } catch (err) {
      this.logger.error(err);
      throw new ServerError(err);
    }
  }

  public async login(provider: string, req: Express.Request, next: NextFunction): Promise<User> {
    if (!this.authProvider.isProviderSupported(provider)) {
      throw new NotFoundError(`[AuthService][login] Provider "${provider}" is not supported.`);
    }

    return new Promise((resolve, reject) => {
      this.logger.info(`[AuthService][login] Authenticating using provider "${provider}"`);
      this.authProvider.getAuthenticateMiddleware(provider)(req, null, (returnValue: any) => {
        if (returnValue instanceof Error) {
          return reject(returnValue);
        }

        if (returnValue instanceof User) {
          return resolve(returnValue)
        }

        this.logger.error(`[AuthService][login] Something went wrong in the middleware handle.`)
        return reject(new ServerError());
      });
    });
  }
}