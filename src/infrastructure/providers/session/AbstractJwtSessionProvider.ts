import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Validator } from '../../../domain/shared/Validator';
import Context from '../../../domain/models/utils/Context';
import Logger from '../../../domain/models/utils/Logger';

export interface JwtSessionParams {
  headerName: string;
  tokenLifeTime: number;
  tokenPassPhrase: string;
}

export abstract class AbstractJwtSessionProvider {
  protected headerName: string;
  protected headerPrefix: string;
  protected readonly tokenLifeTime: number;
  protected readonly tokenPassPhrase: string;

  constructor(
    protected readonly context: Context,
    protected readonly logger: Logger,
    params: JwtSessionParams,
  ) {
    Validator.validate(Validator.isObject(params), 'Invalid JWT cookie session provider parameters');
    const { tokenLifeTime } = params;
    Validator.validate(
      Validator.isNumber(tokenLifeTime) && tokenLifeTime > 0, 'JWT token lifetime must be a positive number',
    );
    Validator.validate(
      Validator.isNonEmptyString(params.tokenPassPhrase), 'JWT token passphrase must be a non-empty string',
    );
    this.tokenLifeTime = params.tokenLifeTime;
    this.tokenPassPhrase = params.tokenPassPhrase.trim();
    this.headerName = 'Authorization';
    this.headerPrefix = 'Bearer';
  }

  protected signToken(payload: object, options: jwt.SignOptions): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(payload, this.tokenPassPhrase, options, (err, token) => {
        if (err || !token) {
          return reject(err);
        }

        return resolve(token);
      });
    });
  }

  protected verifyToken(token: string): Promise<unknown> {
    return new Promise<unknown>((resolve, reject) => {
      jwt.verify(token, this.tokenPassPhrase, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      });
    });
  }

  public abstract extract(req: Request, res: Response, next: NextFunction): Promise<void>;
}
