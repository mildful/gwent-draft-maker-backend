import { NextFunction, Request, Response } from 'express';
import { inject, injectable, named } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import { UnauthorizedError } from '../../domain/shared/Errors';
import Context from '../../domain/models/utils/Context';
import User from '../../domain/models/Card';
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
    const token = req.header('test'); // TODO: handle the right header from Firebase

    if (!token) {
      return next();
    }

    const userId = await this.authProvider.verifyToken(token);

    if (userId) {
      this.context.set('userId', userId);
      next();
    } else {
      next(new UnauthorizedError('Authentication required'));
    }
  }
}
