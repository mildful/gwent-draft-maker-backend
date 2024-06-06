import { inject, injectable, named } from "inversify";
import passport = require("passport");
import AuthStrategy from "./AuthStrategy";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";
import User from "../../../domain/models/User";
import UserRepository from "../../repositories/UserRepository";
import { ServerError } from "../../../domain/shared/Errors";
import Logger from "../../../domain/models/utils/Logger";
import { Middleware } from "inversify-express-utils";
import { NextFunction, Request, Response } from "express";

const SUPPORTED_PROVIDERS = ["local"] as const;
type SUPPORTED_PROVIDERS = typeof SUPPORTED_PROVIDERS[number];

@injectable()
export default class AuthProvider {
  constructor(
    @inject('Logger') private readonly logger: Logger,
    @inject('Passport') private readonly passport: passport.PassportStatic,
    @inject('Repository') @named('User') private readonly userRepository: UserRepository,
    @inject('AuthStrategy') @named('Local') private readonly localStrategy: AuthStrategy,
  ) {
    this.passport.use(this.localStrategy.getStrategy());

    this.passport.serializeUser((user: User, done) => {
      done(null, user.id);
    });
    this.passport.deserializeUser(async (id: User['id'], done) => {
      const user = await this.userRepository.getById(id);
      if (!user) {
        done(new UserNotFoundError({ id }));
      }
      done(null, user);
    });
  }

  public getAuthenticateMiddleware(provider: SUPPORTED_PROVIDERS) {
    return (req: Express.Request, res: null, next: NextFunction) => {
      this.passport.authenticate(provider, (toto: any) => {
        console.log(toto)
        // this.passport.authenticate(provider, (err: any, user: User) => {
        // if (err) {
        //   this.logger.error(`[AuthProvider][authenticate] Error thrown by passport.authenticate`, err);
        //   return next(err);
        // }

        // if (!user) {
        //   return next(new UserNotFoundError({}))
        // }

        // req.logIn(user, (err) => {
        //   if (err) {
        //     this.logger.error(`[AuthProvider][authenticate] Error during req.logIn`, err);
        //     return next(new ServerError('Something went wrong.'));
        //   }
        //   next();
        // });
      })(req, res, next);
    }
  }

  public isProviderSupported(providerName: string): providerName is SUPPORTED_PROVIDERS {
    return SUPPORTED_PROVIDERS.includes(providerName as SUPPORTED_PROVIDERS);
  }
}