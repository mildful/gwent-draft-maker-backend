import { NextFunction, Request, Response } from 'express';
import { inject, injectable, named } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import { UnauthorizedError } from '../../domain/shared/Errors';
import Context from '../../domain/models/utils/Context';
import AuthProvider from '../providers/auth/AuthProvider';

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  constructor(
    @inject('Context') private context: Context,
    @inject('Provider') @named('Auth') private authProvider: AuthProvider,
  ) {
    super();
  }

  public async handler(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.header('Authorization');

    if (!token) {
      return next();
    }

    let userId: string;
    try {
      userId = await this.authProvider.verifyToken(token);
      this.context.set('userId', userId);
      return next();
    } catch (err) {
      return next(err);
    }
  }
}
