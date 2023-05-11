import { NextFunction, Request, Response } from 'express';
import { inject, injectable, named } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import { UnauthorizedError } from '../../domain/shared/Errors';
import Context from '../../domain/models/Context';
import UserRepository from '../repositories/UserRepository';

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  constructor(
    @inject('Context') private context: Context,
    @inject('Repository') @named('User') private readonly userRepository: UserRepository,
  ) {
    super();
  }

  public async handler(req: Request, res: Response, next: NextFunction): Promise<void> {
    // todo : SET IT SOMEWHERE
    const userId = this.context.get('userId');
    if (userId) {
      const user = await this.userRepository.getById(userId);
      if (user && user.sessionToken === this.context.get('sessionToken')) {
        this.context.set('user', user);
        return next();
      }
    }
    return next(new UnauthorizedError('Authentication required'));
  }
}
