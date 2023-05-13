import { NextFunction, Request, Response } from 'express';
import User from '../../../domain/models/User';
import { Validator } from '../../../domain/shared/Validator';
import { AbstractJwtSessionProvider } from './AbstractJwtSessionProvider';

export interface SessionToken {
  token: string;
  expiresIn: number;
}

export class JwtBearerSessionProvider extends AbstractJwtSessionProvider {
  public async extract(req: Request, res: Response, next: NextFunction): Promise<void> {
    const headerValue = req.header(this.headerName);
    if (Validator.isNonEmptyString(headerValue) && headerValue.startsWith(this.headerPrefix)) {
      const headerToken = headerValue.replace(`${this.headerPrefix} `, '');

      if (Validator.isNonEmptyString(headerToken)) {
        try {
          const token = await this.verifyToken(headerToken);
          if (Validator.isObject(token) && Validator.isNonEmptyString(token.sub)) {
            this.context.set('userId', token.sub);
            if (Validator.isNonEmptyString(token.salt)) {
              this.context.set('sessionToken', token.salt);
            }
          }
        } catch (e) {
          if (e.message !== 'jwt expired') {
            this.logger.warn(
              '[JwtBearerSessionProvider] Error token',
              { message: e.message, stack: e.stack, token: headerValue },
            );
          }
        }
      }
    }

    next();
  }

  public async generateToken(user: User): Promise<SessionToken> {
    if (User.isValid(user)) {
      const token = await this.signToken(
        { sub: user.id, salt: user.sessionToken },
        { expiresIn: this.tokenLifeTime, jwtid: (this.context.get('traceId') as string) },
      );

      return {
        token,
        expiresIn: this.tokenLifeTime,
      };
    }

    // todo proper error handling
    throw new Error('invalid user');
  }
}
