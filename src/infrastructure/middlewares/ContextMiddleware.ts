import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import Context from '../../domain/models/utils/Context';

export class ContextMiddleware {
  constructor(private readonly context: Context) {}

  public initContext(req: Request, res: Response, next: NextFunction): void {
    this.context.start();
    this.context.set('traceId', randomUUID());
    this.context.set('routePath', req.path);
    this.context.set('method', req.method);
    next();
  }
}
