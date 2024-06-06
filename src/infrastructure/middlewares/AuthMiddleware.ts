import { NextFunction, Request, Response } from 'express';
import { inject, injectable, named } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import { UnauthorizedError } from '../../domain/shared/Errors';
import Context from '../../domain/models/utils/Context';
import AuthStrategy from '../providers/auth/AuthStrategy';
import passport = require('passport');
import User from '../../domain/models/User';

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  constructor(
    @inject('Context') private context: Context,
    @inject('Passport') private readonly passport: passport.PassportStatic,
    @inject('AuthStrategy') @named('Local') private readonly localStrategy: AuthStrategy,
  ) {
    super();
  }

  public async handler(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.isAuthenticated()) {
      this.context.set('user', req.user as User);
      next();
    } else {
      next(new UnauthorizedError('Authentication required'));
    }
  }
}
